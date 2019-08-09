import ioContext from '../common/io-context'

ioContext.create('tagCategory', {
  // 获取类目列表
  getCategoryList: {
    url: 'be_tag/tag/pool/tag_cate_tree',
    // mock: true,
    // mockUrl: 'page-hello/getContent',
  },

  // 获取关联的对象(对象关系)
  getRelObj: {
    url: 'be_tag/tag/pool/get_rel_obj',
    mock: true,
    mockUrl: 'page-hello/getContent',
  },

  // 获取标签可移动的标签类目树
  getCanMoveTree: {
    url: 'be_tag/tag/pool/can_move_tree',
    mock: true,
    mockUrl: 'page-hello/getContent',
  },

  // 重名校验
  checkIsExist: {
    url: 'be_tag/tag/pool/name_check',
  },

  // 对象相关接口
  getObjectDetail: {
    url: 'be_tag/tag/pool/obj_detail',
  },
  addObject: {
    method: 'POST',
    url: 'be_tag/tag/pool/add_obj',
  },
  editObject: {
    method: 'POST',
    url: 'be_tag/tag/pool/update_obj',
  },
  deleteObject: {
    method: 'POST',
    url: 'be_tag/tag/pool/delete_obj',
  },


  // 类目相关接口
  getCategoryDetail: {
    url: 'be_tag/tag/pool/cate_detail',
    // mock: true,
    // mockUrl: 'page-hello/getContent',
  },
  addCategory: {
    method: 'POST',
    url: 'be_tag/tag/pool/create_cate',
    // mock: true,
    // mockUrl: 'page-hello/getContent',
  },
  editCategory: {
    method: 'POST',
    url: 'be_tag/tag/pool/update_cate',
    // mock: true,
    // mockUrl: 'page-hello/getContent',
  },
  deleteCategory: {
    method: 'POST',
    url: 'be_tag/tag/pool/delete_cate',
  },

  // 标签相关接口
  getTagDetail: {
    url: 'be_tag/tag/pool/tag_detail',
    mock: true,
    mockUrl: 'page-hello/getContent',
  },
  addTag: {
    method: 'POST',
    url: 'be_tag/tag/pool/create_tag',
    mock: true,
    mockUrl: 'page-hello/getContent',
  },
  editTag: {
    method: 'POST',
    url: 'be_tag/tag/pool/update_tag',
    mock: true,
    mockUrl: 'page-hello/getContent',
  },
  deleteTag: {
    method: 'POST',
    url: 'be_tag/tag/pool/delete_tag',
  },
  moveTag: {
    method: 'POST',
    url: 'be_tag/tag/pool/move_tag',
    mock: true,
    mockUrl: 'page-hello/getContent',
  },
})

export default ioContext.api.tagCategory
