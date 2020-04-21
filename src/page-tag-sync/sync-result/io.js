import ioContext from '../../common/io-context'
import {baseApi, get} from '../../common/util'

const api = {
  getList: get(`${baseApi}/transfer/schema/getSchemePage`), // 同步计划列表

} 

ioContext.create('syncList', api) 

export default ioContext.api.syncList
