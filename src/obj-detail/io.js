import ioContext from '../common/io-context'
import {tagApi} from '../common/util'

ioContext.create('objDetail', {
  // 对象详情
  getObjectDetail: {
    url: `${tagApi}/be_tag/tag/pool/obj_detail`,
  },

  // 指标卡
  getDailyCard: {
    url: `${tagApi}/be_tag/pool/obj_target_card`,
    mock: true,
    mockUrl: 'page-hello/getContent',
  },

  // 获取对象存储信息分页
  getObjStorageList: {
    url: `${tagApi}/be_tag/tag/pool/obj_storage_page`,
  },

  // 三次级联选择接口
  getDacList: {
    url: `${tagApi}/be_tag/tag/datasource/list`,
  },
  getTableList: {
    url: `${tagApi}/be_tag/tag/table/list_uncorrelated`,
  },
  getFieldList: {
    url: `${tagApi}/be_tag/tag/column_info`,
  },

  // 添加关联字段(人/物)
  addRelField: {
    method: 'POST',
    url: `${tagApi}/be_tag/tag/pool/add_rel_field`,
  },
  // 编辑关联字段(人/物)
  updateRelField: {
    method: 'POST',
    url: `${tagApi}/be_tag/tag/pool/update_rel_field`,
  },
  
  // 添加关联关系(关系)
  addRelFieldAss: {
    method: 'POST',
    url: `${tagApi}/be_tag/tag/pool/add_rel_field_ass`,
  },
  // 编辑关联关系(关系)
  updateRelFieldAss: {
    method: 'POST',
    url: `${tagApi}/be_tag/tag/pool/update_rel_field_ass`,
  },

  // 获取已关联字段列表(编辑时)
  getRelDbField: {
    url: `${tagApi}/be_tag/tag/pool/rel_db_field`,
  },
})

export default ioContext.api.objDetail
