<template>
  <div class="editor-v2-container" :class="{ 'is-disabled': disabled }">
    <!-- Toolbar -->
    <div v-if="showToolbar && !disabled" class="editor-toolbar">
      <!-- Headings -->
      <div class="toolbar-group">
        <el-tooltip content="正文" placement="top">
          <button
            class="toolbar-btn"
            :class="{ 'is-active': editor?.isActive('paragraph') }"
            @click="editor?.chain().focus().setParagraph().run()"
          >
            P
          </button>
        </el-tooltip>
        <el-tooltip content="标题 1" placement="top">
          <button
            class="toolbar-btn"
            :class="{ 'is-active': editor?.isActive('heading', { level: 1 }) }"
            @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
          >
            H1
          </button>
        </el-tooltip>
        <el-tooltip content="标题 2" placement="top">
          <button
            class="toolbar-btn"
            :class="{ 'is-active': editor?.isActive('heading', { level: 2 }) }"
            @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
          >
            H2
          </button>
        </el-tooltip>
        <el-tooltip content="标题 3" placement="top">
          <button
            class="toolbar-btn"
            :class="{ 'is-active': editor?.isActive('heading', { level: 3 }) }"
            @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
          >
            H3
          </button>
        </el-tooltip>
      </div>

      <div class="divider"></div>

      <!-- Styles -->
      <div class="toolbar-group">
        <el-tooltip content="加粗" placement="top">
          <button
            class="toolbar-btn"
            :class="{ 'is-active': editor?.isActive('bold') }"
            @click="editor?.chain().focus().toggleBold().run()"
          >
            <AeIcon icon="mdi:format-bold" :size="16" />
          </button>
        </el-tooltip>
        <el-tooltip content="斜体" placement="top">
          <button
            class="toolbar-btn"
            :class="{ 'is-active': editor?.isActive('italic') }"
            @click="editor?.chain().focus().toggleItalic().run()"
          >
            <AeIcon icon="mdi:format-italic" :size="16" />
          </button>
        </el-tooltip>
        <el-tooltip content="下划线" placement="top">
          <button
            class="toolbar-btn"
            :class="{ 'is-active': editor?.isActive('underline') }"
            @click="editor?.chain().focus().toggleUnderline().run()"
          >
            <AeIcon icon="mdi:format-underline" :size="16" />
          </button>
        </el-tooltip>
        <el-tooltip content="删除线" placement="top">
          <button
            class="toolbar-btn"
            :class="{ 'is-active': editor?.isActive('strike') }"
            @click="editor?.chain().focus().toggleStrike().run()"
          >
            <AeIcon icon="mdi:format-strikethrough" :size="16" />
          </button>
        </el-tooltip>
      </div>

      <div class="divider"></div>

      <!-- Color & Highlight -->
      <div class="toolbar-group">
        <el-popover placement="bottom" trigger="click" width="auto">
          <template #reference>
            <button class="toolbar-btn" title="文字颜色">
              <div class="color-indicator" :style="{ backgroundColor: getCurrentColor }">A</div>
            </button>
          </template>
          <div class="color-picker-panel">
            <div
              v-for="color in COLORS"
              :key="color"
              class="color-item"
              :style="{ backgroundColor: color }"
              @click="editor?.chain().focus().setColor(color).run()"
            ></div>
          </div>
        </el-popover>

        <el-popover placement="bottom" trigger="click" width="auto">
          <template #reference>
            <button class="toolbar-btn" title="背景颜色">
              <div class="bg-indicator">
                <AeIcon icon="mdi:format-color-highlight" :size="16" />
              </div>
            </button>
          </template>
          <div class="color-picker-panel">
            <div
              v-for="color in COLORS"
              :key="color"
              class="color-item"
              :style="{ backgroundColor: color }"
              @click="editor?.chain().focus().toggleHighlight({ color }).run()"
            ></div>
            <div
              class="color-item clear-item"
              @click="editor?.chain().focus().unsetHighlight().run()"
            >
              x
            </div>
          </div>
        </el-popover>
      </div>

      <div class="divider"></div>

      <!-- Font Size & Line Height -->
      <div class="toolbar-group">
        <el-dropdown
          trigger="click"
          @command="(val: string) => editor?.chain().focus().setFontSize(val).run()"
        >
          <button class="toolbar-btn text-btn">
            字号
            <AeIcon icon="mdi:chevron-down" :size="16" class="el-icon--right" />
          </button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="size in FONT_SIZES" :key="size.value" :command="size.value">
                {{ size.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-dropdown
          trigger="click"
          @command="(val: string) => editor?.chain().focus().setLineHeight(val).run()"
        >
          <button class="toolbar-btn text-btn">
            行高
            <AeIcon icon="mdi:chevron-down" :size="16" class="el-icon--right" />
          </button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="lh in LINE_HEIGHTS" :key="lh.value" :command="lh.value">
                {{ lh.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <div class="divider"></div>

      <!-- Lists -->
      <div class="toolbar-group">
        <el-tooltip content="无序列表" placement="top">
          <button
            class="toolbar-btn"
            :class="{ 'is-active': editor?.isActive('bulletList') }"
            @click="editor?.chain().focus().toggleBulletList().run()"
          >
            <AeIcon icon="mdi:format-list-bulleted" :size="16" />
          </button>
        </el-tooltip>
        <el-tooltip content="有序列表" placement="top">
          <button
            class="toolbar-btn"
            :class="{ 'is-active': editor?.isActive('orderedList') }"
            @click="editor?.chain().focus().toggleOrderedList().run()"
          >
            <AeIcon icon="mdi:format-list-numbered" :size="16" />
          </button>
        </el-tooltip>
      </div>

      <div class="divider"></div>

      <!-- Actions -->
      <div class="toolbar-group">
        <el-tooltip content="撤销" placement="top">
          <button
            class="toolbar-btn"
            :disabled="!editor?.can().undo()"
            @click="editor?.chain().focus().undo().run()"
          >
            <AeIcon icon="mdi:undo" :size="16" />
          </button>
        </el-tooltip>
        <el-tooltip content="重做" placement="top">
          <button
            class="toolbar-btn"
            :disabled="!editor?.can().redo()"
            @click="editor?.chain().focus().redo().run()"
          >
            <AeIcon icon="mdi:redo" :size="16" />
          </button>
        </el-tooltip>
      </div>

      <div class="divider"></div>

      <!-- Block Elements -->
      <div class="toolbar-group">
        <el-tooltip content="引用" placement="top">
          <button
            class="toolbar-btn"
            :class="{ 'is-active': editor?.isActive('blockquote') }"
            @click="editor?.chain().focus().toggleBlockquote().run()"
          >
            <AeIcon icon="mdi:format-quote-close" :size="16" />
          </button>
        </el-tooltip>
        <el-tooltip content="代码块" placement="top">
          <button
            class="toolbar-btn"
            :class="{ 'is-active': editor?.isActive('codeBlock') }"
            @click="editor?.chain().focus().toggleCodeBlock().run()"
          >
            <AeIcon icon="mdi:code-tags" :size="16" />
          </button>
        </el-tooltip>
        <el-tooltip content="行内代码" placement="top">
          <button
            class="toolbar-btn"
            :class="{ 'is-active': editor?.isActive('code') }"
            @click="editor?.chain().focus().toggleCode().run()"
          >
            <AeIcon icon="mdi:code-braces" :size="16" />
          </button>
        </el-tooltip>
        <el-tooltip content="水平线" placement="top">
          <button
            class="toolbar-btn"
            @click="editor?.chain().focus().setHorizontalRule().run()"
          >
            <AeIcon icon="mdi:minus" :size="16" />
          </button>
        </el-tooltip>
      </div>

      <div class="divider"></div>

      <!-- Media & Table -->
      <div class="toolbar-group">
        <el-tooltip content="插入图片" placement="top">
          <button class="toolbar-btn" @click="handleInsertImage">
            <AeIcon icon="mdi:image" :size="16" />
          </button>
        </el-tooltip>
        <el-tooltip content="插入表格" placement="top">
          <button class="toolbar-btn" @click="handleInsertTable">
            <AeIcon icon="mdi:table" :size="16" />
          </button>
        </el-tooltip>
      </div>

      <div class="divider"></div>

      <!-- Source Code -->
      <div class="toolbar-group">
        <el-tooltip content="源代码视图" placement="top">
          <button
            class="toolbar-btn"
            :class="{ 'is-active': isSourceMode }"
            @click="toggleSourceMode"
          >
            <AeIcon icon="mdi:code-json" :size="16" />
          </button>
        </el-tooltip>
      </div>
    </div>

    <!-- Editor Area -->
    <div class="editor-content-wrapper">
      <editor-content v-if="!isSourceMode" :editor="editor" class="editor-content" />
      <textarea
        v-else
        v-model="sourceCode"
        class="source-code-editor"
        @blur="handleSourceCodeBlur"
      ></textarea>
      <div v-if="disabled" class="editor-mask"></div>
    </div>

    <!-- Hidden file input for image upload -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      style="display: none"
      @change="handleImageFileSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount, computed } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import { LineHeight } from './extensions/line-height'
import { FontSize } from './extensions/font-size'
import { FONT_SIZES, LINE_HEIGHTS, COLORS } from './constants'
import { type EditorV2Props, type EditorV2Emits } from './types'
import { AeIcon } from '@/components/Icon'
import { ElMessage } from 'element-plus'

const props = withDefaults(defineProps<EditorV2Props>(), {
  modelValue: '',
  disabled: false,
  placeholder: '请输入内容',
  showToolbar: true
})

const emit = defineEmits<EditorV2Emits>()

const isSourceMode = ref(false)
const sourceCode = ref('')
const fileInputRef = ref<HTMLInputElement>()

const editor = useEditor({
  content: props.modelValue,
  editable: !props.disabled,
  extensions: [
    StarterKit,
    TextStyle,
    Color,
    Underline,
    Highlight.configure({ multicolor: true }),
    // @ts-ignore - 版本冲突导致的类型错误，但运行时可用
    Image.configure({
      inline: false,
      allowBase64: true,
      HTMLAttributes: {
        class: 'editor-image'
      }
    }),
    // @ts-ignore - 版本冲突导致的类型错误，但运行时可用
    Table.configure({
      resizable: true,
      HTMLAttributes: {
        class: 'editor-table'
      }
    }),
    // @ts-ignore - 版本冲突导致的类型错误，但运行时可用
    TableRow.configure({}),
    // @ts-ignore - 版本冲突导致的类型错误，但运行时可用
    TableHeader.configure({}),
    // @ts-ignore - 版本冲突导致的类型错误，但运行时可用
    TableCell.configure({}),
    Placeholder.configure({
      placeholder: () => props.placeholder
    }),
    LineHeight,
    FontSize
  ],
  onUpdate: ({ editor }) => {
    const html = editor.getHTML()
    emit('update:modelValue', html)
    emit('change', html)
  },
  onFocus: () => {
    emit('focus')
  },
  onBlur: () => {
    emit('blur')
  }
})

// Sync v-model
watch(
  () => props.modelValue,
  newVal => {
    const isSame = editor.value?.getHTML() === newVal
    if (!isSame && editor.value) {
      editor.value.commands.setContent(newVal, { emitUpdate: false })
    }
  }
)

// Sync disabled state
watch(
  () => props.disabled,
  newVal => {
    editor.value?.setEditable(!newVal)
  }
)

const getCurrentColor = computed(() => {
  return editor.value?.getAttributes('textStyle').color || 'currentColor'
})

// 源代码视图切换
const toggleSourceMode = () => {
  if (!editor.value) return
  
  if (isSourceMode.value) {
    // 从源代码模式切换回编辑模式
    try {
      editor.value.commands.setContent(sourceCode.value, { emitUpdate: false })
      isSourceMode.value = false
    } catch (error) {
      ElMessage.error('源代码格式错误，无法应用')
    }
  } else {
    // 切换到源代码模式
    sourceCode.value = editor.value.getHTML()
    isSourceMode.value = true
  }
}

// 源代码编辑器失焦时同步内容
const handleSourceCodeBlur = () => {
  if (editor.value && isSourceMode.value) {
    try {
      editor.value.commands.setContent(sourceCode.value, { emitUpdate: false })
    } catch (error) {
      ElMessage.error('源代码格式错误')
    }
  }
}

// 插入图片
const handleInsertImage = () => {
  fileInputRef.value?.click()
}

const handleImageFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    ElMessage.warning('请选择图片文件')
    return
  }

  // 检查文件大小（限制为 5MB）
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.warning('图片大小不能超过 5MB')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    if (result && editor.value) {
      // @ts-ignore - 类型定义问题，但运行时可用
      editor.value.chain().focus().setImage({ src: result }).run()
      ElMessage.success('图片插入成功')
    }
  }
  reader.onerror = () => {
    ElMessage.error('图片读取失败')
  }
  reader.readAsDataURL(file)

  // 清空 input，以便可以重复选择同一文件
  target.value = ''
}

// 插入表格
const handleInsertTable = () => {
  if (!editor.value) return
  // @ts-ignore - 类型定义问题，但运行时可用
  editor.value.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
}

// 监听编辑器内容变化，同步源代码
watch(
  () => editor.value?.getHTML(),
  (html) => {
    if (html && !isSourceMode.value) {
      sourceCode.value = html
    }
  }
)

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style lang="less" scoped>
.editor-v2-container {
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  overflow: hidden;
  background-color: var(--el-bg-color);
  display: flex;
  flex-direction: column;
  transition: border-color 0.2s;

  &:hover {
    border-color: var(--el-border-color-hover);
  }

  &.is-disabled {
    opacity: 0.7;
    cursor: not-allowed;
    background-color: var(--el-fill-color-light);
  }
}

.editor-toolbar {
  padding: 8px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  background-color: var(--el-fill-color-blank);
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;

  .toolbar-group {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .divider {
    width: 1px;
    height: 18px;
    background-color: var(--el-border-color);
    margin: 0 4px;
  }
}

.toolbar-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  padding: 4px 8px;
  height: 30px;
  min-width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-regular);
  transition: all 0.2s;
  font-size: 14px;

  &:hover {
    background-color: var(--el-fill-color-light);
    color: var(--el-color-primary);
  }

  &.is-active {
    background-color: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.text-btn {
    width: auto;
    gap: 4px;
  }

  .color-indicator {
    width: 16px;
    height: 16px;
    border-radius: 2px;
    border: 1px solid var(--el-border-color-lighter);
    line-height: 14px;
    font-weight: bold;
    font-size: 12px;
    text-align: center;
  }
}

.editor-content-wrapper {
  position: relative;
  min-height: 200px;
  flex: 1;
  display: flex;
  flex-direction: column;

  .editor-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.5);
    z-index: 10;
    cursor: not-allowed;
  }

  .source-code-editor {
    flex: 1;
    width: 100%;
    padding: 16px;
    min-height: 200px;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.5;
    border: none;
    outline: none;
    resize: none;
    background-color: var(--el-bg-color);
    color: var(--el-text-color-primary);
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

:deep(.tiptap) {
  flex: 1;
  outline: none;
  padding: 16px;
  min-height: 200px;

  p.is-editor-empty:first-child::before {
    color: var(--el-text-color-placeholder);
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }

  ul,
  ol {
    padding-left: 1.5rem;
    margin: 1em 0;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
    margin-top: 2.5rem;
    text-wrap: pretty;
    margin-bottom: 1rem;
  }

  h1,
  h2 {
    margin-top: 3.5rem;
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 1.4rem;
  }
  h2 {
    font-size: 1.2rem;
  }
  h3 {
    font-size: 1.1rem;
  }

  // 表格样式
  table {
    border-collapse: collapse;
    margin: 1em 0;
    table-layout: fixed;
    width: 100%;
    overflow: hidden;

    td,
    th {
      min-width: 1em;
      border: 1px solid var(--el-border-color);
      padding: 8px;
      vertical-align: top;
      box-sizing: border-box;
      position: relative;

      > * {
        margin: 0;
      }
    }

    th {
      font-weight: bold;
      text-align: left;
      background-color: var(--el-fill-color-light);
    }

    .selectedCell:after {
      z-index: 2;
      position: absolute;
      content: '';
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: rgba(64, 158, 255, 0.1);
      pointer-events: none;
    }

    .column-resize-handle {
      position: absolute;
      right: -2px;
      top: 0;
      bottom: -2px;
      width: 4px;
      background-color: var(--el-color-primary);
      pointer-events: none;
    }
  }

  // 图片样式
  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 1em 0;

    &.ProseMirror-selectednode {
      outline: 2px solid var(--el-color-primary);
      outline-offset: 2px;
    }
  }
}

.color-picker-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  width: 200px;
  padding: 8px;

  .color-item {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    cursor: pointer;
    border: 1px solid var(--el-border-color-lighter);

    &:hover {
      transform: scale(1.1);
    }
  }

  .clear-item {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    background-color: transparent;
    border: 1px solid var(--el-border-color);
  }
}
</style>
