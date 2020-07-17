import ioContext from '../../common/io-context'
import {
  derivativeApi, baseApi, get, post,
} from '../../common/util'

const api = {
  getList: get(`${derivativeApi}/schema/scheme_page`), // 加工方案列表
  // getList: get('http://192.168.90.129:3000/mock/16/derivative/scheme/visual_scheme_page'), // 加工方案列表
  getObjList: post(`${derivativeApi}/schema/underObjList`), // 基础信息 - 对象下拉列表
  getObjDetail: get(`${baseApi}/project/object/object_basic`), // 对象基本信息
  checkName: post(`${derivativeApi}/schema/checkName`), // 基础信息 - 方案名称查重
  // 用于方案编辑时获取详情
  getSchemeDetail: get(`${derivativeApi}/schema/basic_info`), // 标签方案基础信息
  getSchemeConfigInfo: get(`${derivativeApi}/schema/config_info`), // 标签方案配置信息

  getTagTree: post(`${derivativeApi}/schema/tagsTreeSearch`), // 逻辑配置 - 标签树
  getFunTree: get(`${derivativeApi}/schema/functionTree`), // 逻辑配置 - 函数树
  
  submitScheme: post(`${derivativeApi}/schema/submit`), // 提交衍生标签方案
  manualRunScheme: post(`${derivativeApi}/schema/manual_run`), // 方案手动执行
  deleteScheme: post(`${derivativeApi}/schema/delete_scheme`), // 删除方案
  cloneScheme: post(`${derivativeApi}/schema/clone_scheme`), // 克隆方案

  saveSchema: post(`${derivativeApi}/schema/schemaSaveOrUpdate`), // 方案整体保存/更新
  getSubmitLog: get(`${derivativeApi}/schema/submit_log`), // 查询提交日志

  // 标签配置
  // getFieldList: get(`${baseApi}/targetSource/sourceFields`), // 获取标签列表
  getFieldList: get('http://192.168.90.129:3000/mock/16/targetSource/sourceFields'), // 获取标签列表

  // 权限code
  getAuthCode: get(`${baseApi}/project/getFunctionCodes`),
}

ioContext.create('tagSchema', api) 

export default ioContext.api.tagSchema
