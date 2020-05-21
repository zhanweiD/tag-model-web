import ioContext from '../../common/io-context'
import {
  baseApi, tagModalApi, get, post, derivativeApi,
} from '../../common/util'


const api = {
  getDetail: get(`${derivativeApi}/scheme/visual_derivative_schema_info`), // 编辑方案显示内容
  // 基本信息
  getObjList: post(`${derivativeApi}/schema/underObjList`), // 基础信息 - 对象下拉列表
  getAssObj: get(`${derivativeApi}/schema/ass_obj`), // 查询源标签对象限制
  saveBaseInfo: post(`${derivativeApi}/schema/save_visual_derivative_scheme`), // 保存可视化方案（第一个页面
  updateBaseInfo: post(`${derivativeApi}/schema/update_visual_derivative_scheme`), // 更新可视化方案（第一个页面

  // 逻辑配置-标签树
  createTag: post(`${tagModalApi}/create_derivative_tag`), // 创建标签
  getTagCateSelectList: get(`${baseApi}/cate/cate_tree`), // 创建标签 - 所属类目下拉数据

  getDerivativeTagList: get(`${baseApi}/tag/list_derivative_tag`), // 查询衍生标签
  getTagDetail: get(`${tagModalApi}/tag_detail`), // 标签详情

  checkName: post(`${derivativeApi}/schema/checkName`), // 基础信息 - 方案名称查重
  checkTagName: post(`${baseApi}/tag/name_check`), // 基础信息 - 方案名称查重

  // 逻辑配置-配置框
  getFunction: get(`${derivativeApi}/scheme/function_list`), // 获取函数
  getSelectTag: post(`${derivativeApi}/scheme/tag_list`), // 获取全部标签

  saveVisualExt: post(`${derivativeApi}/schema/save_visual_ext`), // 保存可视化条件表达式（条件页面）
  updateVisualExt: post(`${derivativeApi}/schema/update_visual_ext`), // 修改可视化条件表达式（条件页面）
  submitVisual: post(`${derivativeApi}/scheme/submit_visual`), // 保存可视化条件表达式（条件页面）

  saveVisualRule: post(`${derivativeApi}/schema/save_visual_filter_condition`), // 保存可视化过滤条件
  updateVisualRule: post(`${derivativeApi}/schema/update_visual_filter_condition`), // 修改可视化过滤条件
  getVisualRuleDetail: get(`${derivativeApi}/scheme/where_info`), // 数据过滤规则查看
} 

ioContext.create('visualConfig', api) 

export default ioContext.api.visualConfig
