import ioContext from '../../common/io-context'
import {projectApi, get} from '../../common/util'

const api = {
  getList: get(`${projectApi}/list`), // 数据源列表

} 

ioContext.create('sourceList', api) 

export default ioContext.api.sourceList
