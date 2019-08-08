import ioContext from '../common/io-context'

const isMock = true
ioContext.create('sceneDetail', {
  
  // 场景详情
  getDetail: {
    mock: isMock,
    mockUrl: 'page-scene/getDetail',
    url: 'be_tag/occasion/detail',
  },

  // 标签详情
  getTagDetail: {
    mock: isMock,
    mockUrl: 'page-scene/getTagDetail',
    url: 'be_tag/occasion/tree/obj/cat/tag/detail',
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

  // API调用数趋势
  getApiTrend: {
    mock: isMock,
    mockUrl: 'page-scene/getApiTrend',
    url: 'be_tag/occasion/tree/obj/cat/tag/apiCount',
  },

  // 标签调用次数趋势
  getTagTrend: {
    mock: isMock,
    mockUrl: 'page-scene/getTagTrend',
    url: 'be_tag/occasion/tree/obj/cat/tag/invoke',
  },
})

export default ioContext.api.sceneDetail
