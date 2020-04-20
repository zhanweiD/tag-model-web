import {action, runInAction, observable} from 'mobx'
import {successTip, errorTip, changeToOptions} from '../../common/util'
import {ListContentStore} from '../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getStorageList) {
  projectId
  @observable visible = false
  @observable confirmLoading = false
  
  @observable detail = {}
  @observable detailLoading = false
  @observable visibleDetail = false

  @observable storageType = [] // 数据源类型下拉
  @observable storageSelectList = [] // 数据源下拉列
  @observable storageTypeLoading = []  
  @observable storageSelectLoading = []

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
  @action async getStorageSelectList(params) {
    this.storageSelectLoading = true
    try {
      const res = await io.getStorageSelectList({
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
 
  // 新增数据源
  @action async addList(params, cb) {
    this.confirmLoading = true
    try {
      await io.addStorageList({
        id: this.projectId,
        ...params,
      })
      runInAction(() => {
        successTip('添加成功')
        this.getList({currentPage: 1})
        if (cb)cb()
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.confirmLoading = false
      })
    }
  }

  // 数据源详情
  @action async getStorageDetail(params) {
    this.detailLoading = true

    try {
      const res = await io.getStorageDetail({
        id: this.projectId,
        ...params,
      })
      runInAction(() => {
        this.detail = res
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.detailLoading = false
      })
    }
  }
}

export default new Store()
