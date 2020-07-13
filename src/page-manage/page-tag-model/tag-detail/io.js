import ioContext from '../../../common/io-context'
import {tagModalApi, get} from '../../../common/util'

const api = {
  getTagBaseDetail: get(`${tagModalApi}/tag_detail`), // 标签详情
  getCardInfo: get(`${tagModalApi}/tag_card`), // 卡片详情
  getProjectList: get(`${tagModalApi}/list_tag_project`), // 项目列表
} 

ioContext.create('tagModelDetail', api) 

export default ioContext.api.tagModelDetail
