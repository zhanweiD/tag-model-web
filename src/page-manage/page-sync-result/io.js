import ioContext from '../../common/io-context'
import {baseApi, syncApi, get} from '../../common/util'

const api = {
  getList: get(`${syncApi}/scheme/listTagTransferResult`), // 标签同步结果列表
  getObjList: get(`${syncApi}/scheme/underObjList`), // 下拉对象列表
  getStorageList: get(`${baseApi}/project/getProjectDataStorageList`), // 根据项目查询添加数据源
} 

ioContext.create('syncResult', api) 

export default ioContext.api.syncResult
