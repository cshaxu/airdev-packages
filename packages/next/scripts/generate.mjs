#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, '..');
const requiredResourceRoot = path.join(packageRoot, 'resources', 'required');
const optionalResourceRoot = path.join(packageRoot, 'resources', 'optional');

main();

function main() {
  assertNoArgs(process.argv.slice(2));

  if (!fs.existsSync(requiredResourceRoot)) {
    throw new Error(
      `resources/required not found: ${requiredResourceRoot}`
    );
  }

  if (!fs.existsSync(optionalResourceRoot)) {
    throw new Error(
      `resources/optional not found: ${optionalResourceRoot}`
    );
  }

  const targetRoot = path.resolve(process.cwd());
  if (targetRoot === packageRoot) {
    throw new Error(
      'Refusing to generate project files into the package repo itself. Run this from a consumer app root.'
    );
  }

  const results = [
    ...syncRequiredDirectory(requiredResourceRoot, targetRoot),
    ...syncOptionalDirectory(optionalResourceRoot, targetRoot),
    ...syncGitignore({
      requiredPaths: listRelativeFiles(requiredResourceRoot),
      optionalPaths: listRelativeFiles(optionalResourceRoot),
      targetRoot,
    }),
  ];
  reportResults(results);
}

function assertNoArgs(args) {
  if (args.length > 0) {
    throw new Error(
      `This script does not take arguments. Run it with no arguments from the target app root. Received: ${args.join(' ')}`
    );
  }
}

function syncRequiredDirectory(sourceDir, targetDir) {
  const results = [];

  for (const sourcePath of walkFiles(sourceDir)) {
    const relativePath = path.relative(sourceDir, sourcePath);
    const targetPath = path.join(targetDir, relativePath);
    const sourceContent = fs.readFileSync(sourcePath);
    const targetExists = fs.existsSync(targetPath);
    const targetContent = targetExists ? fs.readFileSync(targetPath) : null;

    if (
      targetContent !== null &&
      Buffer.compare(sourceContent, targetContent) === 0
    ) {
      results.push({ status: 'unchanged', targetPath });
      continue;
    }

    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.copyFileSync(sourcePath, targetPath);
    results.push({
      status: targetExists ? 'updated' : 'created',
      targetPath,
    });
  }

  return results;
}

function syncOptionalDirectory(sourceDir, targetDir) {
  const results = [];

  for (const sourcePath of walkFiles(sourceDir)) {
    const relativePath = path.relative(sourceDir, sourcePath);
    const targetPath = path.join(targetDir, relativePath);

    if (fs.existsSync(targetPath)) {
      results.push({ status: 'skipped', targetPath });
      continue;
    }

    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.copyFileSync(sourcePath, targetPath);
    results.push({ status: 'created', targetPath });
  }

  return results;
}

function reportResults(results) {
  const sections = [
    ['created', 'Created'],
    ['updated', 'Updated'],
  ].map(([status, label]) => [
    status,
    label,
    results.filter((result) => result.status === status),
  ]);

  let printedSection = false;
  for (const [_status, label, matches] of sections) {
    if (matches.length === 0) {
      continue;
    }

    if (printedSection) {
      console.log('');
    }

    console.log(`${label}:`);
    for (const match of matches) {
      console.log(`  ${match.targetPath}`);
    }
    printedSection = true;
  }

  const summaryStatuses = [
    ['created', 'Created'],
    ['updated', 'Updated'],
    ['skipped', 'Skipped'],
    ['unchanged', 'Unchanged'],
  ];

  if (printedSection) {
    console.log('');
  }

  console.log('Stats:');
  for (const [status, label] of summaryStatuses) {
    const count = results.filter((result) => result.status === status).length;
    console.log(`  ${count} ${label.toLowerCase()}`);
  }
}

