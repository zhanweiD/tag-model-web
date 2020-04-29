import ioContext from '../../common/io-context'
import {baseApi, get} from '../../common/util'

const api = {
  getList: get(`${baseApi}/transfer/scheme/listTagTransferResult`), // 标签同步结果列表

} 

ioContext.create('syncList', api) 

export default ioContext.api.syncList
