import {observable, action, runInAction} from 'mobx'
import {errorTip} from '../../common/util'
import io from './io'

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

  /**
   * @description 业务模型
   */

  @observable modelLoading = false
  @observable businessModel = []
  
  @action async getBusinessModel(cb, params) {
    this.modelLoading = true
    try {
      const res = await io.getBusinessModel({
        id: this.objId,
        projectId: this.projectId,
        ...params,
      })

      runInAction(() => {
        const data = this.getLinksObj(res.links, res.obj)
        // this.businessModel = data
        // if (cb) cb()
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.modelLoading = false
      })
    }
  }
}

export default new Store()
