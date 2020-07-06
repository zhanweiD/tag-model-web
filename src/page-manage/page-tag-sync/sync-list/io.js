import ioContext from '../../../common/io-context'
import {baseApi, syncApi, get, post} from '../../../common/util'

const api = {
  getList: get(`${syncApi}/scheme/getSchemePage`), // 同步计划列表
  delList: post(`${syncApi}/scheme/schemeDelete`), // 删除同步计划
  getObjList: get(`${syncApi}/scheme/underObjList`), // 下拉对象列表
  startSync: post(`${syncApi}/scheme/startScheme`), // 启动
  pauseSync: post(`${syncApi}/scheme/pauseScheme`), // 暂停
  runSync: post(`${syncApi}/scheme/manualRunScheme`), // 执行
  getLog: get(`${syncApi}/scheme/submitLog`), // 提交日志

  // 添加同步
  getStorageType: get(`${syncApi}/scheme/dataStorageType`), // 下拉数据源类型列表
  getStorageList: get(`${syncApi}/scheme/storageList`), // 下拉数据源列表
  getStorageDetail: get(`${baseApi}/project/storageDetails`), // 数据源详情
  checkName: post(`${syncApi}/scheme/checkName`), // 重名校验

  getTagTree: get(`${syncApi}/scheme/tagTree`), // 标签树
  addSync: post(`${syncApi}/scheme/schemeSave`), // 新增同步计划
  editSync: post(`${syncApi}/scheme/schemeUpdate`), // 编辑同步计划
} 

ioContext.create('syncList', api) 

export default ioContext.api.syncList
