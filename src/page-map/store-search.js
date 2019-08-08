import {observable, action} from 'mobx'
import {errorTip, successTip} from '../common/util'
import io from './io'

/**
 * @description 标签搜索的数据管理
 * @author 三千
 * @date 2019-08-08
 * @class SearchStore
 */
class SearchStore {
  /* -------------  UI状态相关 --------- */

  // 标签列表加载中
  @observable loading = false

  // 批量添加至场景弹框展示
  @observable modalVisible = false

  /* -------------  搜索相关 --------- */

  // 所属类目的对象列表
  @observable objList = []

  // 标签关键词
  @observable filterKeyword = undefined

  // 选中的所属类目
  @observable filterObjId = undefined

  // 价值分
  @observable filterWorth = {
    min: undefined,
    max: undefined,
  }

  // 质量分
  @observable filterQuality = {
    min: undefined,
    max: undefined,
  }

  // 热度
  @observable filterHot = {
    min: undefined,
    max: undefined,
  }

  /* -------------  排序相关 --------- */

  // 排序的列名
  @observable sortKey = undefined

  // 排序的方式
  @observable sortOrder = undefined // asc | desc | 空

  /* -------------  表格相关 --------- */

  // 标签列表数据
  @observable tagList = []

  // 当前页码
  @observable currentPage = 1

  // 页面总数
  @observable totalCount = 1

  // 一页数量
  @observable pageSize = 10


  /* -------------  批量添加至场景相关 --------- */

  // 选中的标签
  @observable selectedTags = []

  // 场景列表
  @observable sceneList = []

  // 选中的场景
  @observable selectedSceneId = undefined

  // 某个场景的类目列表
  @observable cateList = []

  // 选中的类目
  @observable selectedCateId = undefined


  /* ----------- actions 接口请求直接相关 --------- */

  // 请求对象列表（所属类目）
  @action async getObjList() {
    try {
      const res = await io.getObjList()
      console.log('getObjList', res)
      this.objList = res
    } catch (err) {
      errorTip(err.message)
    }
  }

  // 请求标签列表
  @action async getTagList() {
    const {
      filterObjId,
      filterKeyword, 
      filterWorth, filterQuality, filterHot, 
      sortKey, sortOrder,
      currentPage, pageSize,
    } = this

    try {
      this.loading = true
      const res = await io.getTagList({
        objId: filterObjId,
        keyword: (filterKeyword || '').trim(),
        worthStart: filterWorth.min,
        worthEnd: filterWorth.max,
        qualityStart: filterQuality.min,
        qualityEnd: filterQuality.max,
        hotStart: filterHot.min,
        hotEnd: filterHot.max,
        sort: sortKey,
        order: sortOrder,
        currentPage,
        pageSize,
      })

      this.tagList = res.data
      this.currentPage = res.currentPage
      this.totalCount = res.totalCount
      this.pageSize = res.pageSize

      console.log('getTagList', res)
    } catch (err) {
      errorTip(err.message)
    } finally {
      this.loading = false
    }
  }

  // 请求场景列表
  @action async getSceneList() {
    try {
      const res = await io.getSceneList()
      this.sceneList = res
    } catch (err) {
      errorTip(err.message)
    }
  }

  // 请求某个场景的类目
  @action async getCateList() {
    try {
      const res = await io.getCateList({
        occasionId: this.selectedSceneId,
      })
      this.cateList = res
    } catch (err) {
      errorTip(err.message)
    }
  }

  // 批量添加至场景
  @action async saveTags(cb) {
    try {
      const res = await io.saveTags({
        // TODO:
        occTags: [],
        // Long occasionId;//场景id

        // Long objId;//对象id

        // Long catId;//类目id

        // Long tagId;//标签id
      })
      successTip('批量添加成功')
      cb && cb()
    } catch (err) {
      errorTip(err.message)
    }
  }

  /* -----------  交互操作 --------- */

  // 弹框切换
  @action.bound toggleModal(visible = false) {
    this.modalVisible = visible
    console.log('toggleModal', visible)
  }

  // 表格切页、排序
  @action.bound onTableChange() {

  }
}

export default new SearchStore()
