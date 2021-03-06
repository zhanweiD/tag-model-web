import ioContext from '../../../../common/io-context'
import {tagModalApi, baseApi, get, post} from '../../../../common/util'

const api = {
  getTagBaseDetail: get(`${tagModalApi}/tag_detail`), // 标签详情
  // getCardInfo: get('/api/tagapp/1_0_0/third/tag_card'), // 卡片详情
  getCardInfo: get('/api/tagapp/current/third/tag_card'), // 卡片详情
  getCardInfoM: get('api/tagmodel/current/third/tag_card'), // 卡片详情
  getProjectList: get('/api/tagapp/current/third/list_tag_project'), // 项目列表
  backAppltTag: post(`${baseApi}/apply/revoke`), // 交回权限
} 

ioContext.create('tagModelDetail', api) 

export default ioContext.api.tagModelDetail
