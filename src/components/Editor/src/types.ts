/**
 * 工具栏按钮
 * @description 工具栏按钮类型
 * @remarks
 * - `|` 分割线
 * - `undo` 撤销
 * - `redo` 重做
 * - `brush` 格式刷
 * - `eraser` 清除格式
 * - `heading` 正文/标题
 * - `font-family` 字体
 * - `font-size` 字号
 * - `bold` 加粗
 * - `italic` 斜体
 * - `underline` 下划线
 * - `strike` 删除线
 * - `link` 链接
 * - `code` 行内代码
 * - `subscript` 下标
 * - `superscript` 上标
 * - `hr` 分割线
 * - `todo` 任务列表
 * - `emoji` 表情
 * - `highlight` 高亮
 * - `font-color` 字体颜色
 * - `align` 对齐
 * - `line-height` 行高
 * - `bullet-list` 无序列表
 * - `ordered-list` 有序列表
 * - `indent-decrease` 减少缩进
 * - `indent-increase` 增加缩进
 * - `break` 换行
 * - `image` 图片
 * - `video` 视频
 * - `attachment` 附件
 * - `quote` 引用
 * - `container` 高亮块
 * - `code-block` 代码块
 * - `table` 表格
 * - `source-code` 源代码
 * - `printer` 打印
 * - `fullscreen` 全屏
 * - `ai` AI助手
 */
export type ToolbarKey =
  | '|'
  | 'undo'
  | 'redo'
  | 'brush'
  | 'eraser'
  | 'heading'
  | 'font-family'
  | 'font-size'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'link'
  | 'code'
  | 'subscript'
  | 'superscript'
  | 'hr'
  | 'todo'
  | 'emoji'
  | 'highlight'
  | 'font-color'
  | 'align'
  | 'line-height'
  | 'bullet-list'
  | 'ordered-list'
  | 'indent-decrease'
  | 'indent-increase'
  | 'break'
  | 'image'
  | 'video'
  | 'attachment'
  | 'quote'
  | 'container'
  | 'code-block'
  | 'table'
  | 'source-code'
  | 'printer'
  | 'fullscreen'
  | 'ai'

export type AddToolItemPosition = number | ToolbarKey

/**
 * 在指定位置添加工具栏按钮
 * @description 第一个元素为位置，第二个元素为按钮key值, 表示在该位置后插入一个工具栏按钮
 */
export type AddToolItem = [AddToolItemPosition, ToolbarKey]
