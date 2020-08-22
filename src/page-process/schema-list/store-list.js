import {
  action, runInAction, observable,
} from 'mobx'
import {
  successTip, failureTip, errorTip, changeToOptions,
} from '../../common/util'
import {ListContentStore} from '../../component/list-content'
import io from './io'

export default class Store extends ListContentStore(io.getList) {
  constructor(rootStore) {
    super(rootStore)
    this.rootStore = rootStore
  }

  projectId
  @observable objList = []

  /**
   * @description 获取 对象下拉数据
   */
  @action async getObjList() {
    try {
      const res = await io.getObjList({
        projectId: this.projectId,
      })
      runInAction(() => {
        this.objList = changeToOptions(res)('name', 'objId')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 提交方案
  @action async submitScheme(params) {
    try {
      const res = await io.submitScheme({
        projectId: this.projectId,
        ...params,
      })
      runInAction(() => {
        if (res) {
          successTip('提交成功')
          this.getList()
        } else {
          failureTip('提交失败')
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 执行方案
  @action async operationScheme(params) {
    try {
      const res = await io.manualRunScheme({
        projectId: this.projectId,
        ...params,
      })
      runInAction(() => {
        if (res) {
          successTip('操作成功')
          this.getList()
        } else {
          failureTip('操作失败')
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 克隆方案
  @action async cloneScheme(params) {
    try {
      const res = await io.cloneScheme({
        projectId: this.projectId,
        ...params,
      })
      runInAction(() => {
        if (res.success) {
          successTip('克隆成功')
          this.getList({
            currentPage: 1,
          })
        } else {
          failureTip('克隆失败')
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }


  // 删除方案
  @action async deleteScheme(params) {
    try {
      const res = await io.deleteScheme({
        projectId: this.projectId,
        ...params,
      })
      runInAction(() => {
        if (res.success) {
          successTip('删除成功')
          this.getList({currentPage: 1})
        } else {
          failureTip('删除失败')
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 查询提交日志
  @observable modalLogVisible = false
  @observable submitLog = ''
  @observable submitLogLoading = false

  @action async getSubmitLog(params) {
    this.submitLogLoading = true
    try {
      const res = await io.getSubmitLog({
        projectId: this.projectId,
        ...params,
      })
      runInAction(() => {
        this.submitLog = res
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.submitLogLoading = false
      })
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
