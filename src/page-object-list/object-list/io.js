import ioContext from '../../common/io-context'
import {
  objectApi, tagClassApi, get, post,
} from '../../common/util'

// const isMock = true

const api = {
  getList: get(`${objectApi}/obj_Page`), // 对象列表
  getObjCate: get(`${objectApi}/list_obj_cate`), // 对象类目

  //* ------------------------------ 标签类目 ------------------------------*//
  getTagCateTree: get(`${tagClassApi}/cate_tree`, {overrideSelfConcurrent: true}), // 标签类目树
  checkTagCateName: post(`${tagClassApi}/name_check`, {overrideSelfConcurrent: true}), // 标签类目-重名校验
  addTagCate: post(`${tagClassApi}/create_cate`), // 添加标签类目
  editTagCate: post(`${tagClassApi}/update_cate`), // 修改标签类目
  delTagCate: post(`${tagClassApi}/delete_cate`), // 删除标签类目
  getTagCateDetail: get(`${tagClassApi}/cate_detail`), // 对象基础信息
  getTagList: get(`${tagClassApi}/list_tag`, {overrideSelfConcurrent: true}), // 标签列表
  moveTag: post(`${tagClassApi}/move_tag`), // 标签移动
} 

ioContext.create('objectList', api) 

export default ioContext.api.objectList
