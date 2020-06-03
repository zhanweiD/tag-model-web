import ioContext from '../../common/io-context'
import {baseApi, get} from '../../common/util'

const api = {
  tagLineage: get(`${baseApi}/score/tag_lineage`), // 标签血缘
} 

ioContext.create('tagLineage', api) 

export default ioContext.api.tagLineage