function syncGitignore({ requiredPaths, optionalPaths, targetRoot }) {
  const gitignorePath = path.join(targetRoot, '.gitignore');
  const hasGitignore = fs.existsSync(gitignorePath);
  const originalContent = hasGitignore
    ? fs.readFileSync(gitignorePath, 'utf8')
    : '';
  const hadTrailingNewline =
    originalContent.endsWith('\n') || originalContent.endsWith('\r\n');
  const lines = splitLines(originalContent);
  removeOptionalEntries(lines, optionalPaths);
  reconcileAirdevIgnore(lines);
  addRequiredEntries(lines, requiredPaths);

  const nextContent = joinLines(lines, hadTrailingNewline || lines.length > 0);
  if (nextContent !== originalContent) {
    fs.writeFileSync(gitignorePath, nextContent, 'utf8');
    return [
      {
        status: hasGitignore ? 'updated' : 'created',
        targetPath: gitignorePath,
      },
    ];
  }

  return [];
}

function removeOptionalEntries(lines, optionalPaths) {
  const optionalEntrySet = new Set();
  for (const relativePath of optionalPaths) {
    const entries = buildGitignoreEntries(relativePath);
    optionalEntrySet.add(entries.bare);
    optionalEntrySet.add(entries.rooted);
    optionalEntrySet.add(entries.legacyBare);
    optionalEntrySet.add(entries.legacyRooted);
  }

  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const line = lines[index];
    const trimmed = line.trim();
    if (!optionalEntrySet.has(trimmed)) {
      continue;
    }

    lines.splice(index, 1);
  }
}

function reconcileAirdevIgnore(lines) {
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const trimmed = lines[index].trim();
    if (trimmed.startsWith('/src/airdev/')) {
      lines.splice(index, 1);
      continue;
    }

    if (trimmed === '/src/airdev/') {
      lines.splice(index, 1);
    }
  }

  const existingEntries = new Set(lines.map((line) => line.trim()));
  if (!existingEntries.has('/src/airdev')) {
    lines.push('/src/airdev');
  }
}

function addRequiredEntries(lines, requiredPaths) {
  const existingEntries = new Set(lines.map((line) => line.trim()));

  for (const relativePath of requiredPaths) {
    const normalized = normalizeRelativePath(relativePath);
    if (normalized.startsWith('src/airdev/')) {
      continue;
    }

    const entries = buildGitignoreEntries(relativePath);
    if (existingEntries.has(entries.rooted) || existingEntries.has(entries.bare)) {
      continue;
    }

    removeGitignoreEntries(lines, existingEntries, [
      entries.legacyRooted,
      entries.legacyBare,
    ]);

    lines.push(entries.rooted);
    existingEntries.add(entries.rooted);
  }
}

function listRelativeFiles(rootDir) {
  return [...walkFiles(rootDir)].map((filePath) => path.relative(rootDir, filePath));
}

function splitLines(content) {
  if (content === '') {
    return [];
  }

  const lines = content.split(/\r?\n/u);
  if (lines.at(-1) === '') {
    lines.pop();
  }
  return lines;
}

function joinLines(lines, trailingNewline) {
  if (lines.length === 0) {
    return '';
  }

  const content = lines.join('\n');
  return trailingNewline ? `${content}\n` : content;
}

function normalizeRelativePath(relativePath) {
  return relativePath.split(path.sep).join('/');
}

function buildGitignoreEntries(relativePath) {
  const normalized = normalizeRelativePath(relativePath);
  const escaped = escapeGitignoreLiteral(normalized);

  return {
    bare: escaped,
    rooted: `/${escaped}`,
    legacyBare: normalized,
    legacyRooted: `/${normalized}`,
  };
}

function escapeGitignoreLiteral(value) {
  let escaped = '';

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    const isLeadingSpecial =
      index === 0 && (char === '#' || char === '!');
    const isPatternSpecial =
      char === '\\' ||
      char === '*' ||
      char === '?' ||
      char === '[' ||
      char === ']';
    const isTrailingSpace =
      char === ' ' && value.slice(index).trim().length === 0;

    if (isLeadingSpecial || isPatternSpecial || isTrailingSpace) {
      escaped += '\\';
    }

    escaped += char;
  }

  return escaped;
}

function removeGitignoreEntries(lines, existingEntries, entries) {
  const entrySet = new Set(entries);

  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const trimmed = lines[index].trim();
    if (!entrySet.has(trimmed)) {
      continue;
    }

    lines.splice(index, 1);
    existingEntries.delete(trimmed);
  }
}

function* walkFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkFiles(fullPath);
    } else {
      yield fullPath;
    }
  }
}
