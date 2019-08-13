import ioContext from '../common/io-context'
import {tagApi} from '../common/util'

const isMock = false

ioContext.create('sceneDetail', {
  
  // 场景详情
  getDetail: {
    mock: isMock,
    mockUrl: 'page-scene/getDetail',
    url: `${tagApi}/be_tag/occasion/detail`,
  },

  // 场景编辑
  editScene: {
    mock: isMock,
    mockUrl: 'page-scene/getContent',
    url: `${tagApi}/be_tag/occasion/edit`,
  },

  // 中文名校验
  checkName: {
    mock: isMock,
    mockUrl: 'page-scene/getContent',
    url: `${tagApi}/be_tag/occasion/check_name`,
  },


  // 标签详情
  getTagDetail: {
    mock: isMock,
    mockUrl: 'page-scene/getTagDetail',
    url: `${tagApi}/be_tag/occasion/tree/obj/cat/tag/detail`,
  },


  // API调用数趋势
  getApiTrend: {
    mock: isMock,
    mockUrl: 'page-scene/getApiTrend',
    url: `${tagApi}/be_tag/occasion/tree/obj/cat/tag/apiCount`,
  },

  // 标签调用次数趋势
  getTagTrend: {
    mock: isMock,
    mockUrl: 'page-scene/getTagTrend',
    url: `${tagApi}/be_tag/occasion/tree/obj/cat/tag/invoke`,
  },

  /**
   * 目的数据源 - 相关接口
   */

  // 数据源数据
  getDBSource: {
    mock: isMock,
    mockUrl: 'page-scene/getDBSource',
    url: `${tagApi}/be_tag/occasion/dbSourceList`,
  },

  // 数据表数据
  getDbTableList: {
    mock: isMock,
    mockUrl: 'page-scene/getDbTableList',
    url: `${tagApi}/be_tag/occasion/dbSourceTableList`,
  },

  // 添加目的数据源 - 列表
  getDBSourceList: {
    mock: isMock,
    mockUrl: 'page-scene/getDBSourceList',
    url: `${tagApi}/be_tag/occasion/beingDBSourceList`,
  },

  // 添加数据源 - 保存
  saveStorage: {
    mock: isMock,
    method: 'POST',
    mockUrl: 'page-scene/getContent',
    url: `${tagApi}/be_tag/occasion/saveStorage`,
  },

  // 目的数据源 - 列表
  getSourceList: {
    mock: isMock,
    mockUrl: 'page-scene/alreadyDBSourceList',
    url: `${tagApi}/be_tag/occasion/alreadyDBSourceList`,
  },
})

export default ioContext.api.sceneDetail
