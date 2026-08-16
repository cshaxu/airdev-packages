/* "@airdev/next": "managed" */

import { logError } from '@/airdev/common/utils/logging';
import { cn } from '@/airdev/frontend/utils/cn';
import { measureElementWidth } from '@/airdev/frontend/utils/element';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './Breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './DropdownMenu';

// Constants
const MIN_WIDTH = 50;

const ELLIPSIS_ITEM: BreadcrumbItem = { label: '', href: '' };

// Types
export type BreadcrumbItem = {
  label: React.ReactNode;
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
  className?: string;
  renderItem?: (item: BreadcrumbItem) => React.ReactNode;
};

export function ResponsiveBreadcrumb({ items, className, renderItem }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);
  const [displayedItems, setDisplayedItems] = useState<BreadcrumbItem[]>([]);
  const [hiddenItems, setHiddenItems] = useState<BreadcrumbItem[]>([]);
  const [isInitialRender, setIsInitialRender] = useState(true);

  // 计算分隔符宽度
  const measureSeparatorWidth = useCallback((): number => {
    if (!measureRef.current) {
      return 0;
    }
    return measureElementWidth(
      () => createSeparatorElement(),
      measureRef.current
    );
  }, []);

  // 计算省略号宽度
  const measureEllipsisWidth = useCallback((): number => {
    if (!measureRef.current) {
      return 0;
    }
    return measureElementWidth(
      () => createEllipsisElement(),
      measureRef.current
    );
  }, []);

  // 更新显示的项目
  const updateDisplayedItems = useCallback(
    (containerWidth: number) => {
      if (!containerRef.current || !measureRef.current) {
        return;
      }

      const availableWidth = Math.max(containerWidth, MIN_WIDTH);

      // 测量所有必要的宽度
      const itemWidths = items.map((item) =>
        item === ELLIPSIS_ITEM
          ? measureEllipsisWidth()
          : measureElementWidth(
              () => createItemElement(item),
              measureRef.current!
            )
      );

      const separatorWidth = measureSeparatorWidth();
      const ellipsisWidth = measureEllipsisWidth();

      // 开始折叠过程
      const { visibleItems, hiddenItems } = collapseItems(
        items,
        itemWidths,
        separatorWidth,
        ellipsisWidth,
        availableWidth,
        calculateCurrentWidth
      );

      if (isInitialRender) {
        setIsInitialRender(false);
      }

      setDisplayedItems(visibleItems);
      setHiddenItems(hiddenItems);
    },
    [items, measureSeparatorWidth, measureEllipsisWidth, isInitialRender]
  );

  // 设置 ResizeObserver
  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const container = containerRef.current;

    // 创建测量容器
    if (!measureRef.current) {
      const measure = createMeasureContainer();
      document.body.appendChild(measure);
      measureRef.current = measure;
    }

    let animationFrameId: number;
    let observer: ResizeObserver;

    const updateCollapse = () => {
      if (!container) {
        return;
      }
      // 确保容器宽度不小于最小宽度
      const width = Math.max(container.offsetWidth, MIN_WIDTH);
      updateDisplayedItems(width);
    };

    try {
      observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === container) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(updateCollapse);
          }
        }
      });

      observer.observe(container);
      updateCollapse();
    } catch (error) {
      logError(error, { message: 'Error setting up ResizeObserver:' });
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
      cancelAnimationFrame(animationFrameId);
      if (measureRef.current) {
        document.body.removeChild(measureRef.current);
        measureRef.current = null;
      }
    };
  }, [items, updateDisplayedItems]);

  return (
    <div
      ref={containerRef}
      className={`w-full min-w-[50px] ${className || ''}`}
    >
      <Breadcrumb>
        <BreadcrumbList className="flex-nowrap">
          {displayedItems.map((item, index) => {
            const isLast = index === displayedItems.length - 1;
            const isEllipsis = item === ELLIPSIS_ITEM;

            return (
              <React.Fragment key={getItemKey(item, index)}>
                <BreadcrumbItem
                  data-item-index={index}
                  className="whitespace-nowrap"
                >
                  {isEllipsis ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="hover:text-foreground flex cursor-pointer items-center">
                        <BreadcrumbEllipsis className="text-muted-foreground/50" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {hiddenItems.map((hiddenItem, hiddenIndex) => (
                          <DropdownMenuItem
                            key={hiddenIndex}
                            asChild={!!hiddenItem.href}
                          >
                            {hiddenItem.href ? (
                              <BreadcrumbLink
                                href={hiddenItem.href}
                                className="text-muted-foreground w-full cursor-pointer truncate"
                              >
                                {renderItem
                                  ? renderItem(hiddenItem)
                                  : renderLabel(hiddenItem.label)}
                              </BreadcrumbLink>
                            ) : (
                              <span className="text-muted-foreground w-full cursor-pointer truncate">
                                {renderItem
                                  ? renderItem(hiddenItem)
                                  : renderLabel(hiddenItem.label)}
                              </span>
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <div
                      className={cn(
                        'cursor-pointer truncate',
                        isPureTextLabel(item.label) ? 'mt-1' : ''
                      )}
                    >
                      {isLast ? (
                        <BreadcrumbPage>
                          {renderItem
                            ? renderItem(item)
                            : renderLabel(item.label)}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          href={item.href}
                          className="text-muted-foreground"
                        >
                          {renderItem
                            ? renderItem(item)
                            : renderLabel(item.label)}
                        </BreadcrumbLink>
                      )}
                    </div>
                  )}
                </BreadcrumbItem>
                {!isLast && (
                  <BreadcrumbSeparator
                    data-measure-target="breadcrumb-separator"
                    className="text-muted-foreground/50 mx-0.5 [&>svg]:h-3.5 [&>svg]:w-3.5"
                  />
                )}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

// Utils

function calculateCurrentWidth(
  itemWidths: number[],
  separatorWidth: number,
  ellipsisWidth: number,
  collapsedIndices: Set<number>
): number {
  let width = 0;
  let visibleCount = 0;
  let hasEllipsis = false;

  // 计算可见元素的宽度
  itemWidths.forEach((itemWidth, index) => {
    if (!collapsedIndices.has(index)) {
      width += itemWidth;
      visibleCount++;
    } else if (!hasEllipsis) {
      width += ellipsisWidth;
      hasEllipsis = true;
      visibleCount++;
    }
  });

  // 添加分隔符的宽度（可见元素数量减1）
  if (visibleCount > 0) {
    width += (visibleCount - 1) * separatorWidth;
  }

  return width;
}

const createMeasureContainer = () => {
  const measure = document.createElement('div');
  measure.style.position = 'absolute';
  measure.style.visibility = 'hidden';
  measure.style.top = '-9999px';
  measure.style.width = 'auto';
  measure.style.whiteSpace = 'nowrap';
  return measure;
};

const createSeparatorElement = () => {
  const separator = document.createElement('div');
  separator.className =
    'text-muted-foreground/50 mx-0.5 [&>svg]:h-3.5 [&>svg]:w-3.5, px-[10px]';
  separator.setAttribute('data-measure-target', 'breadcrumb-separator');

  // 创建 SVG 元素模拟实际的分隔符图标
  const svg = document.createElement('div');
  svg.style.width = '14px'; // 3.5 * 4px
  svg.style.height = '14px';
  separator.appendChild(svg);

  return separator;
};

const createEllipsisElement = () => {
  const container = document.createElement('div');
  container.className = 'flex items-center';

  const ellipsisSpan = document.createElement('span');
  ellipsisSpan.className =
    'flex size-9 items-center justify-center text-muted-foreground/50';
  ellipsisSpan.setAttribute('data-measure-target', 'breadcrumb-ellipsis');

  // 创建图标占位符
  const iconSpan = document.createElement('span');
  iconSpan.className = 'size-4';
  ellipsisSpan.appendChild(iconSpan);

  container.appendChild(ellipsisSpan);
  return container;
};

const createItemElement = (item: BreadcrumbItem) => {
  // 创建最外层的 BreadcrumbItem 容器
  const itemContainer = document.createElement('div');
  itemContainer.className = 'whitespace-nowrap inline-flex items-center';

  // 创建内容容器
  const contentContainer = document.createElement('div');
  contentContainer.className = 'truncate';

  // 创建链接元素
  const linkElement = document.createElement('a');
  linkElement.className =
    'text-muted-foreground hover:text-foreground truncate inline-flex items-center text-sm font-medium';
  linkElement.style.lineHeight = '1.25rem'; // 20px, 与实际渲染一致

  const { text, hasNonTextNode } = analyzeLabel(item.label);

  // 如果标签包含非文本节点（例如图标），添加一个占位符用于宽度估算
  if (hasNonTextNode) {
    const iconPlaceholder = document.createElement('span');
    iconPlaceholder.className = 'size-4';
    linkElement.appendChild(iconPlaceholder);
  }

  // 添加文本内容（不需要额外的 span 包装）
  linkElement.appendChild(document.createTextNode(text));

  contentContainer.appendChild(linkElement);
  itemContainer.appendChild(contentContainer);

  // 强制样式计算并等待它完成
  const style = window.getComputedStyle(linkElement);
  // 访问一些关键的样式属性来确保计算完成
  void style.width;
  void style.fontSize;
  void style.lineHeight;
  void style.padding;
  void style.margin;

  return itemContainer;
};

const getItemKey = (item: BreadcrumbItem, index: number) => {
  if (typeof item.label === 'string' || typeof item.label === 'number') {
    return `${String(item.label)}-${item.href ?? index}`;
  }
  return item.href ?? index;
};

const renderLabel = (label: React.ReactNode) => {
  if (isPureTextLabel(label)) {
    return <span className="text-muted-foreground">{label}</span>;
  }
  return label;
};

const isPureTextLabel = (label: React.ReactNode): label is string | number =>
  typeof label === 'string' || typeof label === 'number';

const analyzeLabel = (
  label: React.ReactNode
): { text: string; hasNonTextNode: boolean } => {
  if (label === null || label === undefined || typeof label === 'boolean') {
    return { text: '', hasNonTextNode: false };
  }

  if (typeof label === 'string' || typeof label === 'number') {
    return { text: String(label), hasNonTextNode: false };
  }

  if (Array.isArray(label)) {
    return label.reduce(
      (acc, child) => {
        const childResult = analyzeLabel(child);
        return {
          text: `${acc.text}${childResult.text}`,
          hasNonTextNode: acc.hasNonTextNode || childResult.hasNonTextNode,
        };
      },
      { text: '', hasNonTextNode: false }
    );
  }

  // React element / portal / fragment etc.
  return { text: '', hasNonTextNode: true };
};

type CollapseResult = {
  visibleItems: BreadcrumbItem[];
  hiddenItems: BreadcrumbItem[];
};

const collapseItems = (
  items: BreadcrumbItem[],
  itemWidths: number[],
  separatorWidth: number,
  ellipsisWidth: number,
  availableWidth: number,
  calculateWidth: (
    itemWidths: number[],
    separatorWidth: number,
    menuTriggerWidth: number,
    collapsedIndices: Set<number>
  ) => number
): CollapseResult => {
  const hiddenItemIds = new Set<number>();
  const hiddenItems: BreadcrumbItem[] = [];

  let totalWidth = calculateCurrentWidth(
    itemWidths,
    separatorWidth,
    ellipsisWidth,
    hiddenItemIds
  );

  // 如果空间足够，显示所有项目
  if (totalWidth <= availableWidth) {
    return { visibleItems: items, hiddenItems };
  }

  // 如果只有1个元素，折叠它
  if (items.length === 1) {
    hiddenItemIds.add(0);
    hiddenItems.push(items[0]);
    return { visibleItems: [ELLIPSIS_ITEM], hiddenItems };
  }

  // 如果有2个元素
  if (items.length <= 2) {
    // 尝试折叠第一个
    hiddenItemIds.add(0);
    hiddenItems.push(items[0]);
    totalWidth = calculateWidth(
      itemWidths,
      separatorWidth,
      ellipsisWidth,
      hiddenItemIds
    );

    // 如果只显示最后一个元素也放不下，才全部折叠
    if (totalWidth > availableWidth) {
      hiddenItemIds.add(1);
      hiddenItems.push(items[1]);
      return { visibleItems: [ELLIPSIS_ITEM], hiddenItems };
    }

    // 否则保持只折叠第一个元素的状态
    const visibleItems = [ELLIPSIS_ITEM, items[1]];
    return { visibleItems, hiddenItems };
  }

  // 如果有超过2个元素，从中间开始折叠
  hiddenItemIds.add(1);
  hiddenItems.push(items[1]);
  totalWidth = calculateWidth(
    itemWidths,
    separatorWidth,
    ellipsisWidth,
    hiddenItemIds
  );

  // 从中间向两边折叠
  for (let i = 2; i < items.length - 1 && totalWidth > availableWidth; i++) {
    hiddenItemIds.add(i);
    hiddenItems.push(items[i]);
    totalWidth = calculateWidth(
      itemWidths,
      separatorWidth,
      ellipsisWidth,
      hiddenItemIds
    );
  }

  // 如果中间元素都折叠完了还是不够，先折叠第一个元素
  if (totalWidth > availableWidth) {
    hiddenItemIds.add(0);
    hiddenItems.unshift(items[0]);
    totalWidth = calculateWidth(
      itemWidths,
      separatorWidth,
      ellipsisWidth,
      hiddenItemIds
    );
  }

  // 如果折叠了第一个元素还是不够，最后才考虑折叠最后一个元素
  if (totalWidth > availableWidth) {
    hiddenItemIds.add(items.length - 1);
    hiddenItems.push(items[items.length - 1]);
    return { visibleItems: [ELLIPSIS_ITEM], hiddenItems };
  }

  // 构建最终的显示列表
  const visibleItems: BreadcrumbItem[] = [];
  let hasAddedEllipsis = false;

  items.forEach((item, index) => {
    if (!hiddenItemIds.has(index)) {
      visibleItems.push(item);
    } else if (!hasAddedEllipsis) {
      visibleItems.push(ELLIPSIS_ITEM);
      hasAddedEllipsis = true;
    }
  });

  return { visibleItems, hiddenItems };
};
