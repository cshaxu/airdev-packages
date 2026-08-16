"@airdev/next": "managed"

# Webhook Development Guide

This document is a guide for developing webhooks.

## 1. Create your webhook

- Naviagte to `src/backend/webhooks`
- Create a new `.ts` file. Make sure the file name is in kabab case,
  and it matters for all the wiring logic described in step 2.
- Implement your webhook following this format:

```typescript
/**
 * The authorizer function that will be executed for permission checks.
 * It takes the `Context` as input and should throw an error if the request is not authorized.
 */
export function authorizer(context: Context): void {
  const { headers } = context;
  const secret = headers.get(MY_SECRET_KEY);
  if (secret !== MY_SECRET_VALUE) {
    throw createHttpError.Forbidden(buildInvalidErrorMessage('access'));
  }
}

/**
 * The parser function that will be executed to parse the request body.
 * It takes the `Request` as input and should return the parsed body.
 */
export async function parser(request: Request): Promise<MyWebhookBody> {
  return await request.json();
}

/**
 * The main function that will be executed when your webhook is triggered.
 */
export async function executor(
  body: MyWebhookBody,
  context: Context
): Promise<CommonResponse> {
  return { code: 200, result: { myResult: 'done' } };
}
```

## 2. Wire up your webhook

Run `npm run airent` command to automatically generate wiring logic. If this is successful:

In `src/app/api/webhooks/`, you should find the new webhook endpoint created for you.

## 3. Deploy your webhook

This is handled as part of the Vercel deployment. No further action is needed.
