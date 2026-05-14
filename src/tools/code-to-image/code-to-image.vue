<script setup lang="ts">
import { Copy, Download } from '@vicons/tabler';
import { useStorage } from '@vueuse/core';
import * as monaco from 'monaco-editor';
import { useStyleStore } from '@/stores/style.store';

interface LanguageOption {
  label: string
  value: string
}

interface ExportSegment {
  color: string
  font: string
  text: string
}

const styleStore = useStyleStore();
const message = useMessage();

const previewRef = ref<HTMLElement>();
const isRendering = ref(false);
const renderedCode = ref('');

const languageOptions: LanguageOption[] = [
  { label: 'TypeScript', value: 'typescript' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TSX', value: 'typescriptreact' },
  { label: 'JSX', value: 'javascriptreact' },
  { label: 'JSON', value: 'json' },
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'SCSS', value: 'scss' },
  { label: 'Markdown', value: 'markdown' },
  { label: 'YAML', value: 'yaml' },
  { label: 'SQL', value: 'sql' },
  { label: 'XML', value: 'xml' },
  { label: 'Shell', value: 'shell' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'C#', value: 'csharp' },
  { label: 'Go', value: 'go' },
  { label: 'Rust', value: 'rust' },
  { label: 'PHP', value: 'php' },
];

const code = useStorage(
  'code-to-image:code',
  'function greet(name: string) {\n'
  + '  const message = `Hello, ' + '$' + '{name}`;\n\n'
  + '  if (!message) {\n'
  + '    return \'Hello, world!\';\n'
  + '  }\n\n'
  + '  return `' + '$' + '{message}`;\n'
  + '}\n\n'
  + 'console.log(greet(\'IT-Tools\'));',
);
const language = useStorage<string>('code-to-image:language', 'typescript');

const previewThemeName = computed(() => styleStore.isDarkTheme ? 'it-tools-code-to-image-dark' : 'it-tools-code-to-image-light');
const previewBackground = computed(() => styleStore.isDarkTheme ? '#1e1e1e' : '#ffffff');
const previewForeground = computed(() => styleStore.isDarkTheme ? '#d4d4d4' : '#1f2328');
const canCopyImage = computed(() => typeof ClipboardItem !== 'undefined' && !!navigator.clipboard?.write);

monaco.editor.defineTheme('it-tools-code-to-image-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#1e1e1e',
  },
});

monaco.editor.defineTheme('it-tools-code-to-image-light', {
  base: 'vs',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#ffffff',
  },
});

let renderToken = 0;

watch(
  [code, language, previewThemeName],
  async () => {
    const currentToken = ++renderToken;
    isRendering.value = true;
    monaco.editor.setTheme(previewThemeName.value);

    try {
      const html = await monaco.editor.colorize(code.value || ' ', language.value, {});

      if (currentToken === renderToken) {
        renderedCode.value = html;
      }
    }
    catch {
      if (currentToken === renderToken) {
        renderedCode.value = await monaco.editor.colorize(code.value || ' ', 'plaintext', {});
      }
    }
    finally {
      if (currentToken === renderToken) {
        isRendering.value = false;
      }
    }
  },
  { immediate: true },
);

function getCanvasFont(style: CSSStyleDeclaration) {
  return [style.fontStyle, style.fontVariant, style.fontWeight, style.fontSize, style.fontFamily]
    .filter(Boolean)
    .join(' ');
}

function parsePixelValue(value: string, fallback: number) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeExportText(text: string) {
  return text.replace(/\t/g, '  ');
}

function collectExportLines(root: HTMLElement) {
  const lines: ExportSegment[][] = [[]];

  function currentLine() {
    return lines.at(-1)!;
  }

  function pushLine() {
    lines.push([]);
  }

  function visit(node: ChildNode, parentStyle: CSSStyleDeclaration) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = normalizeExportText(node.textContent ?? '');

      if (text.length > 0) {
        currentLine().push({
          color: parentStyle.color,
          font: getCanvasFont(parentStyle),
          text,
        });
      }

      return;
    }

    if (!(node instanceof HTMLElement)) {
      return;
    }

    if (node.tagName === 'BR') {
      pushLine();
      return;
    }

    const style = window.getComputedStyle(node);
    node.childNodes.forEach(child => visit(child, style));
  }

  const baseStyle = window.getComputedStyle(root);
  root.childNodes.forEach(child => visit(child, baseStyle));

  return { baseStyle, lines };
}

