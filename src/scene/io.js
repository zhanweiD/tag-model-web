import ioContext from '../common/io-context'

const isMock = true
ioContext.create('scene', {
  // 场景列表
  getList: {
    mock: isMock,
    mockUrl: 'page-scene/getList',
    url: 'be_tag/asset/occasion/list',
  },

  // 场景详情
  getDetail: {
    mock: isMock,
    mockUrl: 'page-scene/getDetail',
    url: 'be_tag/asset/occasion/detail',
  },

  // 场景新增
  addScene: {
    mock: isMock,
    mockUrl: 'page-scene/getContent',
    url: 'be_tag/asset/occasion/add',
  },

  // 场景删除
  delScene: {
    mock: isMock,
    mockUrl: 'page-scene/getContent',
    url: 'be_tag/asset/occasion/del',
  },

  // 场景编辑
  editScene: {
    mock: isMock,
    mockUrl: 'page-scene/getContent',
    url: 'be_tag/asset/occasion/edit',
  },

  // 中文名校验
  checkName: {
    mock: isMock,
    mockUrl: 'page-scene/getContent',
    url: 'be_tag/asset/occasion/check_name',
  },
})

export default ioContext.api.scene
