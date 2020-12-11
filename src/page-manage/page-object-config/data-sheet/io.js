import ioContext from '../../../common/io-context'
import {baseApi, get, post} from '../../../common/util'

const api = {
  //* ------------------------------ 添加关联字段 ------------------------------*//
  // getList: get(`${baseApi}/tag/pool/obj_storage_page`), // 对象配置 - 数据表列表
  getList: get(`${baseApi}/tagConfig/obj_storage_page`), // 对象配置 - 数据表列表
  getDataSource: get(`${baseApi}/tagConfig/datasource/pro_datasource`), // 添加关联字段 - 数据源列表（当前项目下）
  getDataSheet: get(`${baseApi}/tagConfig/listUncorrelatedSourceTable`), // 添加关联字段 - 数据表列表 (数据源下所有数据比爱(排除已关联))
  removeList: post(`${baseApi}/tagConfig/remove_tag_field_rel`), // 移除数据表
  getFieldList: get(`${baseApi}/tagConfig/column_info`), // 添加关联字段 - 字段列表（数据表字段信息(数据采集)）
  
  checkWhere: post(`${baseApi}/tagConfig/check_where`), // 添加关联表 - where条件校验

  getDataSheetDetail: get(`${baseApi}/tagConfig/obj_storage_detail`), // 数据表详情

  // 添加
  saveEntityField: post(`${baseApi}/tagConfig/add_rel_field`), // 添加关联字段(实体)
  saveRelField: post(`${baseApi}/tagConfig/add_rel_field_ass`), // 添加关联字段(关系)
  // fieldSuccessInfo: get(`${baseApi}/project/object/storage_detail`), // 表添加成功后展示内容

  getMappingKey: get(`${baseApi}/project/object/mapping_key`), // 根据实体、数据表获取实体主标签在该表对应的主键

  getEntityDataSource: get(`${baseApi}/project/object/getObjTableList`), // 对象配置 - 简单关系从关联实体数据表选择数据表列表
} 

ioContext.create('objectConfigTable', api) 

export default ioContext.api.objectConfigTable