async function renderPreviewBlob() {
  const element = previewRef.value;
  const previewCode = element?.querySelector<HTMLElement>('.preview-code');

  if (!element || !previewCode) {
    throw new Error('Preview not ready');
  }

  if ('fonts' in document) {
    await document.fonts.ready;
  }

  const width = Math.max(1, Math.ceil(element.scrollWidth));
  const height = Math.max(1, Math.ceil(element.scrollHeight));
  const previewStyle = window.getComputedStyle(element);
  const previewClone = previewCode.cloneNode(true) as HTMLElement;
  previewClone.style.position = 'fixed';
  previewClone.style.left = '-99999px';
  previewClone.style.top = '0';
  previewClone.style.visibility = 'hidden';
  previewClone.style.pointerEvents = 'none';
  previewClone.style.width = 'fit-content';
  document.body.appendChild(previewClone);

  const { baseStyle, lines } = collectExportLines(previewClone);
  previewClone.remove();

  const scale = Math.max(2, window.devicePixelRatio || 1);
  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas is not available');
  }

  context.scale(scale, scale);
  context.fillStyle = previewBackground.value;
  context.fillRect(0, 0, width, height);
  context.textBaseline = 'top';

  const fontSize = parsePixelValue(baseStyle.fontSize, 14);
  const lineHeight = parsePixelValue(baseStyle.lineHeight, fontSize * 1.6);
  const paddingLeft = parsePixelValue(previewStyle.paddingLeft, 24);
  const paddingTop = parsePixelValue(previewStyle.paddingTop, 20);

  lines.forEach((segments, index) => {
    let x = paddingLeft;
    const y = paddingTop + index * lineHeight;

    segments.forEach((segment) => {
      context.font = segment.font;
      context.fillStyle = segment.color;
      context.fillText(segment.text, x, y);
      x += context.measureText(segment.text).width;
    });
  });

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }

      reject(new Error('Failed to export PNG'));
    }, 'image/png');
  });
}

async function downloadImage() {
  try {
    const blob = await renderPreviewBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'code-to-image.png';
    link.click();
    URL.revokeObjectURL(url);
  }
  catch {
    message.error('Unable to export the image.');
  }
}

async function copyImage() {
  if (!canCopyImage.value) {
    message.error('Image clipboard is not supported in this browser.');
    return;
  }

  try {
    const blob = await renderPreviewBlob();
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    message.success('Image copied to the clipboard');
  }
  catch {
    message.error('Unable to copy the image.');
  }
}
</script>

<template>
  <div flex flex-col gap-4>
    <div class="layout-grid">
      <c-card class="panel-card">
        <div class="controls" flex flex-col gap-4>
          <c-input-text
            v-model:value="code"
            label="Code"
            multiline
            rows="18"
            autosize
            raw-text
            monospace
            placeholder="Paste your code here..."
            autofocus
          />

          <div class="actions" flex flex-col gap-3 md:flex-row md:items-end>
            <c-select
              v-model:value="language"
              label="Language"
              :options="languageOptions"
              class="language-select"
            />

            <div class="action-buttons" flex gap-3>
              <c-button :disabled="isRendering" @click="downloadImage">
                <n-icon :component="Download" mr-8px />
                Download PNG
              </c-button>

              <c-button :disabled="isRendering || !canCopyImage" @click="copyImage">
                <n-icon :component="Copy" mr-8px />
                Copy image
              </c-button>
            </div>
          </div>

          <c-alert v-if="!canCopyImage">
            Your browser does not support copying PNG images to the clipboard. PNG download is still available.
          </c-alert>
        </div>
      </c-card>

      <c-card title="Preview" class="panel-card">
        <div class="preview-scroll">
          <div
            ref="previewRef"
            class="preview-frame"
            :style="{
              backgroundColor: previewBackground,
              color: previewForeground,
            }"
          >
            <div class="preview-code" v-html="renderedCode" />
          </div>
        </div>
      </c-card>
    </div>
  </div>
</template>

<style scoped lang="less">
.layout-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.controls {
  width: 100%;
}

.actions {
  justify-content: space-between;
}

.action-buttons {
  flex-wrap: wrap;
}

.language-select {
  width: 220px;
  max-width: 100%;
}

.preview-scroll {
  overflow: auto;
}

.preview-frame {
  width: fit-content;
  min-width: 100%;
  padding: 20px 24px;
  border-radius: 4px;
  box-sizing: border-box;
}

.preview-code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre;
  tab-size: 2;
}

@media (min-width: 1500px) {
  .layout-grid {
    grid-template-columns: minmax(520px, 1.1fr) minmax(480px, 1fr);
    align-items: start;
  }
}

::v-deep(.preview-code .mtkz) {
  color: inherit;
}
</style>
