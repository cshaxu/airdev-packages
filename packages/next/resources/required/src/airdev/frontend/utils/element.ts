/* "@airdev/next": "managed" */

/**
 * 在隐藏容器中测量元素的宽度
 * @param createElement 创建要测量的元素的函数
 * @param measureContainer 用于测量的容器元素
 * @returns 元素的宽度（像素）
 */
export function measureElementWidth(
  createElement: () => HTMLElement,
  measureContainer: HTMLElement
): number {
  if (!measureContainer) {
    return 0;
  }

  // 清空测量容器
  measureContainer.innerHTML = '';

  // 创建并添加元素
  const element = createElement();
  measureContainer.appendChild(element);

  // 测量宽度
  return element.offsetWidth;
}
