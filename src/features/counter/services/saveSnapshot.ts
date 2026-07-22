function getDocumentCssText(): string {
  const rules: string[] = [];
  for (const styleSheet of Array.from(document.styleSheets)) {
    try {
      for (const rule of Array.from(styleSheet.cssRules)) {
        rules.push(rule.cssText);
      }
    } catch {
      // 跨來源 stylesheet 無法讀取；主畫面目前使用 Emotion 內嵌樣式，不依賴此類規則。
    }
  }
  return rules.join("\n");
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("瀏覽器無法將主畫面 SVG 轉為圖片。"));
    image.src = url;
  });
}

function createSvgDataUrl(svg: string): string {
  // SVG 若經 blob: URL 載入且內含 foreignObject，部分瀏覽器會把後續 canvas
  // 判定為非 origin-clean，導致 toBlob() 丟出 SecurityError。直接使用 data URL
  // 可保留 SVG 的完整內容，同時避免 blob URL 的不透明來源判定。
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob === null) {
        reject(new Error("瀏覽器無法產生 PNG Blob；可能有跨來源圖片污染 Canvas。"));
        return;
      }
      resolve(blob);
    }, "image/png");
  });
}

/**
 * 不依賴 Server 或第三方套件，使用 SVG foreignObject 將目前主畫面轉成 PNG。
 * 主畫面若日後加入跨來源圖片，必須提供正確 CORS，否則會明確失敗且不清零。
 * 回傳 Blob 而非直接下載，讓呼叫端可以與其他匯出檔案一起打包成單一 ZIP。
 */
export async function renderElementToPngBlob(element: HTMLElement): Promise<Blob> {
  await document.fonts.ready;

  const width = Math.max(element.scrollWidth, element.clientWidth);
  const height = Math.max(element.scrollHeight, element.clientHeight);
  if (width <= 0 || height <= 0) {
    throw new Error(`截圖尺寸無效：${width}×${height}。`);
  }

  const clone = element.cloneNode(true) as HTMLElement;
  clone.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  clone.style.width = `${width}px`;
  clone.style.height = `${height}px`;

  const background = getComputedStyle(element).backgroundColor || "#ffffff";
  const serializedElement = new XMLSerializer().serializeToString(clone);
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `<foreignObject width="100%" height="100%">`,
    `<div xmlns="http://www.w3.org/1999/xhtml" style="width:${width}px;height:${height}px;background:${background};overflow:hidden">`,
    `<style>${getDocumentCssText()}</style>`,
    serializedElement,
    `</div>`,
    `</foreignObject>`,
    `</svg>`
  ].join("");

  const image = await loadImage(createSvgDataUrl(svg));
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(width * scale);
  canvas.height = Math.ceil(height * scale);
  const context = canvas.getContext("2d");
  if (context === null) {
    throw new Error("瀏覽器不支援 Canvas 2D。");
  }
  context.scale(scale, scale);
  context.drawImage(image, 0, 0, width, height);
  return canvasToBlob(canvas);
}
