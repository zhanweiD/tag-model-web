import ioContext from '../../../common/io-context'
import {
  tagModalApi, get, post, projectApi,
} from '../../../common/util'

const api = {
  getTagBaseDetail: get(`${tagModalApi}/tag_detail`), // 标签详情
} 

ioContext.create('commonTagDetail', api) 

export default ioContext.api.commonTagDetail
