import * as R from 'lodash-es'
import * as Dayjs from 'dayjs'
export interface ExpressionTools {
  lodash: typeof R
  dayjs: typeof Dayjs
}

export const expressionTools = {
  lodash: R,
  dayjs: Dayjs
}
