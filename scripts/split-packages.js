#!/usr/bin/env node

const cp = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PACKAGES_ROOT = path.join(ROOT, "packages");
const DEPENDENCY_SECTIONS = ["dependencies", "peerDependencies", "devDependencies"];
const NPM = process.platform === "win32" ? "npm.cmd" : "npm";
const dryRun = process.argv.includes("--dry-run");

function git(args, options = {}) {
  return cp.execFileSync("git", args, {
    cwd: options.cwd ?? ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  }).trim();
}

function readManifest(manifestPath) {
  return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
}

function findManifestPaths(directory) {
  const manifests = [];
  function visit(currentDirectory) {
    for (const entry of fs.readdirSync(currentDirectory, { withFileTypes: true })) {
      if (entry.name === ".git" || entry.name === "node_modules") continue;
      const entryPath = path.join(currentDirectory, entry.name);
      if (entry.isDirectory()) visit(entryPath);
      else if (entry.isFile() && entry.name === "package.json") manifests.push(entryPath);
    }
  }
  visit(directory);
  return manifests;
}

function getDistributionRepository() {
  if (process.env.DISTRIBUTION_REPOSITORY) return process.env.DISTRIBUTION_REPOSITORY;
  const remote = git(["config", "--get", "remote.origin.url"]);
  const match = remote.match(/github\.com[:/]([^/]+\/[^/]+?)(?:\.git)?$/);
  if (!match) throw new Error(`Cannot derive a GitHub package URL from origin ${JSON.stringify(remote)}. Set DISTRIBUTION_REPOSITORY instead.`);
  return `github:${match[1]}`;
}

function discoverPackages() {
  const packageByName = new Map();
  for (const entry of fs.readdirSync(PACKAGES_ROOT, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const packagePath = path.join(PACKAGES_ROOT, entry.name);
    const manifestPath = path.join(packagePath, "package.json");
    if (!fs.existsSync(manifestPath)) continue;
    const manifest = readManifest(manifestPath);
    if (!manifest.name) throw new Error(`${manifestPath} has no package name`);
    if (packageByName.has(manifest.name)) throw new Error(`Duplicate package name ${manifest.name}`);
    packageByName.set(manifest.name, { directory: entry.name, name: manifest.name, packagePath, internalDependencies: new Set() });
  }

  for (const packageInfo of packageByName.values()) {
    for (const manifestPath of findManifestPaths(packageInfo.packagePath)) {
      const manifest = readManifest(manifestPath);
      for (const section of DEPENDENCY_SECTIONS) {
        for (const [name, version] of Object.entries(manifest[section] ?? {})) {
          if (!version.startsWith("file:")) continue;
          const dependencyPath = path.resolve(path.dirname(manifestPath), version.slice("file:".length));
          const dependencyManifestPath = path.join(dependencyPath, "package.json");
          if (!fs.existsSync(dependencyManifestPath)) throw new Error(`${manifestPath} references missing local package ${version}`);
          const dependencyName = readManifest(dependencyManifestPath).name;
          if (dependencyName !== name) throw new Error(`${manifestPath} maps ${name} to ${version}, which is ${dependencyName}`);
          if (!packageByName.has(name)) throw new Error(`${manifestPath} references local package ${name} outside packages/`);
          packageInfo.internalDependencies.add(name);
        }
      }
    }
  }
  return packageByName;
}

function sortPackages(packageByName) {
  const states = new Map();
  const ordered = [];
  function visit(name, chain = []) {
    const state = states.get(name);
    if (state === "done") return;
    if (state === "visiting") throw new Error(`Internal package dependency cycle: ${[...chain, name].join(" -> ")}`);
    states.set(name, "visiting");
    const packageInfo = packageByName.get(name);
    for (const dependencyName of [...packageInfo.internalDependencies].sort()) visit(dependencyName, [...chain, name]);
    states.set(name, "done");
    ordered.push(packageInfo);
  }
  for (const name of [...packageByName.keys()].sort()) visit(name);
  return ordered;
}

function rewriteInternalDependencies(packageInfo, packagePath, distributionShaByName, distributionRepository) {
  for (const manifestPath of findManifestPaths(packagePath)) {
    const manifest = readManifest(manifestPath);
    let changed = false;
    for (const section of DEPENDENCY_SECTIONS) {
      const dependencies = manifest[section] ?? {};
      for (const name of packageInfo.internalDependencies) {
        if (!(name in dependencies)) continue;
        if (!dependencies[name].startsWith("file:")) throw new Error(`${manifestPath} must use a file: dependency for ${name} on main`);
        const distributionSha = distributionShaByName[name];
        if (!distributionSha) throw new Error(`No split SHA available for ${name}`);
        dependencies[name] = `${distributionRepository}#${distributionSha}`;
        changed = true;
      }
    }
    if (changed) fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  }
}

function installDistributionLockfile(packagePath) {
  const args = ["install", "--package-lock-only", "--ignore-scripts", "--workspaces=false"];
  if (process.platform === "win32") cp.execSync([NPM, ...args].join(" "), { cwd: packagePath, stdio: "inherit" });
  else cp.execFileSync(NPM, args, { cwd: packagePath, stdio: "inherit" });
}

function hasStagedChanges(packagePath) {
  return cp.spawnSync("git", ["diff", "--cached", "--quiet"], { cwd: packagePath }).status === 1;
}

function createDistributionCommit(packageInfo, distributionShaByName, distributionRepository) {
  const baseCommit = git(["subtree", "split", "--prefix", `packages/${packageInfo.directory}`]);
  const temporaryWorktree = fs.mkdtempSync(path.join(os.tmpdir(), "airdev-package-split-"));
  try {
    git(["worktree", "add", "--detach", temporaryWorktree, baseCommit]);
    rewriteInternalDependencies(packageInfo, temporaryWorktree, distributionShaByName, distributionRepository);
    installDistributionLockfile(temporaryWorktree);
    git(["add", "--all"], { cwd: temporaryWorktree });
    if (hasStagedChanges(temporaryWorktree)) git(["commit", "-m", `chore: prepare ${packageInfo.name} distribution`], { cwd: temporaryWorktree });
    return git(["rev-parse", "HEAD"], { cwd: temporaryWorktree });
  } finally {
    try { git(["worktree", "remove", "--force", temporaryWorktree]); }
    finally { fs.rmSync(temporaryWorktree, { recursive: true, force: true }); }
  }
}

function main() {
  const distributionRepository = getDistributionRepository();
  const packages = sortPackages(discoverPackages());
  const distributionShaByName = {};
  for (const packageInfo of packages) {
    const distributionSha = createDistributionCommit(packageInfo, distributionShaByName, distributionRepository);
    distributionShaByName[packageInfo.name] = distributionSha;
    console.log(`${packageInfo.name}: ${distributionSha}`);
    if (!dryRun) {
      git(["branch", "-f", `split/${packageInfo.directory}`, distributionSha]);
      git(["push", "origin", `split/${packageInfo.directory}`, "--force"]);
    }
  }
}

main();
