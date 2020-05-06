import {
  observable, action, runInAction,
} from 'mobx'
import {successTip, errorTip, changeToOptions} from '../../common/util'
import io from './io'


class Store {
  projectId // 项目ID

  @observable loading = false

  // 场景列表
  @observable list = []

  // 场景详情
  @observable info = {}

  // 弹窗标识 
  @observable modalVisible = false

  // 弹窗编辑／新增 判断标识
  @observable isEdit = false

  // 确认loading
  @observable confirmLoading = false

  // 场景详情
  @action async getDetail(params) {
    try {
      const res = await io.getDetail({
        ...params,
      })

      runInAction(() => {
        this.info = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }


  // 场景列表
  @action async getList() {
    this.loading = true
    try {
      const res = await io.getList({
        projectId: this.projectId,
      })

      runInAction(() => {
        this.loading = false
        this.list.replace(res)
      })
    } catch (e) {
      runInAction(() => {
        this.loading = false
      })
      errorTip(e.message)
    }
  }

  @observable storageTypeLoading = false
  @observable storageSelectLoading = false
  @observable storageType = [] // 数据源类型下拉
  @observable storageSelectList = [] // 数据源下拉
  @observable objList = [] // 对象下拉

  // 数据源类型下拉
  @action async getStorageType() {
    this.storageTypeLoading = true

    try {
      const res = await io.getStorageType()
      runInAction(() => {
        this.storageType = changeToOptions(res)('name', 'type')
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.storageTypeLoading = false
      })
    }
  }

  // 数据源下拉
  @action async getStorageList(params) {
    this.storageSelectLoading = true
    try {
      const res = await io.getStorageList({
        id: this.projectId,
        ...params,
      })
      runInAction(() => {
        this.storageSelectList = changeToOptions(res)('dataDbName', 'dataStorageId')
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.storageSelectLoading = false
      })
    }
  }

  // 对象下拉
  @action async getObjList(params) {
    try {
      const res = await io.getObjList({
        projectId: this.projectId,
        ...params,
      })
      runInAction(() => {
        this.objList = changeToOptions(res)('objName', 'objId')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 场景新增
  @action async addScene(params) {
    this.confirmLoading = true
    try {
      await io.addScene({
        projectId: this.projectId,
        ...params,
      })

      runInAction(() => {
        this.confirmLoading = false
        this.modalVisible = false
        this.getList()
        successTip('添加成功')
      })
    } catch (e) {
      errorTip(e.message)
      runInAction(() => {
        this.confirmLoading = false
        this.modalVisible = false
      })
    }
  }

  // 场景删除
  @action async delScene(id) {
    try {
      await io.delScene({
        occasionId: id,
      })

      runInAction(() => {
        this.getList()
        successTip('删除成功')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 场景编辑
  @action async editScene(params) {
    this.confirmLoading = true
    try {
      await io.editScene({
        projectId: this.projectId,
        ...params,
      })

      runInAction(() => {
        this.getList()
        successTip('编辑成功')
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.confirmLoading = false
        this.modalVisible = false
      })
    }
  }

  // 名称校验
  @action async checkName(params, cb) {
    try {
      const res = await io.checkName(params)
      runInAction(() => {
        if (typeof res === 'boolean' && res) {
          cb()
        } else {
          cb('名称已存在')
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable functionCodes = []

  /**
   * @description 权限code
   */
  @action async getAuthCode() {
    try {
      const res = await io.getAuthCode({
        projectId: this.projectId,
      })
      runInAction(() => {
        this.functionCodes = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
