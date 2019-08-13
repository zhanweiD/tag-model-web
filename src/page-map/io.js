import ioContext from '../common/io-context'
import {tagApi} from '../common/util'

const isMock = false
// const isMock = true

// 拼接接口url的辅助函数，shortPath是短路径
const getUrl = shortPath => `${tagApi}/be_tag/${shortPath}`

// 网关地址87：http://192.168.90.87:9985/gateway/api/detail/be_tag/a926b7a923e2444fb3d8be8e623f7397
ioContext.create('map', {
  /*  标签搜索 */

  // 获取查询条件中对象列表
  getObjList: {
    mock: isMock,
    mockUrl: 'page-map/getObjList',
    url: getUrl('map/listObj'),
    method: 'GET',
    // overrideSelfConcurrent: true,
  },

  // 搜索指定条件下的标签列表
  getTagList: {
    mock: isMock,
    mockUrl: 'page-map/getTagList',
    url: getUrl('map/pageTag'),
    method: 'GET',
    overrideSelfConcurrent: true,
  },

  // 获取场景列表
  getSceneList: {
    mock: isMock,
    mockUrl: 'page-map/getSceneList',
    url: getUrl('occasion/listOcc'),
    method: 'GET',
  },

  // 获取指定场景下的类目列表
  getCateList: {
    mock: isMock,
    mockUrl: 'page-map/getCateList',
    url: getUrl('map/list_occ_cate'),
    method: 'GET',
  },

  // 批量添加标签至场景
  saveTags: {
    mock: isMock,
    mockUrl: 'page-map/postTrue',
    url: getUrl('map/save_tag_occ'),
    method: 'POST',
  },


  /*   标签概览   */

  // 标签概览卡片
  getBasicData: {
    mock: isMock,
    mockUrl: 'page-map/getBasicData',
    url: getUrl('overview/basic_data'),
    method: 'GET',
  },

  // 标签价值、热度、质量分排名
  getScoreRank: {
    mock: isMock,
    mockUrl: 'page-map/getScoreRank',
    url: getUrl('overview/score_sort'),
    method: 'GET',
  },

  // 标签价值、热度、质量分趋势图 (折线图数据)
  getScoreTrend: {
    mock: isMock,
    mockUrl: 'page-map/getScoreTrend',
    url: getUrl('overview/score_trend'),
    method: 'GET',
  },

  // 标签调用占比饼图
  getCallData: {
    mock: isMock,
    mockUrl: 'page-map/getCallData',
    url: getUrl('overview/tag_invoke_percent'),
    method: 'GET',
  },
})

export default ioContext.api.map
