import ioContext from '../../../../common/io-context'
import {tagModalApi, get} from '../../../../common/util'

const api = {
  getTagBaseDetail: get(`${tagModalApi}/tag_detail`), // 标签详情
  // getCardInfo: get('/api/tagapp/1_0_0/third/tag_card'), // 卡片详情
  getCardInfo: get('/api/tagapp/1_0_0/third/tag_card'), // 卡片详情
  getCardInfoM: get('api/tagmodel/1_0_0/third/tag_card'), // 卡片详情
  getProjectList: get('/api/tagapp/1_0_0/third/list_tag_project'), // 项目列表
} 

ioContext.create('tagModelDetail', api) 

export default ioContext.api.tagModelDetail
