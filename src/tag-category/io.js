import ioContext from '../common/io-context'
import {tagApi} from '../common/util'


ioContext.create('tagCategory', {
  // 获取类目列表
  getCategoryList: {
    url: `${tagApi}/be_tag/tag/pool/tag_cate_tree`,
  },

  // 获取关联的对象(对象关系)
  getRelObj: {
    url: `${tagApi}/be_tag/tag/pool/get_rel_obj`,
  },

  // 获取标签可移动的标签类目树
  getCanMoveTree: {
    url: `${tagApi}/be_tag/tag/pool/can_move_tree`,
  },

  // 重名校验
  checkIsExist: {
    url: `${tagApi}/be_tag/tag/pool/name_check`,
  },

  // 对象相关接口
  getObjectDetail: {
    url: `${tagApi}/be_tag/tag/pool/obj_detail`,
  },
  addObject: {
    method: 'POST',
    url: `${tagApi}/be_tag/tag/pool/add_obj`,
  },
  editObject: {
    method: 'POST',
    url: `${tagApi}/be_tag/tag/pool/update_obj`,
  },
  deleteObject: {
    method: 'POST',
    url: `${tagApi}/be_tag/tag/pool/delete_obj`,
  },


  // 类目相关接口
  getCategoryDetail: {
    url: `${tagApi}/be_tag/tag/pool/cate_detail`,
  },
  addCategory: {
    method: 'POST',
    url: `${tagApi}/be_tag/tag/pool/create_cate`,
  },
  editCategory: {
    method: 'POST',
    url: `${tagApi}/be_tag/tag/pool/update_cate`,
  },
  deleteCategory: {
    method: 'POST',
    url: `${tagApi}/be_tag/tag/pool/delete_cate`,
  },

  // 标签相关接口
  getTagDetail: {
    url: `${tagApi}/be_tag/tag/pool/tag_detail`,
  },
  addTag: {
    method: 'POST',
    url: `${tagApi}/be_tag/tag/pool/create_tag`,
    // mock: true,
    // mockUrl: 'page-hello/getContent',
  },
  editTag: {
    method: 'POST',
    url: `${tagApi}/be_tag/tag/pool/update_tag`,
    // mock: true,
    // mockUrl: 'page-hello/getContent',
  },
  deleteTag: {
    method: 'POST',
    url: `${tagApi}/be_tag/tag/pool/delete_tag`,
  },
  moveTag: {
    method: 'POST',
    url: `${tagApi}/be_tag/tag/pool/move_tag`,
    // mock: true,
    // mockUrl: 'page-hello/getContent',
  },
})

export default ioContext.api.tagCategory
