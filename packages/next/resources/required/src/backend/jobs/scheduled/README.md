"@airdev/next": "managed"

# Scheduled Job Development Guide

This document is a guide for developing scheduled jobs.

## 1. Create your scheduled job

- Naviagte to `src/backend/jobs/scheduled`
- Create a new `.ts` file. Make sure the file name is in kabab case,
  and it matters for all the wiring logic described in step 2.
- Implement your scheduled job following this format:

```typescript
/**
 * The unique identifier for your scheduled job;
 * please make sure it does not conflict with any existing scheduled jobs.
 */
export const event = 'my-scheduled-job';

/**
 * The data structure that your scheduled job will receive as input.
 */
export type Params = { myParamItem: string };

/**
 * The main function that will be executed when your scheduled job is triggered.
 * It receives the `Params` as input and should return a `CommonResponse` object.
 */
export async function executor(
  params: Params,
  context: Context
): Promise<CommonResponse> {
  logInfo(params);
  if (params.myParamItem === 'someValue') {
    return { code: 500, error: { myErrorMessage: 'invalid value' } };
  }
  // implement some logic here
  return { code: 200, result: { myResult: 'done' } };
}
```

## 2. Wire up your scheduled job

Run `npm run airent` command to automatically generate wiring logic. If this is successful:

1. In `src/generated/scheduler.ts`, the following function is what you will use to trigger the event in your code.

```typescript
export const scheduleMyScheduledJobEvent = (
  data: MyScheduledJobParams,
  runsAt: Date,
  context: Context
) => ScheduledJobService.createOne(MyScheduledJobEvent, data, runsAt, context);
```

## 3. Trigger your scheduled job

In your application code, simply call the function `scheduleMyScheduledJobEvent` with the required parameters.

```typescript
await scheduleMyScheduledJobEvent(
  { myParamItem: 'myValue' },
  addDays(new Date(), 100),
  context
);
```

## 4. Deploy your scheduled job

This is handled as part of the Vercel deployment. No further action is needed.
