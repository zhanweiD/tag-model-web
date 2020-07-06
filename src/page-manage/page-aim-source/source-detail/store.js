import {
  action, runInAction, observable,
} from 'mobx'
import {successTip, errorTip, changeToOptions} from '../../../common/util'
import {ListContentStore} from '../../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getList) {
  sourceId
  projectId

  @observable infoLoading = false
  @observable detail = {}

  @observable visible = false
  @observable confirmLoading = false

  @observable fieldDetail = {}

  @action async getDetail() {
    this.infoLoading = true

    try {
      const res = await io.getDetail({
        id: this.sourceId,
      })

      runInAction(() => {
        this.detail = res
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.infoLoading = false
      })
    }
  }


  @observable objList = [] // 下拉对象数据

  // 下拉对象列表
  @action async getObjList() {
    try {
      const res = await io.getObjList({
        id: this.sourceId,
      })
      runInAction(() => {
        this.objList = changeToOptions(res)('objName', 'objId')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable tagList = [] // 下拉标签数据

  // 下拉对象列表
  @action async getTagList(params) {
    try {
      const res = await io.getTagList({
        id: this.sourceId,
        ...params,
      })
      runInAction(() => {
        this.tagList = changeToOptions(res)('tagName', 'tagId')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 单个字段标签映射
  @action async configTag(params, cb) {
    this.confirmLoading = true
    try {
      await io.configTag(params)
      runInAction(() => {
        if (cb)cb()
        successTip('映射成功')
        this.getList({currentPage: 1})
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.confirmLoading = false
      })
    }
  }

  // 单个字段标签解除映射
  @action async cancelConfig(params) {
    try {
      await io.cancelConfig(params)
      runInAction(() => {
        successTip('取消映射成功')
        this.getList({currentPage: 1})
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
