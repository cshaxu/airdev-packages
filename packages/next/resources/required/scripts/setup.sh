#!/bin/bash
# "@airdev/next": "managed"

current_path=$(pwd)
repo_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd $repo_root

if [ -n "$BASH_VERSION" ]; then
  if [[ "$(type -t devtool)" != 'function' ]]; then
    source node_modules/@airdev/tool/bin/devtool.sh
  fi

elif [ -n "$ZSH_VERSION" ]; then
  if [[ "$(type devtool 2>/dev/null | grep -E 'function|alias')" == "" ]]; then
    source node_modules/@airdev/tool/bin/devtool.sh
  fi
fi

devtool env restore
cd $current_path
