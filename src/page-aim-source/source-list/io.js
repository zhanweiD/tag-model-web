import ioContext from '../../common/io-context'
import {baseApi, get} from '../../common/util'

const api = {
  getList: get(`${baseApi}/targetSource/list`), // 数据源列表
} 

ioContext.create('sourceList', api) 

export default ioContext.api.sourceList
