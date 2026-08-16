/* "@airdev/next": "managed" */

import { Awaitable } from 'airent';
import { merge } from 'lodash-es';
import { toast } from 'sonner';

export async function download(
  fileName: string,
  url: string,
  init?: RequestInit,
  callback?: () => Awaitable<any>,
  isPreview: boolean = false
) {
  try {
    // 如果是直接打开文件，直接使用原始 URL
    if (isPreview) {
      window.open(url, '_blank');
      return;
    }

    // 对于下载操作，使用 fetch 并设置缓存控制
    const response = await fetch(
      url,
      merge(
        { cache: 'force-cache', headers: { 'Cache-Control': 'max-age=60' } },
        init ?? {}
      )
    );

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    // 下载文件
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 创建一个 Promise 来等待下载完成
    await new Promise<void>((resolve) => {
      // 监听下载完成事件
      const checkDownload = () => {
        // 检查下载是否完成
        const downloads = (window as any).chrome?.downloads;
        if (downloads) {
          // Chrome 浏览器可以使用 chrome.downloads API
          downloads.search(
            { filename: fileName, state: 'complete' },
            (results: any[]) => {
              if (results.length > 0) {
                resolve();
              } else {
                setTimeout(checkDownload, 1000);
              }
            }
          );
        } else {
          // 其他浏览器使用轮询方式
          setTimeout(() => {
            resolve();
          }, 2000); // 给予足够的时间让浏览器开始下载
        }
      };
      checkDownload();
    });

    // 等待一段时间后再清理资源
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
      // 下载完成后调用 callback
      callback?.().then(() => {
        toast.success('File downloaded successfully');
      });
    }, 1000);
  } catch (_) {
    toast.error(
      `Failed to ${isPreview ? 'open' : 'download'} file. Please try again.`
    );
  }
}
