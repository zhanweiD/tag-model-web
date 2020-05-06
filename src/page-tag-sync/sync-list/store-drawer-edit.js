import {
  action, runInAction, observable,
} from 'mobx'
import {errorTip, listToTree} from '../../common/util'
import io from './io'

class Store {
  projectId
  // 标签树
  @observable treeData = []
  @observable originTreeData = []
  @observable treeLoading = false
  // 标签列表
  @observable tableData = []
  @observable majorTagList = []

  @observable searchKey = undefined
  @observable checkedKeys = []
  @observable checkedTagData = []
  @observable disabledKeys = []

  @action.bound destroy() {
    this.disabledKeys.clear()
    this.checkedTagData.clear()
    this.checkedKeys.clear()
    this.confirmLoading = false
  }

  @action async getTagTree(params) {
    this.treeLoading = true
    try {
      const res = await io.getTagTree({
        projectId: this.projectId,
        ...params,
      })

      runInAction(() => {
        this.originTreeData = res
        this.treeData = listToTree(res)
        if (res.length) {
          const majorTag = res.filter(d => d.isMajor || d.isUsed)
          this.majorTagList.replace(majorTag)
          this.tableData = res.filter(d => d.isUsed).map(d => ({
            ...d,
            columnName: d.enName,
          }))
        }
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.treeLoading = false
      })
    }
  }

  @observable confirmLoading = false
  // 新增同步计划
  @action async editSync(params, cb) {
    this.confirmLoading = true

    try {
      await io.editSync({
        projectId: this.projectId,
        ...params,
      })
      runInAction(() => {
        if (cb) {
          cb()
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
