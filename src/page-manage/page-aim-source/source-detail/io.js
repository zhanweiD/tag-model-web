import ioContext from '../../../common/io-context'
import {targetSourceApi, get} from '../../../common/util'

const api = {
  getList: get(`${targetSourceApi}/sourceFields`), // 字段列表
  getDetail: get(`${targetSourceApi}/details`), // 目的数据源详情

  getObjList: get(`${targetSourceApi}/relObjByTargetSourceId`), // 对象下拉-字段列表，单个标签映射
  getTagList: get(`${targetSourceApi}/objTags`), // 标签下拉-字段列表，单个标签映射

  configTag: get(`${targetSourceApi}/mapping`), // 单个字段标签映射
  cancelConfig: get(`${targetSourceApi}/unmapping`), // 单个字段标签解除映射
}

ioContext.create('sourceDetail', api) 

export default ioContext.api.sourceDetail
