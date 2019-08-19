import {
  observable, action, runInAction,
} from 'mobx'
import {successTip, errorTip} from '../common/util'
import io from './io'


class SceneDetailStore {
  // 场景id
  @observable sceneId = undefined

  @observable loading = false

  // 场景基本信息
  @observable info = {}

  // 场景详情编辑弹窗标识
  @observable modalVisible = false

  // 添加目的数据源弹窗标识
  @observable dbSourceVisible = false

  // 数据源(下拉框)
  @observable dbSource = []

  // 数据表(下拉框)
  @observable dbTable = []

  // 添加目的数据源 - 列表
  @observable dbSourceData = {
    data: [],
    locading: false,
  }

  // 目的数据源 - 列表
  @observable sourceData = {
    data: [],
    loading: false,
  }

  // 场景详情
  @action async getDetail() {
    this.loading = true
    try {
      const res = await io.getDetail({
        occasionId: this.sceneId,
      })

      runInAction(() => {
        this.info = res
        this.loading = false
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 场景编辑
  @action async editScene(params) {
    try {
      await io.editScene(params)

      runInAction(() => {
        this.modalVisible = false
        successTip('编辑成功')
        this.getDetail()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 名称校验
  @action async checkName(name, cb) {
    try {
      await io.checkName({
        name,
      })

      runInAction(() => {
        if (cb) cb()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * 目的数据源相关
   */
  
  // 数据源数据
  @action async getDBSource() {
    try {
      const res = await io.getDBSource({
        occasionId: this.sceneId,
      })

      runInAction(() => {
        this.dbSource.replace(res)
        this.dbSourceVisible = true
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

    // 数据表数据
    @action async getDbTableList(storageId) {
    try {
      const res = await io.getDbTableList({
        occasionId: this.sceneId,
        storageId,
      })
  
      runInAction(() => {
        this.dbTable.replace(res)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 添加目的数据源 - 列表
  @action async getDBSourceList(params) {
      this.dbSourceData.loading = true
      try {
        const res = await io.getDBSourceList({
          occasionId: this.sceneId,
          ...params,
        }) || []

        runInAction(() => {
          this.dbSourceData.data = res.details.map(item => ({
            fileds: res.fileds || [],
            ...item,
          }))
          this.dbSourceData.loading = false
        })
      } catch (e) {
        errorTip(e.message)
        runInAction(() => {
          this.dbSourceData.loading = false
        })
      }
    }

  // 目的数据源 - 保存
  @action async saveStorage(params, cb) {
    try {
      await io.saveStorage({
        occasionId: this.sceneId,
        ...params,
      })

      runInAction(() => {
        this.dbSourceVisible = false
        successTip('操作成功')
        if (cb)cb()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 目的数据源 - 列表
  @action async getSourceList() {
    this.sourceData.loading = true
    try {
      const res = await io.getSourceList({
        occasionId: this.sceneId,
      })

      runInAction(() => {
        this.sourceData.data.replace(res)
        this.sourceData.loading = false
      })
    } catch (e) {
      errorTip(e.message)
      runInAction(() => {
        this.sourceData.loading = false
      })
    }
  }
}

export default new SceneDetailStore()
