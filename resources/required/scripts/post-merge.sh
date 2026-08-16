#!/bin/bash
# "@airdev/next": "managed"

# to install this script, please add one line to `.git/hooks/post-merge`:
# source ../../scripts/post-merge.sh

function changed() {
  git diff --name-only HEAD@{1} HEAD | grep "^$1" >/dev/null 2>&1
  return $? # 0 if found, 1 if not
}

if changed 'scripts/env-templates/*'; then
  echo " ⚠️  Files in 'scripts/env-template' changed. Please run 'devtool env reset_vars'."
fi

package_files=(
  'package.json'
  'package-lock.json'
)

schema_files=(
  'prisma/dbml/schema.dbml'
  'schemas/*.yml'
  'airent.config.json'
  'plugins/airent/*.js'
  'plugins/airent/*.ejs'
  'plugins/airent/api-next/*.ejs'
)

updated=false
for i in "${package_files[@]}"; do
  if changed "$i"; then
    echo "⚠️  File '$i' changed. Running the update script ..."
    npm run update
    updated=true
    break
  fi
done

if [[ "$updated" == false ]]; then
  for i in "${schema_files[@]}"; do
    if changed "$i"; then
      echo "⚠️  File '$i' changed. Updating schemas ..."
      npx prisma generate
      npm run airent
      break
    fi
  done
fi
