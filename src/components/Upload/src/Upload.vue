<template>
  <div class="ae-upload" :class="`ae-upload--${size}`">
    <!-- 示例图和模板 -->
    <div v-if="examples?.length || templates?.length" class="ae-upload__header">
      <span v-if="examples?.length" class="ae-upload__link" @click="handleViewExamples">
        查看示例
      </span>
      <el-dropdown v-if="templates?.length" @command="handleDownloadTemplate">
        <span class="ae-upload__link">
          下载模板
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="(template, index) in templates"
              :key="index"
              :command="template"
            >
              {{ template.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 文件列表 -->
    <div class="ae-upload__list" :class="`ae-upload__list--${listType}`">
      <!-- picture 模式 -->
      <template v-if="listType === 'picture'">
        <div
          v-for="item in internalFileList"
          :key="item.uid"
          class="ae-upload__item ae-upload__item--picture"
        >
          <div class="ae-upload__item-content">
            <!-- 图片预览 -->
            <img
              v-if="
                item.data &&
                isImageFile(getFileUrl(item.data), getFileName(item.data)) &&
                !item.imageLoadError
              "
              :src="getFileUrl(item.data)"
              alt=""
              :style="{ objectFit: objectFit }"
              class="ae-upload__image"
              @click="handlePreview(item.data!)"
              @error="handleImageError(item)"
            />
            <!-- 非图片文件或图片加载失败 -->
            <div v-else class="ae-upload__file-icon" @click="item.data && handlePreview(item.data)">
              <Icon
                :size="pictureFileIconSize"
                :icon="getFileIcon(getFileUrl(item.data), getFileName(item.data))"
              />
              <div class="ae-upload__file-name">{{ item.data ? getFileName(item.data) : '' }}</div>
            </div>

            <!-- loading 状态 -->
            <div v-if="item.status === 'uploading'" class="ae-upload__loading">
              <el-icon class="is-loading">
                <Loading />
              </el-icon>
            </div>

            <!-- hover 遮罩 -->
            <div v-if="item.status === 'success'" class="ae-upload__mask">
              <el-icon v-if="previewable" @click="item.data && handlePreview(item.data)">
                <ZoomIn />
              </el-icon>
              <el-icon
                v-if="downloadable && disabled"
                @click="item.data && handleDownload(item.data)"
              >
                <Download />
              </el-icon>
              <el-icon v-if="!disabled" @click="handleRemove(item)">
                <Delete />
              </el-icon>
            </div>
          </div>
        </div>

        <!-- 上传按钮 -->
        <div
          v-if="showUploadButton"
          class="ae-upload__trigger ae-upload__trigger--picture"
          @click="handleTriggerClick"
        >
          <el-icon :size="iconSize">
            <Plus />
          </el-icon>
        </div>
      </template>

      <!-- text 模式 -->
      <template v-else>
        <div
          v-for="item in internalFileList"
          :key="item.uid"
          class="ae-upload__item ae-upload__item--text"
        >
          <Icon
            class="ae-upload__item-icon"
            :size="listFileIconSize"
            :icon="getFileIcon(getFileUrl(item.data), getFileName(item.data))"
          />
          <span class="ae-upload__item-name">
            {{ item.data ? getFileName(item.data) : '' }}
          </span>
          <el-icon v-if="item.status === 'uploading'" class="ae-upload__item-loading is-loading">
            <Loading />
          </el-icon>
          <div v-if="item.status === 'success'" class="ae-upload__item-actions">
            <el-icon
              v-if="previewable"
              class="ae-upload__item-action"
              @click="item.data && handlePreview(item.data)"
            >
              <ZoomIn />
            </el-icon>
            <el-icon
              v-if="downloadable && disabled"
              class="ae-upload__item-action"
              @click="item.data && handleDownload(item.data)"
            >
              <Download />
            </el-icon>
            <el-icon v-if="!disabled" class="ae-upload__item-delete" @click="handleRemove(item)">
              <Close />
            </el-icon>
          </div>
        </div>

        <!-- 上传按钮 -->
        <div
          v-if="showUploadButton"
          class="ae-upload__trigger ae-upload__trigger--text"
          @click="handleTriggerClick"
        >
          <el-icon>
            <UploadIcon />
          </el-icon>
          <span>点击上传</span>
        </div>
      </template>
    </div>

    <!-- 提示文字 -->
    <div v-if="tips || $slots.tip" class="ae-upload__tips">
      <slot name="tip">{{ tips }}</slot>
    </div>

    <!-- 隐藏的文件输入框 -->
    <input
      ref="inputRef"
      type="file"
      class="ae-upload__input"
      :accept="accept"
      :multiple="multiple"
      @change="handleFileChange"
    />

    <!-- 图片预览 -->
    <el-image-viewer
      v-if="showImageViewer"
      :url-list="previewImages"
      :initial-index="previewIndex"
      @close="showImageViewer = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Icon } from '@/components/Icon'
import {
  ElMessage,
  ElImageViewer,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElIcon
} from 'element-plus'
import { logger, t } from '@/locale'
import {
  Plus,
  Delete,
  ZoomIn,
  Loading,
  Close,
  Upload as UploadIcon,
  ArrowDown,
  Download
} from '@element-plus/icons-vue'
import type {
  UploadProps,
  UploadEmits,
  InternalUploadFile,
  UploadFile,
  FileTemplate
} from './types'
import {
  generateUid,
  isImageFile,
  getFileValue,
  checkFileSize,
  parseSizeLimit,
  formatFileSize,
  isImageFileByType,
  compressImage,
  getFileIcon
} from './utils'

defineOptions({
  name: 'AeUpload'
})

const props = withDefaults(defineProps<UploadProps>(), {
  modelValue: () => [],
  fileKeys: () => ({ name: 'name', url: 'url' }),
  multiple: false,
  disabled: false,
  listType: 'picture',
  size: 'default',
  objectFit: 'cover',
  autoCompress: false,
  previewable: true,
  downloadable: false
})

const emit = defineEmits<UploadEmits>()

// refs
const inputRef = ref<HTMLInputElement>()
const internalFileList = ref<InternalUploadFile[]>([])
const showImageViewer = ref(false)
const previewImages = ref<string[]>([])
const previewIndex = ref(0)

// computed
const showUploadButton = computed(() => {
  if (props.disabled) return false
  if (!props.limit) return true
  return internalFileList.value.filter(item => item.status === 'success').length < props.limit
})

const iconSize = computed(() => {
  const sizeMap = { small: 16, default: 20, large: 24 }
  return sizeMap[props.size]
})
const pictureFileIconSize = computed(() => {
  const sizeMap = { small: 24, default: 48, large: 96 }
  return sizeMap[props.size]
})
const listFileIconSize = computed(() => {
  const sizeMap = { small: 18, default: 20, large: 22 }
  return sizeMap[props.size]
})

// 同步 modelValue 到内部文件列表
watch(
  () => props.modelValue,
  newVal => {
    if (!newVal) return
    internalFileList.value = newVal.map(file => ({
      uid: generateUid(),
      status: 'success' as const,
      data: file,
      imageLoadError: false
    }))
  },
  { immediate: true, deep: true }
)

// methods
function getFileName(file: UploadFile): string {
  return getFileValue(file, props.fileKeys, 'name')
}

function getFileUrl(file: UploadFile): string {
  return getFileValue(file, props.fileKeys, 'url')
}

function handleTriggerClick() {
  inputRef.value?.click()
}

async function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const files = Array.from(target.files || [])

  if (!files.length) return

  // 检查数量限制
  if (props.limit) {
    const currentCount = internalFileList.value.filter(item => item.status === 'success').length
    const availableCount = props.limit - currentCount

    if (files.length > availableCount) {
      ElMessage.warning(t('upload.fileCountLimit', { limit: props.limit }))
      files.splice(availableCount)
    }
  }

  // 处理每个文件
  for (const file of files) {
    await processFile(file)
  }

  // 清空 input
  target.value = ''
}

async function processFile(file: File) {
  let rawFile = file as any
  rawFile.uid = generateUid()

  // before-upload 钩子
  if (props.beforeUpload) {
    try {
      const result = await props.beforeUpload(rawFile)
      if (result === false) return
    } catch {
      return
    }
  }

  // 自动压缩图片
  if (props.autoCompress && isImageFileByType(rawFile)) {
    try {
      const compressedFile = await compressImage(rawFile)
      // 保留原始的 uid
      const uid = rawFile.uid
      rawFile = compressedFile as any
      rawFile.uid = uid
    } catch (error) {
      logger.error('console.upload.compressError', undefined, error)
      // 压缩失败，继续使用原文件
    }
  }

  // 检查文件大小（压缩后）
  if (props.sizeLimit && !checkFileSize(rawFile, props.sizeLimit)) {
    const limit = parseSizeLimit(props.sizeLimit)
    ElMessage.error(t('upload.fileSizeLimit', { size: formatFileSize(limit) }))
    return
  }

  // 添加到列表（uploading 状态）
  const internalFile: InternalUploadFile = {
    uid: rawFile.uid,
    status: 'uploading',
    rawFile,
    imageLoadError: false
  }
  internalFileList.value.push(internalFile)

  // 调用上传函数
  if (!props.upload) {
    ElMessage.error(t('upload.uploadFunctionRequired'))
    internalFileList.value = internalFileList.value.filter(item => item.uid !== internalFile.uid)
    return
  }

  try {
    const result = await props.upload(rawFile)

    if (result === false) {
      // 上传失败，移除文件
      internalFileList.value = internalFileList.value.filter(item => item.uid !== internalFile.uid)
    } else {
      // 上传成功
      internalFile.status = 'success'
      internalFile.data = result

      // 更新 modelValue
      updateModelValue()

      // 触发事件
      emit('upload', result)
      emit('change', getSuccessFiles())
    }
  } catch {
    // 上传失败，移除文件
    internalFileList.value = internalFileList.value.filter(item => item.uid !== internalFile.uid)
  }
}

async function handleRemove(item: InternalUploadFile) {
  if (!item.data) return

  // before-remove 钩子
  if (props.beforeRemove) {
    try {
      const result = await props.beforeRemove(item.data)
      if (result === false) return
    } catch {
      return
    }
  }

  // 从列表中移除
  internalFileList.value = internalFileList.value.filter(f => f.uid !== item.uid)

  // 更新 modelValue
  updateModelValue()

  // 触发事件
  emit('remove', item.data)
  emit('change', getSuccessFiles())
}

function handlePreview(file: UploadFile) {
  // 如果用户自定义了预览方法，使用自定义方法
  if (props.preview) {
    props.preview(file)
    return
  }

  // 默认预览逻辑
  const url = getFileUrl(file)
  const fileName = getFileName(file)

  if (isImageFile(url, fileName)) {
    // 图片预览
    const imageFiles = internalFileList.value
      .filter(item => item.data && isImageFile(getFileUrl(item.data), getFileName(item.data)))
      .map(item => getFileUrl(item.data!))

    previewImages.value = imageFiles
    previewIndex.value = imageFiles.indexOf(url)
    showImageViewer.value = true
  } else {
    ElMessage.info(t('upload.previewNotSupported'))
    // 非图片文件，触发 preview 事件
    emit('preview', file)
  }
}

function handleViewExamples() {
  if (!props.examples?.length) return
  previewImages.value = props.examples.map(item => item.url)
  previewIndex.value = 0
  showImageViewer.value = true
}

function handleDownloadTemplate(template: FileTemplate) {
  if (props.downloadTemplate) {
    props.downloadTemplate(template)
  } else {
    window.open(template.url, '_blank')
  }
}

function handleDownload(file: UploadFile) {
  // 如果用户自定义了下载方法，使用自定义方法
  if (props.downloadFile) {
    props.downloadFile(file)
    return
  }

  // 默认下载逻辑
  const url = getFileUrl(file)
  if (!url) {
    ElMessage.warning(t('upload.downloadNotSupported'))
    return
  }

  // 创建 a 标签触发下载
  const link = document.createElement('a')
  link.href = url
  link.download = getFileName(file) || 'download'
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function getSuccessFiles(): UploadFile[] {
  return internalFileList.value
    .filter(item => item.status === 'success' && item.data)
    .map(item => item.data!)
}

function updateModelValue() {
  emit('update:modelValue', getSuccessFiles())
}

function handleImageError(item: InternalUploadFile) {
  // 图片加载失败，标记为错误状态，显示为文件图标
  item.imageLoadError = true
}
</script>

<style scoped lang="less">
.ae-upload {
  width: 100%;

  &__header {
    display: flex;
    gap: 16px;
    margin-bottom: 12px;
  }

  &__link {
    color: var(--el-color-primary);
    cursor: pointer;
    font-size: 14px;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 4px;

    &:hover {
      text-decoration: underline;
    }
  }

  &__list {
    display: flex;

    &--picture {
      flex-wrap: wrap;
      gap: 12px;
    }

    &--text {
      flex-direction: column;
      gap: 8px;
    }
  }

  &__item {
    &--picture {
      position: relative;
      width: 128px;
      height: 128px;
      border: 1px solid var(--el-border-color);
      border-radius: var(--el-border-radius-base);
      overflow: hidden;
      cursor: pointer;
    }

    &--text {
      display: flex;
      align-items: center;
      gap: 8px;
      height: 40px;
      padding: 8px 12px;
      border: 1px solid var(--el-border-color);
      border-radius: var(--el-border-radius-base);
      transition: background-color 0.3s;

      &:hover {
        background-color: var(--el-fill-color-light);
      }
    }
  }

  &__item-content {
    width: 100%;
    height: 100%;
    position: relative;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__file-icon {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px;
    box-sizing: border-box;
  }

  &__file-name {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
  }

  &__loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.8);

    .el-icon {
      font-size: 24px;
      color: var(--el-color-primary);
    }
  }

  &__mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    opacity: 0;
    transition: opacity 0.3s;

    .el-icon {
      font-size: 20px;
      color: #fff;
      cursor: pointer;
      transition: transform 0.3s;

      &:hover {
        transform: scale(1.2);
      }
    }
  }

  &__item--picture:hover &__mask {
    opacity: 1;
  }

  &__item-icon {
    font-size: 20px;
    color: var(--el-text-color-secondary);
  }

  &__item-name {
    flex: 1;
    font-size: 14px;
    color: var(--el-text-color-regular);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__item-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__item-action {
    font-size: 16px;
    color: var(--el-text-color-secondary);
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: var(--el-color-primary);
    }
  }

  &__item-loading {
    font-size: 16px;
    color: var(--el-color-primary);
  }

  &__item-delete {
    font-size: 16px;
    color: var(--el-text-color-secondary);
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: var(--el-color-danger);
    }
  }

  &__trigger {
    cursor: pointer;
    transition: all 0.3s;

    &--picture {
      width: 128px;
      height: 128px;
      border: 1px dashed var(--el-border-color);
      border-radius: var(--el-border-radius-base);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--el-text-color-secondary);

      &:hover {
        border-color: var(--el-color-primary);
        color: var(--el-color-primary);
      }
    }

    &--text {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      height: 40px;
      padding: 8px 12px;
      border: 1px dashed var(--el-border-color);
      border-radius: var(--el-border-radius-base);
      color: var(--el-text-color-regular);

      &:hover {
        border-color: var(--el-color-primary);
        color: var(--el-color-primary);
      }
    }
  }

  &__tips {
    margin-top: 8px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
    line-height: 1.5;
  }

  &__input {
    display: none;
  }

  // 尺寸变体
  &--small {
    .ae-upload__file-icon {
      padding: 2px;
      gap: 2px;
    }

    .ae-upload__file-name {
      -webkit-line-clamp: 1;
      line-clamp: 1;
    }

    .ae-upload__item--picture {
      width: 64px;
      height: 64px;
    }

    .ae-upload__trigger--picture {
      width: 64px;
      height: 64px;
    }

    .ae-upload__item--text {
      height: 32px;
      padding: 6px 8px;
      font-size: 12px;
    }

    .ae-upload__trigger--text {
      height: 32px;
      padding: 6px 8px;
      font-size: 12px;
    }

    .ae-upload__list--picture {
      gap: 8px;
    }

    .ae-upload__file-name {
      font-size: 10px;
    }
  }

  &--large {
    .ae-upload__item--picture {
      width: 256px;
      height: 256px;
    }

    .ae-upload__trigger--picture {
      width: 256px;
      height: 256px;
    }

    .ae-upload__item--text {
      height: 48px;
      padding: 10px 16px;
      font-size: 16px;
    }

    .ae-upload__trigger--text {
      height: 48px;
      padding: 10px 16px;
      font-size: 16px;
    }

    .ae-upload__list--picture {
      gap: 16px;
    }

    .ae-upload__file-name {
      font-size: 14px;
    }
  }
}
</style>
