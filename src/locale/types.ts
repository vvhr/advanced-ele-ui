/**
 * 国际化类型定义
 */

/**
 * 支持的语言
 */
export type Language = 'zh-CN' | 'en-US'

/**
 * 深度可选类型工具
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

/**
 * 语言包配置
 */
export interface LocaleConfig {
  name: string

  // 通用
  common: {
    confirm: string
    cancel: string
    save: string
    delete: string
    edit: string
    view: string
    search: string
    reset: string
    submit: string
    close: string
    back: string
    next: string
    prev: string
    loading: string
    noData: string
    more: string
  }

  // 表格
  table: {
    copy: {
      success: string
      failed: string
    }
    selection: {
      selected: string
      items: string
    }
    action: {
      more: string
    }
    empty: string
  }

  // 表单
  form: {
    placeholder: {
      input: string // 请填写{label}
      select: string // 请选择{label}
      date: string // 选择日期
      time: string // 选择时间
      startDate: string // 开始日期
      endDate: string // 结束日期
      startTime: string // 开始时间
      endTime: string // 结束时间
    }
    validation: {
      required: string // {label}不能为空
      requiredArray: string // 请至少选择一个{label}
      noSpace: string // {label}不得包含空格
      normalText: string // {label}只能包含中文、英文、数字
      idCard: string // 请输入正确的身份证号码
      mobilePhone: string // 请输入正确的手机号码
      telephone: string // 请输入正确的电话号码
      noChinese: string // {label}不能包含中文
      creditCode: string // 请输入正确的统一社会信用代码
      onlyNumber: string // {label}只能输入数字
      onlyLetter: string // {label}只能输入字母
      email: string // 请输入正确的邮箱地址
      fieldError: string // {field} 填写有误
      tableError: string // {field} 填写有误
      checkTable: string // 请检查表格是否按要求填写
    }
  }

  // 上传
  upload: {
    button: string
    drag: string
    dragTip: string
    preview: string
    download: string
    delete: string
    uploading: string
    uploadSuccess: string
    uploadFailed: string
    fileSizeExceeded: string
    fileTypeError: string
    fileCountExceeded: string
    fileCountLimit: string // 最多只能上传 {limit} 个文件
    fileSizeLimit: string // 文件大小不能超过 {size}
    uploadFunctionRequired: string // 未配置上传函数
    previewNotSupported: string // 该文件不支持预览
    downloadNotSupported: string // 暂不支持下载
  }

  // 分页
  pagination: {
    total: string // 共 {total} 条
    goto: string // 前往
    page: string // 页
    itemsPerPage: string // 条/页
  }

  // 控制台消息
  console: {
    // Table 相关
    table: {
      rowKeyRequired: string
      columnMissingKey: string
      unknownColumnType: string
      dictTypePropsRequired: string
      sensitiveTypeRequired: string
      noDesensitizationMethod: string
      actionTypeRequired: string
      actionEventError: string
      actionNotFound: string
      componentExists: string
      componentNotExist: string
      configExists: string
      componentRegistered: string
      editFieldRequired: string
      editComponentError: string
    }
    // Form 相关
    form: {
      componentNotExist: string
      componentError: string
      customComponentError: string
      keyRequired: string
      nestedStepNotSupported: string
      nestedDescriptionsNotSupported: string
      nestedContainerNotSupported: string
      wrapInDescriptions: string
      expressionCompileError: string
      expressionExecuteError: string
      dynamicPropertyError: string
      componentExists: string
      configExists: string
      componentRegistered: string
    }
    // Upload 相关
    upload: {
      compressError: string
    }
    utils: {
      slotError: string
      styleWidthError: string
    }
    format: {
      invalidDate: string
      dateFormatError: string
    }
  }
}
