import {
  observable, action, runInAction,
} from 'mobx'
import {
  successTip, failureTip, errorTip, changeToOptions, listToTree,
} from '../common/util'
import {ListContentStore} from '../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getList) {
  @observable projectId
  @observable useProjectId
  @observable projectName


  // @observable expand = false 
  @observable permissionType = '' // 使用权限状态
  @observable ownProjectId = '' // 所属项目id
  @observable objectId = '' // 对象id
  @observable hotWord = undefined // 关键词

  
  @observable ownProjectList = []
  @observable objectList = []
  @observable sceneList = []
  @observable sceneCate = []
  @observable selectItem = {}
  @observable sceneType = undefined

  @observable modalApplyVisible = false
  @observable modalSceneVisible = false
  @observable confirmLoading = false
  @observable tagIds = []
  // @observable occTags = []

  @observable selectedRows = []
  @observable rowKeys = []

  @action async getOwnProject() {
    try {
      const res = await io.getOwnProject()
      runInAction(() => {
        this.ownProjectList = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async getObject() {
    try {
      const res = await io.getObject({
        projectId: this.useProjectId,
      })
      runInAction(() => {
        this.objectList = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async getSceneList(params) {
    try {
      const res = await io.getSceneList({
        objId: this.objectId,
        projectId: this.useProjectId,
        ...params,
      })
      runInAction(() => {
        this.sceneList = changeToOptions(res)('name', 'id')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async getSceneCate(params) {
    try {
      const res = await io.getSceneCate({
        objId: this.objectId || this.selectItem.objId,
        ...params,
      })
      runInAction(() => {
        this.sceneCate = listToTree(res)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async applyTag(params, cb) {
    this.confirmLoading = true
    try {
      const res = await io.applyTag(params)
      runInAction(() => {
        if (res) {
          successTip('操作成功')
          if (cb) cb()
          this.getList()
          this.selectedRows.clear()
          this.rowKeys.clear()
        } 
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.confirmLoading = false
      })
    }
  }

  @action async addToScene(params, cb) {
    this.confirmLoading = true
    try {
      const res = await io.addToScene({
        projectId: this.useProjectId,
        ...params,
      })
      runInAction(() => {
        if (res.success) {
          successTip('操作成功')
          if (cb) cb()
        } else {
          failureTip('操作失败')
        }
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.confirmLoading = false
      })
    }
  }

  @action async getProjectDetail() {
    try {
      const res = await io.getProjectDetail({
        id: this.useProjectId,
      })
      runInAction(() => {
        this.projectName = res.name
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
        projectId: this.useProjectId,
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
