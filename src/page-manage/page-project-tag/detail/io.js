import ioContext from '../../../common/io-context'
import {
  tagModalApi, get, post, projectApi,
} from '../../../common/util'

const api = {
  getTagBaseDetail: get(`${tagModalApi}/tag_detail`), // 标签详情
  getCardInfo: get('/api/tagapp/current/third/tag_card'), // 卡片详情
  getCardInfoM: get('api/tagmodel/current/third/tag_card'), // 卡片详情
  getAppList: get('/api/tagapp/current/third/list_tag_app'), // 应用列表
  getSourceList: get(`${tagModalApi}/list_target_source`), // 目的源列表
} 

ioContext.create('tagWarehouseDetail', api) 

export default ioContext.api.tagWarehouseDetail
