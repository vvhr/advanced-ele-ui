/**
 * RenderDesigner 组件导出
 * 
 * 非入侵式设计：Form 组件不需要知道 RenderDesigner 的存在
 */

export { default as RenderDesigner } from './src/RenderDesigner.vue'
export type {
  RenderDesignerProps,
  RenderDesignerValue,
  RenderComponentConfig,
  ExpressionNode,
  ConditionConfig,
  EventHandlerConfig,
  FieldBindingConfig,
  ComponentPropValue,
  RenderDesignerParams
} from './src/types/designer-config'

export {
  RenderResolver,
  createRenderResolver,
  resolveRender
} from './src/utils/render-resolver'
export type { RenderResolverOptions } from './src/utils/render-resolver'
