import ioContext from '../common/io-context'
import {marketApi, get, post} from '../common/util'

const api = {
  getList: get(`${marketApi}/tagList`), // 标签列表
  getUseProject: get(`${marketApi}/useProject`), // 使用项目
  getOwnProject: get(`${marketApi}/ownProject`), // 所属项目
  getObject: get(`${marketApi}/publishedObjs`), // 对象
  applyTag: post(`${marketApi}/tagApply`), // 标签申请
} 

ioContext.create('market', api) 

export default ioContext.api.market
