import { type Ref, unref } from 'vue'
import type { ElDialog } from 'element-plus'

export function useDraggable(
  dialogRef: Ref<InstanceType<typeof ElDialog> | undefined>,
  headerRef: Ref<HTMLElement | undefined>,
  isMaximized: Ref<boolean>,
  isFullscreen: Ref<boolean>
) {
  let isDragging = false
  let startX = 0
  let startY = 0
  let initialLeft = 0
  let initialTop = 0

  const startDrag = (e: MouseEvent) => {
    if (unref(isMaximized) || unref(isFullscreen)) return

    const dialog = unref(dialogRef)
    if (!dialog) return

    const dialogElement = dialog.$el?.querySelector('.el-dialog') as HTMLElement
    if (!dialogElement) return

    isDragging = true
    startX = e.clientX
    startY = e.clientY

    // 获取当前位置
    const rect = dialogElement.getBoundingClientRect()
    initialLeft = rect.left
    initialTop = rect.top

    // 设置为绝对定位
    dialogElement.style.position = 'fixed'
    dialogElement.style.margin = '0'
    dialogElement.style.left = `${initialLeft}px`
    dialogElement.style.top = `${initialTop}px`

    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', stopDrag)

    // 防止文本选择
    e.preventDefault()
  }

  const onDrag = (e: MouseEvent) => {
    if (!isDragging) return

    const dialog = unref(dialogRef)
    if (!dialog) return

    const dialogElement = dialog.$el?.querySelector('.el-dialog') as HTMLElement
    if (!dialogElement) return

    const deltaX = e.clientX - startX
    const deltaY = e.clientY - startY

    let newLeft = initialLeft + deltaX
    let newTop = initialTop + deltaY

    // 边界限制
    const maxLeft = window.innerWidth - dialogElement.offsetWidth
    const maxTop = window.innerHeight - dialogElement.offsetHeight

    newLeft = Math.max(0, Math.min(newLeft, maxLeft))
    newTop = Math.max(0, Math.min(newTop, maxTop))

    dialogElement.style.left = `${newLeft}px`
    dialogElement.style.top = `${newTop}px`
  }

  const stopDrag = () => {
    isDragging = false
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', stopDrag)
  }

  return {
    startDrag
  }
}
