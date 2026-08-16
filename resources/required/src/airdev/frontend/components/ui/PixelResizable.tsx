/* "@airdev/next": "managed" */

'use client';

import { cn } from '@/airdev/frontend/utils/cn';
import * as React from 'react';

interface PixelResizablePanelProps {
  children: React.ReactNode;
  className?: string;
  collapsedSize: number; // 折叠状态下的像素宽度
  minSize: number; // 展开状态下的最小像素宽度
  maxSize: number; // 展开状态下的最大像素宽度
  defaultSize: number; // 默认像素宽度
  isCollapsed?: boolean; // 是否处于折叠状态
  onCollapseChange?: (isCollapsed: boolean) => void; // 折叠状态变化回调
  onResize?: (size: number) => void; // 大小变化回调
  style?: React.CSSProperties;
}

const PixelResizablePanel = React.forwardRef<
  HTMLDivElement,
  PixelResizablePanelProps
>(
  (
    {
      children,
      className,
      collapsedSize,
      minSize,
      maxSize,
      defaultSize,
      isCollapsed = false,
      onCollapseChange,
      onResize,
      style,
      ...props
    },
    ref
  ) => {
    const [width, setWidth] = React.useState(defaultSize);
    const isDragging = React.useRef(false);
    const startX = React.useRef(0);
    const startWidth = React.useRef(0);

    // 处理鼠标移动事件
    const handleMouseMove = React.useCallback(
      (e: MouseEvent) => {
        if (!isDragging.current) {
          return;
        }

        const delta = e.clientX - startX.current;
        let newWidth = startWidth.current + delta;

        // 如果当前是折叠状态，且拖动距离超过阈值，则展开
        if (isCollapsed && newWidth > collapsedSize * 2) {
          newWidth = Math.max(minSize, newWidth);
          setWidth(newWidth);
          onCollapseChange?.(false);
          onResize?.(newWidth);
          // 更新起始位置，以便继续拖动
          startX.current = e.clientX;
          startWidth.current = newWidth;
          return;
        }

        // 如果当前是展开状态
        if (!isCollapsed) {
          // 如果拖动到小于折叠宽度，则折叠
          if (newWidth < collapsedSize) {
            setWidth(collapsedSize);
            onCollapseChange?.(true);
            onResize?.(collapsedSize);
            // 更新起始位置，以便继续拖动
            startX.current = e.clientX;
            startWidth.current = collapsedSize;
            return;
          }

          // 限制在最小和最大宽度之间
          newWidth = Math.max(minSize, Math.min(maxSize, newWidth));
          setWidth(newWidth);
          onResize?.(newWidth);
        }
      },
      [isCollapsed, collapsedSize, minSize, maxSize, onCollapseChange, onResize]
    );

    // 处理鼠标松开事件
    const handleMouseUp = React.useCallback(() => {
      isDragging.current = false;
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', handleMouseMove);
      // eslint-disable-next-line react-hooks/immutability
      document.removeEventListener('mouseup', handleMouseUp);
    }, [handleMouseMove]);

    // 处理鼠标按下事件
    const handleMouseDown = React.useCallback(
      (e: React.MouseEvent) => {
        if (e.button !== 0) {
          return;
        }
        e.preventDefault();
        isDragging.current = true;
        startX.current = e.clientX;
        startWidth.current = isCollapsed ? collapsedSize : width;
        document.body.style.cursor = 'ew-resize';
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      },
      [width, isCollapsed, collapsedSize, handleMouseMove, handleMouseUp]
    );

    // 监听鼠标状态
    React.useEffect(() => {
      const handleGlobalMouseUp = (e: MouseEvent) => {
        if (e.button === 0) {
          // 只处理左键
          isDragging.current = false;
          document.body.style.cursor = '';
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        }
      };

      window.addEventListener('mouseup', handleGlobalMouseUp);
      return () => {
        window.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }, [handleMouseMove, handleMouseUp]);

    // 清理事件监听器
    React.useEffect(() => {
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = ''; // 确保组件卸载时也恢复鼠标样式
      };
    }, [handleMouseMove, handleMouseUp]);

    // 监听状态变化，保持拖拽状态
    React.useEffect(() => {
      if (isDragging.current) {
        document.body.style.cursor = 'ew-resize';
      }
    }, [isCollapsed]);

    React.useEffect(() => {
      if (!isCollapsed && width < minSize) {
        setWidth(minSize);
        onResize?.(minSize);
      }
    }, [isCollapsed, width, minSize, onResize]);

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex h-full flex-col overflow-hidden',
          className
        )}
        style={{ ...style, width: isCollapsed ? collapsedSize : width }}
        {...props}
      >
        {children}
        <div
          className="bg-border hover:bg-primary focus-visible:ring-ring absolute top-0 right-0 h-full w-px cursor-ew-resize select-none after:absolute after:inset-y-0 after:left-1/2 after:w-4 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-none"
          onMouseDown={handleMouseDown}
        />
      </div>
    );
  }
);

PixelResizablePanel.displayName = 'PixelResizablePanel';

export { PixelResizablePanel };
