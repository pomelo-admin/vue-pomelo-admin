import type { Directive, DirectiveBinding } from 'vue';

/**
 * 水印指令选项接口
 */
export interface WatermarkOptions {
  /** 水印文本 */
  text?: string;
  /** 字体大小 */
  fontSize?: number;
  /** 字体 */
  fontFamily?: string;
  /** 文本颜色 */
  color?: string;
  /** 不透明度 */
  opacity?: number;
  /** 旋转角度 */
  rotate?: number;
  /** 水印宽度 */
  width?: number;
  /** 水印高度 */
  height?: number;
  /** 层级 */
  zIndex?: number;
}

/**
 * 创建水印DOM元素
 */
function createWatermarkElement(options: WatermarkOptions): HTMLDivElement {
  // 默认配置
  const defaultOptions: WatermarkOptions = {
    text: '水印文本',
    fontSize: 16,
    fontFamily: 'Arial',
    color: 'rgba(0, 0, 0, 0.3)',
    opacity: 0.5,
    rotate: -30,
    width: 300,
    height: 200,
    zIndex: 1000,
  };

  const mergedOptions = { ...defaultOptions, ...options };
  const { text, fontSize, fontFamily, color, opacity, rotate, width, height, zIndex } =
    mergedOptions;

  // 创建canvas元素
  const canvas = document.createElement('canvas');
  canvas.width = width!;
  canvas.height = height!;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    console.error('创建Canvas上下文失败');
    return document.createElement('div');
  }

  // 清空画布
  ctx.clearRect(0, 0, width!, height!);

  // 设置字体样式
  ctx.font = `bold ${fontSize}px ${fontFamily}`;
  ctx.fillStyle = color!;
  ctx.globalAlpha = opacity!;

  // 旋转画布
  ctx.translate(width! / 2, height! / 2);
  ctx.rotate((rotate! * Math.PI) / 180);
  ctx.translate(-width! / 2, -height! / 2);

  // 绘制文本
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text!, width! / 2, height! / 2);

  // 创建水印容器
  const watermarkDiv = document.createElement('div');
  watermarkDiv.classList.add('pomelo-watermark');
  watermarkDiv.style.position = 'absolute';
  watermarkDiv.style.top = '0';
  watermarkDiv.style.left = '0';
  watermarkDiv.style.width = '100%';
  watermarkDiv.style.height = '100%';
  watermarkDiv.style.zIndex = zIndex!.toString();
  watermarkDiv.style.pointerEvents = 'none'; // 确保水印不影响用户交互

  // 生成水印图像并设置背景
  const dataUrl = canvas.toDataURL('image/png');
  watermarkDiv.style.backgroundImage = `url(${dataUrl})`;
  watermarkDiv.style.backgroundRepeat = 'repeat';
  watermarkDiv.style.backgroundSize = `${width}px ${height}px`;

  return watermarkDiv;
}

/**
 * 设置防篡改监听
 */
function setupAntiTamper(
  el: HTMLElement,
  watermarkEl: HTMLElement,
  options: WatermarkOptions
): MutationObserver {
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      // 监听子节点变化，如果水印被移除则重新添加
      if (
        mutation.type === 'childList' &&
        mutation.removedNodes.length > 0 &&
        Array.from(mutation.removedNodes).some(node => node === watermarkEl)
      ) {
        const newWatermarkEl = createWatermarkElement(options);
        el.appendChild(newWatermarkEl);
        // 更新监听的水印元素
        observer.disconnect();
        setupAntiTamper(el, newWatermarkEl, options);
        break;
      }
    }
  });

  observer.observe(el, { childList: true, subtree: false });
  return observer;
}

/**
 * 水印指令
 */
const watermark: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<WatermarkOptions>) {
    // 确保容器有定位属性，以便水印可以正确定位
    const position = getComputedStyle(el).position;
    if (position === 'static') {
      el.style.position = 'relative';
    }

    const options = binding.value || {};
    const watermarkEl = createWatermarkElement(options);

    // 添加水印
    el.appendChild(watermarkEl);

    // 设置防篡改监听器
    const observer = setupAntiTamper(el, watermarkEl, options);

    // 保存observer实例，以便在卸载时清理
    (el as any)._watermarkObserver = observer;
  },

  updated(el: HTMLElement, binding: DirectiveBinding<WatermarkOptions>) {
    // 如果配置变化，则重新创建水印
    if (JSON.stringify(binding.value) !== JSON.stringify(binding.oldValue)) {
      // 移除旧的观察器
      const observer = (el as any)._watermarkObserver;
      if (observer) {
        observer.disconnect();
        delete (el as any)._watermarkObserver;
      }

      // 移除旧的水印
      const oldWatermark = el.querySelector('.pomelo-watermark');
      if (oldWatermark) {
        el.removeChild(oldWatermark);
      }

      // 创建新的水印
      const options = binding.value || {};
      const watermarkEl = createWatermarkElement(options);
      el.appendChild(watermarkEl);

      // 设置新的防篡改监听器
      const newObserver = setupAntiTamper(el, watermarkEl, options);
      (el as any)._watermarkObserver = newObserver;
    }
  },

  beforeUnmount(el: HTMLElement) {
    // 清理资源
    const observer = (el as any)._watermarkObserver;
    if (observer) {
      observer.disconnect();
      delete (el as any)._watermarkObserver;
    }

    // 移除水印
    const watermark = el.querySelector('.pomelo-watermark');
    if (watermark) {
      el.removeChild(watermark);
    }
  },
};

export default watermark;
