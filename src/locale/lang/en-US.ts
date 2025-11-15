/**
 * English language pack
 */
import type { LocaleConfig } from '../types'

const enUS: LocaleConfig = {
  name: 'English',

  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    search: 'Search',
    reset: 'Reset',
    submit: 'Submit',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    prev: 'Previous',
    loading: 'Loading...',
    noData: 'No Data',
    more: 'More'
  },

  table: {
    copy: {
      success: 'Copied successfully',
      failed: 'Copy failed'
    },
    selection: {
      selected: 'Selected',
      items: 'items'
    },
    action: {
      more: 'More'
    },
    empty: '-'
  },

  form: {
    placeholder: {
      input: 'Please enter {label}',
      select: 'Please select {label}',
      date: 'Select date',
      time: 'Select time',
      startDate: 'Start date',
      endDate: 'End date',
      startTime: 'Start time',
      endTime: 'End time'
    },
    validation: {
      required: '{label} is required',
      requiredArray: 'Please select at least one {label}',
      noSpace: '{label} cannot contain spaces',
      normalText: '{label} can only contain Chinese, English, and numbers',
      idCard: 'Please enter a valid ID card number',
      mobilePhone: 'Please enter a valid mobile phone number',
      telephone: 'Please enter a valid telephone number',
      noChinese: '{label} cannot contain Chinese characters',
      creditCode: 'Please enter a valid unified social credit code',
      onlyNumber: '{label} can only contain numbers',
      onlyLetter: '{label} can only contain letters',
      email: 'Please enter a valid email address',
      fieldError: '{field} is invalid',
      tableError: '{field} is invalid',
      checkTable: 'Please check if the table is filled in as required'
    }
  },

  upload: {
    button: 'Click to upload',
    drag: 'Drop file here',
    dragTip: 'or click to upload',
    preview: 'Preview',
    download: 'Download',
    delete: 'Delete',
    uploading: 'Uploading...',
    uploadSuccess: 'Upload successful',
    uploadFailed: 'Upload failed',
    fileSizeExceeded: 'File size exceeds limit',
    fileTypeError: 'File type does not meet requirements',
    fileCountExceeded: 'File count exceeds limit',
    fileCountLimit: 'Maximum {limit} files can be uploaded',
    fileSizeLimit: 'File size cannot exceed {size}',
    uploadFunctionRequired: 'Upload function is not configured',
    previewNotSupported: 'This file does not support preview',
    downloadNotSupported: 'Download is not supported yet'
  },

  pagination: {
    total: 'Total {total} items',
    goto: 'Go to',
    page: '',
    itemsPerPage: 'items/page'
  },

  console: {
    table: {
      rowKeyRequired: '[AeTable] rowKey is required when selection is enabled',
      columnMissingKey: '[AeTable] column {label} is missing key, please add key to column',
      unknownColumnType: '[AeTable] Unknown column type: {type}',
      dictTypePropsRequired:
        '[AeTable] Column used "dict" type but did not configure "typeProps", unable to parse the dictionary normally. Please check the column',
      sensitiveTypeRequired:
        '[AeTable] Column used "sensitive" type, but "sensitiveType" or "sensitiveRegex" attributes were not set, please check the column',
      noDesensitizationMethod: '[AeTable] There is no desensitization method for type {type}',
      actionTypeRequired:
        '[AeTable] The column uses "action" type, but "actions" property is not configured, please check the column',
      actionEventError: '[AeTable] Action event error',
      actionNotFound: '[AeTable] dropdownActions does not contain action: {command}',
      componentExists: '[AeTable] The component {name} already exists and will be overwritten',
      componentNotExist:
        '[AeTable] Failed to register component array strategy because the component {name} does not exist',
      configExists:
        '[AeTable] The component configuration {name} already exists and will be overwritten',
      componentRegistered:
        '[AeTable] The component {name} imported via the imports property has been successfully registered!',
      editFieldRequired:
        '[AeTable] The edit component has not set the field property. please check column',
      editComponentError:
        '[AeTable] Configuration error, please check if "column.editProps.component" is correct, please check column'
    },
    form: {
      componentNotExist:
        '[AeForm] The configuration of the {type} type component is abnormal, The component {component} does not exist',
      componentError:
        '[AeForm] The configuration of the {type} type component is abnormal, please check if the component {component} is correct!',
      customComponentError:
        '[AeForm] Custom component configuration exception, if you expect to use a custom render component, please write the component content using the render property or slot!',
      keyRequired:
        '[AeForm] The component must set the key property or the field property, unable to render schema',
      nestedStepNotSupported:
        '[AeForm] Unsupported nested Step type child components, unable to render schema',
      nestedDescriptionsNotSupported:
        '[AeForm] Nested Descriptions type child components are not supported, unable to render schema',
      nestedContainerNotSupported:
        '[AeForm] Nested Container type child components are not supported, cannot render schema',
      wrapInDescriptions:
        '[AeForm] In desc mode, please wrap all components within the Descriptions component, the current component is not wrapped within Descriptions, please check schema',
      expressionCompileError: 'Expression compile failed: {code}',
      expressionExecuteError: 'Expression execute failed: {code}',
      dynamicPropertyError: 'Dynamic property {key} error',
      componentExists: '[AeForm] The component {name} already exists and will be overwritten',
      configExists:
        '[AeForm] The component configuration {name} already exists and will be overwritten',
      componentRegistered:
        '[AeForm] The component {name} imported via the imports property has been successfully registered!'
    },
    upload: {
      compressError: 'Image compression failed'
    },
    utils: {
      slotError: 'slot {slot} is not a function',
      styleWidthError:
        'The width value must be a percentage, have the "px" unit suffix, or be an integer.'
    },
    format: {
      invalidDate: 'Unable to parse input value "{value}" as a valid date',
      dateFormatError: 'Error formatting date. Input value: "{value}", Format: "{format}"'
    }
  }
}

export default enUS
