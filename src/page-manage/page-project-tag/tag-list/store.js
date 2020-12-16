import {
  observable, action, runInAction,
} from 'mobx'
import {
  successTip, errorTip,
} from '../../../common/util'
import {ListContentStore} from '../../../component/list-content'
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
  @observable selectItem = {}
  @observable sceneType = undefined

  @observable modalApplyVisible = false
  @observable modalBackVisible = false
  @observable confirmLoading = false
  @observable tagIds = []
  @observable tagId = ''

  @action async getOwnProject() {
    try {
      const res = await io.getOwnProject({
        projectId: this.projectId,
      })
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

  @action async applyTag(params, cb) {
    this.confirmLoading = true
    try {
      const res = await io.applyTag({
        projectId: this.useProjectId,
        ...params,
      })
      runInAction(() => {
        if (res) {
          successTip('操作成功')
          if (cb) cb()
          this.getList()
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

  @action async backAppltTag(cb) {
    console.log(cb)
    this.confirmLoading = true
    try {
      const res = await io.backAppltTag({
        projectId: this.useProjectId,
        tagId: this.tagId,
      })
      runInAction(() => {
        if (res) {
          successTip('操作成功')
          if (cb) cb()
          this.getList()
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
        projectId: this.useProjectId,
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
