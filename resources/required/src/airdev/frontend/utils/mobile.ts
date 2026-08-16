/* "@airdev/next": "managed" */

export const getIsMobile = (userAgent?: string | null) =>
  !!userAgent?.length &&
  (userAgent.includes('Mobile') ||
    userAgent.includes('iPhone') ||
    userAgent.includes('Android'));

export function isMobileBrowser(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator?.userAgent ?? ''
  );
}
