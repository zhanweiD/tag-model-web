import ioContext from '../../common/io-context'
import {tagManagementApi, get} from '../../common/util'

const api = {
  getTagDetail: get(`${tagManagementApi}/tag_detail`), // 标签详情
  tagLineage: get(`${tagManagementApi}/pool/tag_lineage`), // 标签血缘
} 

ioContext.create('overview', api) 

export default ioContext.api.overview
