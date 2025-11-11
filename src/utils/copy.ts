export async function copyToClipboard(val: string): Promise<Boolean> {
  if (!val) return false

  // Preferred modern API
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(val)
      return true
    } catch {
      // Fall through to legacy approach on failure (e.g. insecure context)
    }
  }
  // Legacy fallback using a temporary textarea and execCommand
  try {
    const textarea = document.createElement('textarea')
    // Prevent scrolling to bottom in iOS
    textarea.style.position = 'fixed'
    textarea.style.top = '0'
    textarea.style.left = '0'
    textarea.style.width = '1px'
    textarea.style.height = '1px'
    textarea.style.padding = '0'
    textarea.style.border = 'none'
    textarea.style.outline = 'none'
    textarea.style.boxShadow = 'none'
    textarea.style.background = 'transparent'
    textarea.value = val
    document.body.appendChild(textarea)
    textarea.select()
    // For iOS selection range hack
    textarea.setSelectionRange(0, textarea.value.length)

    const successful = document.execCommand('copy')
    document.body.removeChild(textarea)
    return successful
  } catch {
    return false
  }
}
