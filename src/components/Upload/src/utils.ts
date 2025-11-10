import type { UploadRawFile, FileKeys, UploadFile } from './types'

/**
 * 生成唯一ID
 */
export function generateUid(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * 解析文件大小限制
 * @param limit 文件大小限制，支持 '1MB', '500KB', '1GB' 或数字（字节）
 * @returns 字节数
 */
export function parseSizeLimit(limit: string | number): number {
  if (typeof limit === 'number') {
    return limit
  }

  const units: Record<string, number> = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024
  }

  const match = limit.match(/^(\d+(?:\.\d+)?)(B|KB|MB|GB)?$/i)
  if (!match) {
    return 0
  }

  const value = parseFloat(match[1])
  const unit = (match[2] || 'B').toUpperCase()

  return value * (units[unit] || 1)
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

/**
 * 获取文件扩展名
 */
export function getFileExtension(url: string): string {
  const match = url.match(/\.([^./?#]+)(?:[?#]|$)/i)
  return match ? match[1].toLowerCase() : ''
}

/**
 * 判断是否为图片文件
 * @param url 文件 URL
 * @param fileName 文件名（可选）
 */
export function isImageFile(url: string, fileName?: string): boolean {
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg']

  // 优先从文件名判断
  if (fileName) {
    const fileExt = getFileExtension(fileName)
    if (fileExt) {
      return imageExts.includes(fileExt)
    }
  }

  // 文件名没有后缀，从 URL 判断
  const urlExt = getFileExtension(url)
  return imageExts.includes(urlExt)
}

/**
 * 获取文件类型图标
 * @param url 文件 URL
 * @param fileName 文件名（可选）
 */
export function getFileIcon(url: string, fileName?: string): string {
  // 优先从文件名获取扩展名
  let ext = ''
  if (fileName) {
    ext = getFileExtension(fileName)
  }

  // 文件名没有后缀，从 URL 获取
  if (!ext) {
    ext = getFileExtension(url)
  }

  const iconMap: Record<string, string> = {
    // Document
    pdf: 'material-icon-theme:pdf',
    doc: 'material-icon-theme:word',
    docx: 'material-icon-theme:word',
    xls: 'material-icon-theme:table',
    xlsx: 'material-icon-theme:table',
    csv: 'material-icon-theme:table',
    ppt: 'material-icon-theme:powerpoint',
    pptx: 'material-icon-theme:powerpoint',
    // Text
    md: 'material-icon-theme:markdoc-config',
    txt: 'material-icon-theme:document',
    yml: 'material-icon-theme:yaml',
    json: 'material-icon-theme:json',
    // Compression
    zip: 'material-icon-theme:zip',
    rar: 'solar:winrar-bold-duotone',
    '7z': 'hugeicons:7z-02',
    // Language
    html: 'material-icon-theme:html',
    htm: 'material-icon-theme:html',
    jsx: 'file-icons:jsx-alt',
    tsx: 'file-icons:tsx-alt',
    vue: 'material-icon-theme:vue-config',
    ts: 'material-icon-theme:typescript',
    js: 'material-icon-theme:javascript',
    py: 'devicon:python',
    java: 'devicon:java',
    go: 'devicon:go-wordmark',
    rs: 'devicon:rust',
    php: 'devicon:php',
    sh: 'file-icons:powershell',
    bash: 'file-icons:powershell',
    // Database
    sql: 'devicon:mysql-wordmark',
    db: '',
    git: 'devicon:git',
    // Style
    css: 'devicon:css3',
    // Design
    psd: 'material-icon-theme:adobe-photoshop-light',
    ai: 'material-icon-theme:adobe-illustrator-light',
    // Media
    mp3: 'teenyicons:mp3-solid',
    mp4: 'teenyicons:mp4-solid',
    mov: 'teenyicons:mov-solid',
    avi: 'lsicon:file-avi-outline',
    wav: 'hugeicons:wav-01',
    // Image
    png: 'fluent-color:image-16',
    jpg: 'fluent-color:image-16',
    jpeg: 'fluent-color:image-16',
    bmp: 'fluent-color:image-16',
    svg: 'fluent-color:image-16',
    gif: 'fluent-color:image-16',
    tiff: 'fluent-color:image-16',
    webp: 'fluent-color:image-16',
    ico: 'fluent-color:image-16'
  }

  return iconMap[ext] || 'material-icon-theme:document'
}

/**
 * 从文件对象中获取指定键的值
 */
export function getFileValue(file: UploadFile, keys: FileKeys, key: keyof FileKeys): string {
  return file[keys[key]] || ''
}

/**
 * 检查文件大小是否超出限制
 */
export function checkFileSize(file: UploadRawFile, sizeLimit?: string | number): boolean {
  if (!sizeLimit) return true
  const limit = parseSizeLimit(sizeLimit)
  return file.size <= limit
}

/**
 * 判断文件是否为图片类型（通过 MIME type）
 */
export function isImageFileByType(file: File): boolean {
  return file.type.startsWith('image/')
}

/**
 * 压缩图片文件
 * @param file 原始图片文件
 * @param quality 压缩质量 0-1，默认 0.8
 * @param maxWidth 最大宽度，默认 1920
 * @param maxHeight 最大高度，默认 1920
 * @returns 压缩后的文件
 */
export function compressImage(
  file: File,
  quality = 0.8,
  maxWidth = 1920,
  maxHeight = 1920
): Promise<File> {
  return new Promise((resolve, reject) => {
    // 如果不是图片，直接返回原文件
    if (!isImageFileByType(file)) {
      resolve(file)
      return
    }

    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = e => {
      const img = new Image()
      img.src = e.target?.result as string

      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          reject(new Error('无法获取 canvas context'))
          return
        }

        // 计算压缩后的尺寸
        let { width, height } = img

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = width * ratio
          height = height * ratio
        }

        canvas.width = width
        canvas.height = height

        // 绘制图片
        ctx.drawImage(img, 0, 0, width, height)

        // 转换为 Blob
        canvas.toBlob(
          blob => {
            if (!blob) {
              reject(new Error('图片压缩失败'))
              return
            }

            // 创建新的 File 对象
            const compressedFile = new File([blob], file.name, {
              type: file.type || 'image/jpeg',
              lastModified: Date.now()
            })

            // 如果压缩后反而更大，返回原文件
            if (compressedFile.size >= file.size) {
              resolve(file)
            } else {
              resolve(compressedFile)
            }
          },
          file.type || 'image/jpeg',
          quality
        )
      }

      img.onerror = () => {
        reject(new Error('图片加载失败'))
      }
    }

    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }
  })
}
