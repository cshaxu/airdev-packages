"@airdev/next": "managed"

# Cron Job Development Guide

This document is a guide for developing Cron jobs.

## 1. Create your Cron job

- Naviagte to `src/backend/jobs/cron`
- Create a new `.ts` file. Make sure the file name is in kabab case,
  and it matters for all the wiring logic described in step 2.
- Implement your Cron job following this format:

```typescript
/**
 * The optional max Vercel function execution timeout in seconds.
 */
export const maxDuration = 60;

/**
 * The Crontab schedule. See https://crontab.guru/ for help.
 */
export const schedule = '0 1 * * *';

/**
 * The main function that will be executed when your Cron job is triggered.
 * It receives only a `Context` as input and returns a `CommonResponse` object.
 * No custom parameters supported for Cron jobs.
 */
export async function executor(context: Context): Promise<CommonResponse> {
  const ds = getLatestDs();
  return await createStatsDays(ds, ds, context);
}
```

## 2. Wire up your Cron job

Run `npm run airent` command to automatically generate wiring logic. If this is successful:

1. In `vercel.json`, you will see your new Cron job added to the `cron` section. No action is needed.

2. In `src/app/api/jobs`, you will see the API route created for your new Cron job. No action is needed.

## 3. Deploy your Cron job

This is handled as part of the Vercel deployment. No further action is needed.

You can go to Settings > Cron Jobs to confirm the deployment and manually trigger the job in UI on demand.
