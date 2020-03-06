import ioContext from '../../common/io-context'
import {tagModalApi, get} from '../../common/util'

const api = {
  getTagDetail: get(`${tagModalApi}/tag_detail`), // 标签详情
  tagLineage: get(`${tagModalApi}/pool/tag_lineage`), // 标签血缘
} 

ioContext.create('tagDetail', api) 

export default ioContext.api.tagDetail
