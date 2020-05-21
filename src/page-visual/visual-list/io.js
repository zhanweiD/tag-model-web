import ioContext from '../../common/io-context'
import {derivativeApi, syncApi, get, post} from '../../common/util'

const api = {
  getList: get(`${derivativeApi}/scheme/visual_scheme_page`), // 可视化方案列表
  delList: post(`${derivativeApi}/schema/delete_scheme`), // 删除方案
  getObjList: get(`${syncApi}/scheme/underObjList`), // 下拉对象列表
  runVisual: post(`${derivativeApi}/scheme/manualRunScheme`), // 执行
  getLog: get(`${derivativeApi}/schema/submit_log`), // 提交日志
  cloneVisual: post(`${derivativeApi}/schema/clone_scheme`), // 克隆方案
} 

ioContext.create('visualList', api) 

export default ioContext.api.visualList
