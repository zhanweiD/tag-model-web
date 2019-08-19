import ioContext from '../common/io-context'
import {tagApi} from '../common/util'

const isMock = false

ioContext.create('scene', {
  // 场景列表
  getList: {
    mock: isMock,
    mockUrl: 'page-scene/getList',
    url: `${tagApi}/be_tag/occasion/listOcc`,
  },

  // 场景详情
  getDetail: {
    mock: isMock,
    mockUrl: 'page-scene/getDetail',
    url: `${tagApi}/be_tag/occasion/detail`,
  },

  // 场景新增
  addScene: {
    mock: isMock,
    mockUrl: 'page-scene/getContent',
    url: `${tagApi}/be_tag/occasion/add`,
  },

  // 场景删除
  delScene: {
    mock: isMock,
    mockUrl: 'page-scene/getContent',
    url: `${tagApi}/be_tag/occasion/del`,
  },

  // 场景编辑
  editScene: {
    mock: isMock,
    mockUrl: 'page-scene/getContent',
    url: `${tagApi}/be_tag/occasion/edit`,
  },

  // 名称校验
  checkName: {
    mock: isMock,
    mockUrl: 'page-scene/getContent',
    url: `${tagApi}/be_tag/occasion/check_name`,
  },
})

export default ioContext.api.scene
