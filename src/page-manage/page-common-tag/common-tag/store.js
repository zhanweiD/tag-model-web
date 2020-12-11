import {
  observable, action, runInAction,
} from 'mobx'
import {successTip, errorTip} from '../../../common/util'
import {ListContentStore} from '../../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getList) {
  @observable isProject = true
  @observable useProjectList = []
  @observable ownProjectList = []
  @observable objectList = []

  @observable modalVisible = false
  @observable confirmLoading = false
  @observable tagIds = []
  @observable modalType = undefined
  @observable selectItem = {}

  // @observable expand = false
  @observable useProjectId = '' // 使用项目id; 只有选择了使用项目;标签列表才会出现checkbox框 进行批量操作
  @observable useProjectName = '' // 使用项目id; 只有选择了使用项目;标签列表才会出现checkbox框 进行批量操作

  @observable projectPermission = 2 // 项目使用权限
  @observable ownProjectId = '' // 所属项目id
  @observable objectId = '' // 对象id
  @observable hotWord = undefined // 关键词

  @observable selectedRows = []
  @observable rowKeys = []


  @action.bound initData() {
    this.projectPermission = 2
    this.ownProjectId = ''
    this.objectId = ''
    this.useProjectId = ''
  }


  // 项目列表
  @action async getProjects(cb) {
    try {
      const res = await io.getProjects({})
      this.isProject = res.length > 0
      runInAction(() => {
        cb(this.isProject)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 更新列表
  @action.bound updateList() {
    this.searchParams = {
      hotWord: this.hotWord,
      useProjectId: this.useProjectId,
      projectId: this.ownProjectId,
      objId: this.objectId,
      type: this.projectPermission,
    }

    this.selectedRows.clear()
    this.rowKeys.clear()
    this.tagIds.clear()

    const params = {
      currentPage: 1,
    }
    this.getList(params)
  }

  @action async getUseProject() {
    try {
      const res = await io.getUseProject({
        projectId: this.useProjectId,
      })
      runInAction(() => {
        this.useProjectList = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async getOwnProject() {
    try {
      const res = await io.getOwnProject({
        projectId: this.useProjectId,
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
          this.updateList()
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
}

export default new Store()
