# 增强文本渲染组件

组件名称: Text
库组件名称: AeText
描述: 增强文本显示，支持前置图标、圆点、类似Markdown的引用块，支持高亮文字匹配，高亮文字点击事件，自定义高亮样式，文本截断与展开，一键复制等功能。

## 入参：
```typescript
const props = {
    // 完整文本内容
    value: string;
    // 前置图标(iconify图标类:图标名称)
    icon: string;
    // 图标样式类
    iconClass: string;
    // 图标样式
    iconStyle: string | CSSProperties;
    // 圆点类型(为空时不显示)
    dotType: '' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
    // 使用引用块样式
    block: boolean = false
    // 高亮文本数组
    patterns: string[]
    // 高亮元素类
    hlClass: string
    // 高亮元素样式
    hlStyle: string | CSSProperties
    // 文本截断（true 或行数）
    truncate: boolean | number = false
    // 是否可展开
    expandable: boolean = false
    // 展开按钮文案
    expandText: string = '展开'
    // 收起按钮文案
    collapseText: string = '收起'
    // 是否可复制
    copyable: boolean = false
    // 复制图标
    copyIcon: string = 'ep:document-copy'
    // 复制成功提示
    copySuccessText: string = '复制成功'
}
const emit = {
    // 高亮元素被点击, value为高亮内容
    hlClick: (value: string) => void
    // 复制成功事件
    copy: (text: string) => void
}
```

## 功能:
1. 通过value传入完整文字内容
2. 通过icon传入iconify图标名称, 通过AeIcon组件渲染前置图标
3. 通过iconClass和iconStyle自定义图标样式
4. 通过dotType传入圆点类型, 不为空时在前置渲染圆点样式（带光晕效果）
5. 通过block设置当前组件是否使用引用块元素包裹,并模拟markdown的引用块样式(左侧贴边显示主题色的高亮条, 内容区背景色使用次级颜色)
6. 通过patterns传入高亮文本数组, 通过正则匹配进行替换为高亮元素标签
7. 通过truncate设置文本截断（true为单行，数字为多行）
8. 通过expandable设置是否可展开/收起
9. 通过copyable设置是否显示复制按钮

## 规则:
1. 使用vue3的definecomponent语法编写, 返回render函数, 不在template模板中编写DOM层.
2. 使用element plus的样式变量值
3. 样式类命名遵循element plus的规范, 如 ae-text / ae-text__highlight / ae-text__dot / ae-text__icon
4. 未使用block时, 组件默认以inline-flex方式布局, 使用block时以flex方式布局.
5. 使用less作为css语言
6. 圆点使用box-shadow实现光晕效果，并支持悬停动画
7. 截断使用CSS -webkit-line-clamp实现多行截断
8. 复制功能优先使用Clipboard API，降级使用document.execCommand
