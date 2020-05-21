import ioContext from '../../common/io-context'
import {derivativeApi, syncApi, get, post} from '../../common/util'

const api = {
  getList: post(`${derivativeApi}/scheme/derivative_tag_list`), // 衍生标签列表
  getObjList: get(`${syncApi}/scheme/underObjList`), // 下拉对象列表
  getSchemeList: get(`${derivativeApi}/scheme/derivative_scheme_list`), // 获取方案下拉框
} 

ioContext.create('visualTagList', api) 

export default ioContext.api.visualTagList
