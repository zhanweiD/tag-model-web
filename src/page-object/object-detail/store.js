import {
  observable, action, runInAction, 
} from 'mobx'
import {successTip, errorTip, failureTip} from '../../common/util'
import io from '../io'

class Store {
  // 基本详情
  @observable objId // 对象id
  @observable typeCode // 对象类型
  @observable objDetail = {} // 对象详情
  @observable objCard = {} // 指标卡
  @observable objView = {} // 对象视图
  @observable objViewLoading = false // 对象视图

  @observable loading = false
  @observable releaseLoading = false

  // 标签类目
  @observable tagClassVisible = false
  
  @action async getObjDetail() {
    this.loading = true
    try {
      const res = await io.getObjDetail({
        id: this.objId,
      })
      runInAction(() => {
        this.loading = false
        this.objDetail = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async getObjCard() {
    try {
      const res = await io.getObjCard({
        id: this.objId,
      })
      runInAction(() => {
        this.objCard = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 对象视图
  @action async getObjView(cb) {
    this.objViewLoading = true
    try {
      const res = await io.getObjView({
        id: this.objId,
      })
      runInAction(() => {
        this.objView = res
        if (cb) cb()
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.objViewLoading = false
      })
    }
  }

  @action async changeObjStatus(status, cb) {
    this.releaseLoading = true
    try {
      await io.changeObjStatus({
        id: this.objId,
        status,
      })
      runInAction(() => {
        successTip('操作成功')
        this.releaseLoading = false
        if (cb) cb()
      })
    } catch (e) {
      runInAction(() => {
        // failureTip('操作失败')
        this.releaseLoading = false
      })
      errorTip(e.message)
    }
  }
}

export default new Store()
