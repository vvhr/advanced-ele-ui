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
            <el-icon><Bold /></el-icon>
          </button>
        </el-tooltip>
        <el-tooltip content="斜体" placement="top">
          <button
            class="toolbar-btn"
            :class="{ 'is-active': editor?.isActive('italic') }"
            @click="editor?.chain().focus().toggleItalic().run()"
          >
            <el-icon><Italic /></el-icon>
          </button>
        </el-tooltip>
        <el-tooltip content="下划线" placement="top">
          <button
            class="toolbar-btn"
            :class="{ 'is-active': editor?.isActive('underline') }"
            @click="editor?.chain().focus().toggleUnderline().run()"
          >
            <el-icon><Underline /></el-icon>
          </button>
        </el-tooltip>
        <el-tooltip content="删除线" placement="top">
          <button
            class="toolbar-btn"
            :class="{ 'is-active': editor?.isActive('strike') }"
            @click="editor?.chain().focus().toggleStrike().run()"
          >
            <div class="strike-icon">S</div>
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
                 <el-icon><EditPen /></el-icon>
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
             <div class="color-item clear-item" @click="editor?.chain().focus().unsetHighlight().run()">
               x
             </div>
          </div>
        </el-popover>
      </div>
      
       <div class="divider"></div>

       <!-- Font Size & Line Height -->
       <div class="toolbar-group">
          <el-dropdown trigger="click" @command="(val: string) => editor?.chain().focus().setFontSize(val).run()">
            <button class="toolbar-btn text-btn">
              字号
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="size in FONT_SIZES" :key="size.value" :command="size.value">
                  {{ size.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

           <el-dropdown trigger="click" @command="(val: string) => editor?.chain().focus().setLineHeight(val).run()">
            <button class="toolbar-btn text-btn">
              行高
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
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
            <el-icon><List /></el-icon>
          </button>
        </el-tooltip>
        <el-tooltip content="有序列表" placement="top">
          <button
            class="toolbar-btn"
            :class="{ 'is-active': editor?.isActive('orderedList') }"
            @click="editor?.chain().focus().toggleOrderedList().run()"
          >
            <div class="list-ordered-icon">1.</div>
          </button>
        </el-tooltip>
      </div>

    </div>

    <!-- Editor Area -->
    <div class="editor-content-wrapper">
      <editor-content :editor="editor" class="editor-content" />
      <div v-if="disabled" class="editor-mask"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount, computed } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import { LineHeight } from './extensions/line-height'
import { FontSize } from './extensions/font-size'
import { FONT_SIZES, LINE_HEIGHTS, COLORS } from './constants'
import { type EditorV2Props, type EditorV2Emits } from './types'
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  List, EditPen, ArrowDown 
} from '@element-plus/icons-vue'

const props = withDefaults(defineProps<EditorV2Props>(), {
  modelValue: '',
  disabled: false,
  placeholder: '请输入内容',
  showToolbar: true
})

const emit = defineEmits<EditorV2Emits>()

const editor = useEditor({
  content: props.modelValue,
  editable: !props.disabled,
  extensions: [
    StarterKit,
    TextStyle,
    Color,
    Underline,
    Highlight.configure({ multicolor: true }),
    Placeholder.configure({
      placeholder: () => props.placeholder,
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
watch(() => props.modelValue, (newVal) => {
  const isSame = editor.value?.getHTML() === newVal
  if (!isSame && editor.value) {
    editor.value.commands.setContent(newVal, false)
  }
})

// Sync disabled state
watch(() => props.disabled, (newVal) => {
  editor.value?.setEditable(!newVal)
})

const getCurrentColor = computed(() => {
  return editor.value?.getAttributes('textStyle').color || 'currentColor'
})

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

  .strike-icon {
    text-decoration: line-through;
    font-weight: bold;
  }
  
  .list-ordered-icon {
    font-size: 12px;
    font-weight: bold;
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

  ul, ol {
    padding-left: 1.5rem;
    margin: 1em 0;
  }
  
  h1, h2, h3, h4, h5, h6 {
    line-height: 1.1;
    margin-top: 2.5rem;
    text-wrap: pretty;
    margin-bottom: 1rem;
  }

  h1, h2 {
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
