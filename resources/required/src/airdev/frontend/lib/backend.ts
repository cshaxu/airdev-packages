/* "@airdev/next": "managed" */
import { airdevPublicConfig } from '@/airdev/config/public';
import { fetchJsonOrThrow } from '@airent/api';

export const callBackendJsonApi = (
  path: string,
  body: Record<string, any>,
  options: RequestInit = {}
) =>
  fetchJsonOrThrow(`${airdevPublicConfig.service.apiClientBaseUrl}${path}`, {
    credentials: 'include',
    method: 'POST',
    body: JSON.stringify(body),
    ...options,
  });

export const callBackendApi = (
  path: string,
  body: Record<string, any>,
  options: RequestInit = {}
) =>
  fetch(`${airdevPublicConfig.service.apiClientBaseUrl}${path}`, {
    credentials: 'include',
    method: 'POST',
    body: JSON.stringify(body),
    ...options,
  });
