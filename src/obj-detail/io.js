import ioContext from '../common/io-context'
import {tagApi} from '../common/util'

ioContext.create('objDetail', {
  getObjectDetail: {
    url: `${tagApi}/be_tag/tag/pool/obj_detail`,
  },

  // 指标卡
  getDailyCard: {
    url: `${tagApi}/be_tag/pool/obj_target_card`,
    mock: true,
    mockUrl: 'page-hello/getContent',
  },

  // 获取关联对象字段列表
  getObjStorageList: {
    url: `${tagApi}/be_tag/pool/obj_storage_page`,
    mock: true,
    mockUrl: 'page-hello/getContent',
  },

  // 级联选择
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
    url: `${tagApi}/be_tag/pool/add_rel_field`,
    mock: true,
    mockUrl: 'page-hello/getContent',
  },
  updateRelField: {
    method: 'POST',
    url: `${tagApi}/be_tag/pool/update_rel_field`,
    mock: true,
    mockUrl: 'page-hello/getContent',
  },
  
  // 添加对象字段关联关系(关系)
  addRelFieldAss: {
    method: 'POST',
    url: `${tagApi}/be_tag/pool/add_rel_field_ass`,
    mock: true,
    mockUrl: 'page-hello/getContent',
  },
  updateRelFieldAss: {
    method: 'POST',
    url: `${tagApi}/be_tag/pool/update_rel_field_ass`,
    mock: true,
    mockUrl: 'page-hello/getContent',
  },

  
})

export default ioContext.api.objDetail
