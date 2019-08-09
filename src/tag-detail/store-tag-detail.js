import {
  observable, action, runInAction, toJS,
} from 'mobx'
import {successTip, errorTip} from '../common/util'
import io from './io'

class TagDetailStore {
  id = undefined
  @observable baseInfo = false
  @observable baseInfoLoading = false

  @action async getBaseInfo(id, type) {
    this.baseInfoLoading = true
    // 节点类型 0 标签 1 类目 2 对象
    try {
      let res
      if (type === 2) {
        res = await io.getObjectDetail({id})
      } else if (type === 0) {
        res = await io.getTagDetail({id})
      }
      runInAction(() => {
        const res2 =  {
          "createTime": "2019.07.13",
          "name": "客户",	
          "creator": "望舒",
          "descr": "测试对象",
          "objType": "人",
          "objTypeCode": 1,
          "tagCount": 100,
          "tenantId": 4,
          "userId": 1,
              "objRspList": [{
            "createTime": 0,
            "descr": "望舒测试对象",
            "enName": "cunstomer",
            "id": 5570722006959552,
            "isUsed": 0,
            "name": "客户",
            "objTypeCode": 1,
            "tenantId": 4
          }, {
            "createTime": 0,
            "descr": "望舒测试对象物",
            "enName": "gift_card",
            "id": 5570732046091392,
            "isUsed": 0,
            "name": "礼品卡",
            "objTypeCode": 2,
            "tenantId": 4
          }]
        }
        this.baseInfoLoading = false
        this.baseInfo = res2
      })
    } catch (e) {
      runInAction(() => {
        this.baseInfoLoading = false
      })
      errorTip(e.message)
    }
  }
}

export default new TagDetailStore()
