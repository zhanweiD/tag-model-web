import ioContext from '../../../common/io-context'
import {
  tagModalApi, get, post, projectApi,
} from '../../../common/util'

const api = {
  getTagBaseDetail: get(`${tagModalApi}/tag_detail`), // 标签详情
  getStorageList: get(`${projectApi}/list`), // 项目列表
} 

ioContext.create('tagModelDetail', api) 

export default ioContext.api.tagModelDetail
