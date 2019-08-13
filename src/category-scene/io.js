import ioContext from '../common/io-context'
import {tagApi} from '../common/util'


const isMock = false

ioContext.create('sceneTagCategory', {
  // 获取类目列表
  getCategoryList: {
    url: `${tagApi}/be_tag/occasion/tree/list`,
    mock: isMock,
    mockUrl: 'page-scene/tree-getCategoryList',
  },

  searchCategory: {
    url: `${tagApi}/be_tag/occasion/tree/search`,
    mock: isMock,
    mockUrl: 'page-scene/tree-getCategoryList',
  },

  /**
   * 对象-相关接口 
   */

  // 选择对象-下拉框内容 
  getSelectObj: {
    url: `${tagApi}/be_tag/occasion/selectObj`,
    mock: isMock,
    mockUrl: 'page-scene/tree-getSelectObj',
  },

  // 选择对象-保存
  saveObj: {
    url: `${tagApi}/be_tag/occasion/saveObj`,
    mock: isMock,
    mockUrl: 'page-scene/getContent',
  },
  
  // 对象-移除对象
  deleteObject: {
    url: `${tagApi}/be_tag/occasion/tree/obj/delObj`,
    mock: isMock,
    mockUrl: 'page-scene/getContent',
  },

  /**
   * 类目-相关接口 
   */

  // 类目详情
  getCategoryDetail: {
    url: `${tagApi}/be_tag/occasion/tree/obj/cat/detail`,
    mock: isMock,
    mockUrl: 'page-scene/category-detail',
  },
  
  // 对象-添加类目
  addObjCategory: {
    url: `${tagApi}/be_tag/occasion/tree/obj/addCat`,
    mock: isMock,
    mockUrl: 'page-scene/getContent',
  },

  // 类目-添加类目
  addCategory: {
    url: `${tagApi}/be_tag/occasion/tree/obj/cat/addCat`,
    mock: isMock,
    mockUrl: 'page-scene/getContent',
  },
  
  // 类目-编辑类目
  editCategory: {
    url: `${tagApi}/be_tag/occasion/tree/obj/cat/edit`,
    mock: isMock,
    mockUrl: 'page-scene/getContent',
  },

  // 类目-删除类目
  deleteCategory: {
    url: `${tagApi}/be_tag/occasion/tree/obj/cat/del`,
    mock: isMock,
    mockUrl: 'page-scene/getContent',
  },

  /**
   * 标签-相关接口 
   */

  // 选择标签-树
  selectTag: {
    url: `${tagApi}/be_tag/occasion/tree/obj/cat/selectTag`,
    mock: isMock,
    mockUrl: 'page-scene/tree-selectTag',
  },
  
  // 选择标签-保存
  saveTag: {
    method: 'POST',
    url: `${tagApi}/be_tag/occasion/tree/obj/cat/saveTag`,
    mock: isMock,
    mockUrl: 'page-scene/getContent',
  },  


  /**
   * 以下接口暂未应用
   */
  // 获取标签可移动的标签类目树
  getCanMoveTree: {
    url: `${tagApi}/be_tag/tag/pool/can_move_tree`,
    mock: isMock,
    mockUrl: 'page-hello/getContent',
  },

  // 标签相关接口
  getTagDetail: {
    url: `${tagApi}/be_tag/tag/pool/tag_detail`,
    mock: isMock,
    mockUrl: 'page-hello/getContent',
  },
  addTag: {
    method: 'POST',
    url: `${tagApi}/be_tag/tag/pool/create_tag`,
    mock: isMock,
    mockUrl: 'page-hello/getContent',
  },
  editTag: {
    method: 'POST',
    url: `${tagApi}/be_tag/tag/pool/update_tag`,
    mock: isMock,
    mockUrl: 'page-hello/getContent',
  },
  deleteTag: {
    method: 'POST',
    url: `${tagApi}/be_tag/tag/pool/delete_tag`,
    mock: isMock,
    mockUrl: 'page-hello/getContent',
  },
  moveTag: {
    method: 'POST',
    url: `${tagApi}/be_tag/tag/pool/move_tag`,
    mock: isMock,
    mockUrl: 'page-hello/getContent',
  },


  // 重名校验
  checkIsExist: {
    url: `${tagApi}/be_tag/occasion/check_cat_name`,
    mock: isMock,
    mockUrl: 'page-scene/getContent',
  },

})

export default ioContext.api.sceneTagCategory
