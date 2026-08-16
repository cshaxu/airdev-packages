#!/bin/bash
# "@airdev/next": "managed"

calculate_total() {
  local paths=("$@") # Receive all arguments as an array
  local total=0
  for path in "${paths[@]}"; do
    # Call the processing script and capture its output
    result=$("$process_script" "$path" 0 | awk '{print $1}')
    # Check if the result is a valid number
    if [[ "$result" =~ ^[0-9]+$ ]]; then
      # Add the result to the total
      ((total += result))
    else
      echo "Warning: Invalid output from $process_script for $path"
    fi
  done
  # Output the total result
  echo "$total"
}

airent_frontend_files=(
  'src/generated/tanstack-hooks'
  'src/generated/clients'
  'src/generated/server-clients'
  'src/generated/edge-clients'
)

airent_backend_files=(
  'src/app/api/data'
  'src/app/api/debug'
  'src/app/api/inngest'
  'src/app/api/jobs'
  'src/app/api/webhooks'
  'src/generated/entities'
  'src/generated/types'
  'src/generated/services'
  'src/generated/actions'
  'src/generated/dispatchers'
  'src/generated/handlers'
  'src/edge/router/routes'
)

backend_files=(
  'src/backend'
  'src/edge'
  'src/framework'
)

frontend_files=(
  'src/app'
  'src/common'
  'src/emails'
  'src/frontend'
)


repo_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
process_script="$repo_root/node_modules/@airdev/tool/bin/countlines.sh"

airent_frontend=$(calculate_total "${airent_frontend_files[@]}")
echo "Airent Frontend: $airent_frontend"

airent_backend=$(calculate_total "${airent_backend_files[@]}")
echo "Airent Backend: $airent_backend"

frotend=$(calculate_total "${frontend_files[@]}")
echo "Frontend: $frotend"

backend=$(calculate_total "${backend_files[@]}")
echo "Backend: $backend"

total=$(calculate_total "src")
echo "Total: $total"
