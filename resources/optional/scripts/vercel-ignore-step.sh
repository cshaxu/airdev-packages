#!/bin/bash
# "@airdev/next": "seeded"

echo "VERCEL_ENV: $VERCEL_ENV"
echo "SERVICE_ENV: $NEXT_PUBLIC_BAREBONE_NEXT_SERVICE_ENVIRONMENT"
echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

if [[ "$NEXT_PUBLIC_BAREBONE_NEXT_SERVICE_ENVIRONMENT" == 'development' ]]; then
  if [[ "$VERCEL_GIT_COMMIT_REF" == 'production' ]]; then
    echo "🛑 - Build cancelled"
    exit 0;
  fi

elif [[ "$NEXT_PUBLIC_BAREBONE_NEXT_SERVICE_ENVIRONMENT" == 'production' ]]; then
  if [[ "$VERCEL_ENV" == 'preview' ]]; then
    echo "🛑 - Build cancelled"
    exit 0;
  fi
  if [[ "$VERCEL_GIT_COMMIT_REF" != 'production' ]]; then
    echo "🛑 - Build cancelled"
    exit 0;
  fi

else
  echo "🛑 - Build cancelled"
  exit 0;
fi

echo "✅ - Build can proceed"
exit 1;
