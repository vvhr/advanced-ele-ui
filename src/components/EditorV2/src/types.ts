export interface EditorV2Props {
  modelValue?: string
  disabled?: boolean
  placeholder?: string
  showToolbar?: boolean
}

export interface EditorV2Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
  (e: 'focus'): void
  (e: 'blur'): void
}
