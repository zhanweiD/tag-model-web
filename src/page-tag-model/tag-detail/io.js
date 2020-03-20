import ioContext from '../../common/io-context'
import {tagModalApi, get, baseApi} from '../../common/util'

const api = {
  getTagDetail: get(`${tagModalApi}/pool/tag_detail`), // 标签详情
  tagLineage: get(`${baseApi}/score/tag_lineage`), // 标签血缘
} 

ioContext.create('tagDetail', api) 

export default ioContext.api.tagDetail
