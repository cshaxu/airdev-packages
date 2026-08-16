"@airdev/next": "managed"

# Background Job Development Guide

This document is a guide for developing background jobs.

## 1. Create your background job

- Naviagte to `src/backend/jobs/background`
- Create a new `.ts` file. Make sure the file name is in kabab case,
  and it matters for all the wiring logic described in step 2.
- Implement your background job following this format:

```typescript
/**
 * The unique identifier for your background job;
 * please make sure it does not conflict with any existing background jobs.
 */
export const event = 'my-backgrond-job';

/**
 * The data structure that your background job will receive as input.
 */
export type Params = { myParamItem: string };

/**
 * The main function that will be executed when your background job is triggered.
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

## 2. Wire up your background job

Run `npm run airent` command to automatically generate wiring logic. If this is successful:

1. In `src/generated/inngest.ts`, the following function is what you will use to trigger the event in your code.

```typescript
export const enqueueMyBackgroundJobEvent = (data: MyBackgroundJobParams) =>
  InngestSdk.enqueue(MyBackgroundJobEvent, data);
```

2. In `src/app/api/inngest/route.ts`, the API wiring logic is created but you should not need to deal with it.

## 3. Trigger your background job

In your application code, simply call the function `enqueueMyBackgroundJobEvent` with the required parameters and your background job will be enqueued for execution.

```typescript
await enqueueMyBackgroundJobEvent({ myParamItem: 'myValue' });
```

## 4. Deploy your background job

- On `development` tier, you need to go to Inngest dashboard to manually deploy the new background jobs.
- On `production` tier, the background job will be automatically deployed to Inngest when you deploy on Vercel.
