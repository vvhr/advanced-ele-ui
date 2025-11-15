/**
 * 简体中文语言包
 */
import type { LocaleConfig } from '../types'

const zhCN: LocaleConfig = {
  name: '简体中文',

  common: {
    confirm: '确定',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    view: '查看',
    search: '搜索',
    reset: '重置',
    submit: '提交',
    close: '关闭',
    back: '返回',
    next: '下一步',
    prev: '上一步',
    loading: '加载中...',
    noData: '暂无数据',
    more: '更多'
  },

  table: {
    copy: {
      success: '复制成功',
      failed: '复制失败'
    },
    selection: {
      selected: '当前已选择',
      items: '条数据'
    },
    action: {
      more: '更多'
    },
    empty: '-'
  },

  form: {
    placeholder: {
      input: '请填写{label}',
      select: '请选择{label}',
      date: '选择日期',
      time: '选择时间',
      startDate: '开始日期',
      endDate: '结束日期',
      startTime: '开始时间',
      endTime: '结束时间'
    },
    validation: {
      required: '{label}不能为空',
      requiredArray: '请至少选择一个{label}',
      noSpace: '{label}不得包含空格',
      normalText: '{label}只能包含中文、英文、数字',
      idCard: '请输入正确的身份证号码',
      mobilePhone: '请输入正确的手机号码',
      telephone: '请输入正确的电话号码',
      noChinese: '{label}不能包含中文',
      creditCode: '请输入正确的统一社会信用代码',
      onlyNumber: '{label}只能输入数字',
      onlyLetter: '{label}只能输入字母',
      email: '请输入正确的邮箱地址',
      fieldError: '{field} 填写有误',
      tableError: '{field} 填写有误',
      checkTable: '请检查表格是否按要求填写'
    }
  },

  upload: {
    button: '点击上传',
    drag: '将文件拖到此处',
    dragTip: '或点击上传',
    preview: '预览',
    download: '下载',
    delete: '删除',
    uploading: '上传中...',
    uploadSuccess: '上传成功',
    uploadFailed: '上传失败',
    fileSizeExceeded: '文件大小超出限制',
    fileTypeError: '文件类型不符合要求',
    fileCountExceeded: '文件数量超出限制',
    fileCountLimit: '最多只能上传 {limit} 个文件',
    fileSizeLimit: '文件大小不能超过 {size}',
    uploadFunctionRequired: '未配置上传函数',
    previewNotSupported: '该文件不支持预览',
    downloadNotSupported: '暂不支持下载'
  },

  pagination: {
    total: '共 {total} 条',
    goto: '前往',
    page: '页',
    itemsPerPage: '条/页'
  },

  console: {
    table: {
      rowKeyRequired: '[AeTable] 启用选择功能时需要设置 rowKey 属性',
      columnMissingKey: '[AeTable] 列 {label} 缺少 key 属性，请添加 key',
      unknownColumnType: '[AeTable] 未知的列类型: {type}',
      dictTypePropsRequired:
        '[AeTable] 列使用了 dict 类型但未配置 typeProps，无法正常解析字典。请检查列配置',
      sensitiveTypeRequired:
        '[AeTable] 列使用了 sensitive 类型，但未设置 sensitiveType 或 sensitiveRegex 属性，请检查列配置',
      noDesensitizationMethod: '[AeTable] 不存在 {type} 类型的脱敏方法',
      actionTypeRequired: '[AeTable] 列使用了 action 类型，但未配置 actions 属性，请检查列配置',
      actionEventError: '[AeTable] 操作按钮事件执行错误',
      actionNotFound: '[AeTable] dropdownActions 中不存在操作: {command}',
      componentExists: '[AeTable] 组件 {name} 已存在，将被覆盖',
      componentNotExist: '[AeTable] 注册组件数组策略失败，因为组件 {name} 不存在',
      configExists: '[AeTable] 组件配置 {name} 已存在，将被覆盖',
      componentRegistered: '[AeTable] 通过 imports 属性导入的组件 {name} 已成功注册！',
      editFieldRequired: '[AeTable] 编辑组件未设置 field 属性，请检查列配置',
      editComponentError:
        '[AeTable] 配置错误，请检查 column.editProps.component 是否正确，请检查列配置'
    },
    form: {
      componentNotExist: '[AeForm] {type} 类型组件配置异常，组件 {component} 不存在',
      componentError: '[AeForm] {type} 类型组件配置异常，请检查组件 {component} 是否正确！',
      customComponentError:
        '[AeForm] 自定义组件配置异常，如果您预期使用自定义渲染组件，请使用 render 属性或 slot 编写组件内容',
      keyRequired: '[AeForm] 组件必须设置 key 属性或 field 属性，无法渲染 schema',
      nestedStepNotSupported: '[AeForm] 不支持嵌套 Step 类型子组件，无法渲染 schema',
      nestedDescriptionsNotSupported:
        '[AeForm] 不支持嵌套 Descriptions 类型子组件，无法渲染 schema',
      nestedContainerNotSupported: '[AeForm] 不支持嵌套 Container 类型子组件，无法渲染 schema',
      wrapInDescriptions:
        '[AeForm] 在 desc 模式下，请将所有组件包裹在 Descriptions 组件内，当前组件未包裹在 Descriptions 内，请检查 schema',
      expressionCompileError: '表达式编译失败: {code}',
      expressionExecuteError: '表达式执行失败: {code}',
      dynamicPropertyError: '动态属性 {key} 设置错误',
      componentExists: '[AeForm] 组件 {name} 已存在，将被覆盖',
      configExists: '[AeForm] 组件配置 {name} 已存在，将被覆盖',
      componentRegistered: '[AeForm] 通过 imports 属性导入的组件 {name} 已成功注册！'
    },
    upload: {
      compressError: '图片压缩失败'
    },
    utils: {
      slotError: '{slot} 不是一个方法函数',
      styleWidthError: 'width 值必须为 百分比 或 以"px"单位为后缀 或 是一个整数'
    },
    format: {
      invalidDate: '无法将输入值 "{value}" 解析为有效日期',
      dateFormatError: '格式化日期时发生错误。输入值: "{value}", 格式: "{format}"'
    }
  }
}

export default zhCN
