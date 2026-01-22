 # 组合输入器
 
 ## 组件命名
 ComboInput

 ## 组件介绍
 为实现将组合输入的"邮箱号"/"不动产证号"等场景的多组件组合进行原子化封装, 该组件支持预传入组合模板配置, 组件键将根据模板配置来动态渲染子组件内容.

 ## 组件入参
 1. modelValue: string "本组件必然接收或返回一个字符串"
 2. template: string | ComboTemplate[] "组合模板配置"
 4. disabled: string "是否禁止输入"
 5. size: 'small' | 'default' | 'large' "尺寸" 
 
 ### template 组合模板配置
 1. 可传入模板字符串如: "闽({year})永安市不动产权第{no}号‌", 该模式下会自动将{xxx}生成el-input输入框, UI结构如:
```html
 <span>闽(</span>
 <el-select v-model="templateModel.year" :options="[]"/>
 <span>)永安市不动产权第</span>
 <el-input v-model="templateModel.no"/>
 <span>号</span>
```
 2. 可传入详细的配置: 
 ```JavaScript
[
    {
        tag: 'span',
        content: '闽('
    },
    {
        tag: 'select',
        prop: 'year',
        componentProps: {
            placeholder: '选择年份',
            options: [
                { label: '2021', value:'2021' },
                { label: '2022', value:'2022' },
            ]
        }
    },
    {
        tag: 'span',
        content: ')永安市不动产权第'
    },
    {
        tag: 'input',
        prop: 'no',
        componentProps: {
            placeholder: '输入编号'
        }
    },
    {
        tag: 'span',
        content: '号'
    },
]

 ```

 3. ComboTemplate的完整类型定义
 ```typescript

interface ComboTemplate = {
    tag: 'span' | 'select' | 'input' | 'date-picker'
    prop?: string // 输入性组件的自定义变量名,若未定义组件会自动生成一个如: select_1
    content?: string // 非输入性组件的文本内容
    componentProps: any // 输入性组件的自身属性
}

 ```


 ## 组件关键流程
 1. 监听template变化自动更新渲染
 2. 监听modelValue变化自动更新内部templateModel中的属性名和属性值
 3. 当templateModel中的输入性组件触发change事件时重新组装完整值并通过update:modelValue更新
 
 ## Style层规则
 1. 统一使用符合element plus组件库的组件样式类命名规范和习惯
 2. 统一使用element plus的样式值变量

 ## 设计要求
 1. 使用definecomponent方式编写组件, 在setup的return中返回组件或使用tsx编写组件, 避免通过<template>标签编写组件.
 2. 组件默认采用display: flex+align-items:center布局
 3. 模块化开发,拆分类型/常量/工具函数到单独的代码文件
 4. 尽可能考虑周全, 考虑各种极端情况, 提升组件稳定性
 5. 注意性能问题, 使用安全/高性能的编写方法


 