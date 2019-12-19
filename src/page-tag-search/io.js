import ioContext from '../common/io-context'
import {
  tagSearchApi, marketApi, projectApi, get, post,
} from '../common/util'

const api = {
  getList: get(`${tagSearchApi}/pageTag`), // 标签搜索列表
  getOwnProject: get(`${marketApi}/ownProject`), // 所属项目
  getObject: get(`${tagSearchApi}/list_search_obj`), // 对象
  getSceneList: get(`${tagSearchApi}/listOcc`), // 场景列表
  addToScene: post(`${tagSearchApi}/save_tag_occ`), // 批量添加标签至场景
  applyTag: post(`${marketApi}/tagApply`), // 标签申请
  getProjectDetail: get(`${projectApi}/details`), // 项目详情
} 

ioContext.create('tagSearch', api) 

export default ioContext.api.tagSearch
