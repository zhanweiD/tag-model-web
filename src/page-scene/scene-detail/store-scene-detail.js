import {
  observable, action, runInAction,
} from 'mobx'
import {successTip, errorTip} from '../../common/util'
import io from './io'


class SceneDetailStore {
  projectId // 项目id
  currentKey = '1'
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
  @observable dbSourceLoading = false

  // 数据表(下拉框)
  @observable dbTable = []
  @observable dbTableLoading = false

  // 确认按钮loading
  @observable confirmLoading = false

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

  @observable isDbSourcEnough = false

  @observable dbSourcSelectList = []

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
    this.confirmLoading = true

    try {
      await io.editScene(params)

      runInAction(() => {
        this.modalVisible = false
        this.confirmLoading = false
        successTip('编辑成功')
        this.getDetail()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 名称校验
  @action async checkName(params, cb) {
    try {
      const res = await io.checkName(params)

      runInAction(() => {
        if (cb) cb(res)
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
    this.dbSourceLoading = true
    try {
      const res = await io.getDBSource({
        occasionId: this.sceneId,
      })

      runInAction(() => {
        this.dbSource.replace(res)
        this.dbSourceLoading = false
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 数据表数据
  @action async getDbTableList(storageId) {
    this.dbTableLoading = true
    try {
      const res = await io.getDbTableList({
        occasionId: this.sceneId,
        storageId,
      })

      runInAction(() => {
        this.dbTable.replace(res)
        this.dbTableLoading = false
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
          fields: res.fields || [],
          ...item,
        }))
        this.dbSourceData.loading = false
      })
    } catch (e) {
      runInAction(() => {
        this.dbSourceVisible = false
      })
      errorTip(e.message)
    }
  }

  // 目的数据源 - 保存
  @action async saveStorage(params, cb) {
    this.confirmLoading = true
    try {
      await io.saveStorage({
        occasionId: this.sceneId,
        ...params,
      })

      runInAction(() => {
        this.confirmLoading = false
        this.dbSourceVisible = false
        if (cb) cb()
        this.getSourceList()
        successTip('操作成功')
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
        this.dbSourcSelectList = res.map(() => false)

        this.sourceData.loading = false
        if (res.length === 10) this.isDbSourcEnough = true
      })
    } catch (e) {
      runInAction(() => {
        this.sourceData.loading = false
      })
      errorTip(e.message)
    }
  }

  // 目的数据源 - 列表 - 删除
  @action async dbSourceDel(params) {
    try {
      await io.dbSourceDel({
        occasionId: this.sceneId,
        ...params,
      })

      runInAction(() => {
        this.getSourceList()
        successTip('删除成功')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new SceneDetailStore()
