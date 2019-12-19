import ioContext from '../../common/io-context'
import {baseApi, get, post} from '../../common/util'

const api = {
  //* ------------------------------ 添加关联字段 ------------------------------*//
  getList: get(`${baseApi}/tag/pool/obj_storage_page`), // 对象配置 - 数据表列表
  getDataSource: get(`${baseApi}/tag/datasource/list`), // 添加关联字段 - 数据源列表
  getDataSheet: get(`${baseApi}/tag/table/list_uncorrelated`), // 添加关联字段 - 数据表列表 (数据源下所有数据比爱(排除已关联))
  removeList: post(`${baseApi}/tag/pool/remove_tag_field_rel`), // 移除数据表
  getFieldList: get(`${baseApi}/tag/column_info`), // 添加关联字段 - 字段列表（数据表字段信息(数据采集)）
  getReledFieldList: get(`${baseApi}/tag/pool/rel_db_field`), // 添加关联字段 - 获取关联对象已选字段列表(编辑字段)

  // 添加
  saveEntityField: post(`${baseApi}/tag/pool/add_rel_field`), // 添加关联字段(实体)
  saveRelField: post(`${baseApi}/tag/pool/add_rel_field_ass`), // 添加关联字段(关系)
  fieldSuccessInfo: get(`${baseApi}/project/object/storage_detail`), // 表添加成功后展示内容
  
  // 编辑
  updateEntityField: post(`${baseApi}/tag/pool/update_rel_field`), // 更新关联字段(实体)
  updateRelField: post(`${baseApi}/tag/pool/update_rel_field_ass`), // 更新关联字段(关系)
} 

ioContext.create('objectConfigTable', api) 

export default ioContext.api.objectConfigTable
