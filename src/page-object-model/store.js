import {
  observable, action, runInAction, 
} from 'mobx'
import {successTip, errorTip} from '../common/util'
import io from './io'

class Store {
  @observable updateDetailKey = undefined
  @observable updateTreeKey = undefined

  @observable addObjectUpdateKey = undefined

  @observable tabId = 0
  // 基本详情
  @observable objId // 对象id
  @observable typeCode // 对象类型
  @observable objDetail = {} // 对象详情
  @observable objCard = {} // 指标卡
  @observable objView = {} // 对象视图
  @observable objViewLoading = false // 对象视图

  @observable loading = false
  @observable releaseLoading = false
  
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


  /**
   * @description 业务视图
   */

  @observable modelLoading = false
  @observable businessModel = []
  
  @action async getBusinessModel(cb, params) {
    this.modelLoading = true
    try {
      const res = await io.getBusinessModel({
        id: this.objId,
        ...params,
      })

      runInAction(() => {
        const data = this.getLinksObj(res.links, res.obj)
        this.businessModel = data
        if (cb) cb()
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.modelLoading = false
      })
    }
  }

  @observable relList = [] // 项目下与对象相关的关系对象列表

  /**
   * @description 项目下与对象相关的关系对象列表
   */
  @action async getBMRelation(cb) {
    try {
      const res = await io.getBMRelation({
        id: this.objId,
      })
      runInAction(() => {
        this.relList = res
        if (cb) cb(res)
      })
    } catch (e) {
      errorTip(e.message)
    } 
  }

  getLinksObj = (links, obj) => {
    if (!links.length) return {links: [], obj}
    if (obj.length === 1) return {links: [], obj}

    const relObj = obj.filter(d => d.objTypeCode === 3)[0]
    const relObjTag = relObj.tag.map(d => d.id)

    let relObjInx

    for (let index = 0; index < obj.length; index += 1) {
      if (obj[index].objTypeCode === 3) {
        relObjInx = index
      }
    }

    const resObj = obj
    
    if (relObjInx === 0) {
      resObj.push(resObj.shift())
    }

    const resLinks = links.map(d => ({
      source: d.u,
      target: d.relationId,
      sourceIndex: 0,
      targetIndex: relObjTag.indexOf(d.v) + 1,
      value: 1,
    }))

    return {
      links: resLinks,
      obj: resObj,
    }
  }
}

export default new Store()
