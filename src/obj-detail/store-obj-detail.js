import {
  observable, action, runInAction, toJS,
} from 'mobx'
import {successTip, errorTip} from '../common/util'
import io from './io'

class ObjDetailStore {
  id = undefined
  @observable baseInfo = false
  @observable baseInfoLoading = false

  // 指标卡
  @observable dailyCard = false 
  
  // 获取关联对象字段列表
  @observable tableLoading = false
  @observable list = []
  @observable pagination = {
    pageSize: 10,
    currentPage: 1,
    count: 0,
  }
  // // 查询条件
  // @observable order = ''
  // @observable sort = ''

  @action async getBaseInfo() {
    this.baseInfoLoading = true
    try {
      const res = await io.getObjectDetail({
        id: this.id,
      })
      runInAction(() => {
        this.baseInfoLoading = false
        this.baseInfo = res
      })
    } catch (e) {
      runInAction(() => {
        this.baseInfoLoading = false
      })
      errorTip(e.message)
    }
  }

  @action async getDailyCard() {
    try {
      const res2 = await io.getDailyCard({
        id: this.id,
      })
      const res = {
        dataSourceCount: 3,
        tableCount: 20,
        configuredField: 100,
        associatedField: 200,
      }
      runInAction(() => {
        this.dailyCard = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }


  @action async getList() {
    try {
      this.tableLoading = true
      const res2 = await io.getObjStorageList({
        objId: this.id,
        // order: this.order,
        // sort: this.sort,
        currentPage: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
      })
      const res = {
        "currentPage": 1,
        "data": [{
                "id": 1,
          "storageId": "jdsjsjksjk212dsd",
          "storageName": "wangshu_test",
          "storageType": 4,
                "storageTypeName": "HIVE",
                "tableName": "demo",
                "configuredField": 100,
                "associatedField": 100,
                "isUsed": 0
        }, {
          "id": 1,
          "storageId": "jdsjsjksjk212dsd",
          "storageName": "wangshu_test",
          "storageType": 4,
                "storageTypeName": "HIVE",
                "tableName": "demo1",
                "configuredField": 100,
                "associatedField": 100,
                "isUsed": 1
        }, {
          "id": 1,
          "storageId": "jdsjsjksjk212dsd",
          "storageName": "wangshu_test",
          "storageType": 4,
                "storageTypeName": "HIVE",
                "tableName": "demo2",
                "configuredField": 100,
                "associatedField": 100,
                "isUsed": 0
        }, {
          "id": 1,
          "storageId": "jdsjsjksjk212dsd",
          "storageName": "wangshu_test",
          "storageType": 4,
                "storageTypeName": "HIVE",
                "tableName": "demo3",
                "configuredField": 100,
                "associatedField": 100,
                "isUsed": 0
        }, {
          "id": 1,
          "storageId": "jdsjsjksjk212dsd",
          "storageName": "wangshu_test",
          "storageType": 4,
                "storageTypeName": "HIVE",
                "tableName": "demo4",
                "configuredField": 100,
                "associatedField": 100,
                "isUsed": 0
        }, {
          "id": 1,
          "storageId": "jdsjsjksjk212dsd",
          "storageName": "wangshu_test",
          "storageType": 4,
                "storageTypeName": "HIVE",
                "tableName": "demo5",
                "configuredField": 100,
                "associatedField": 100,
                "isUsed": 0
        }],
        "pageSize": 5,
        "pages": 1,
        "totalCount": 1
      }

      runInAction(() => {
        this.tableLoading = false
        this.list.replace(res.data)
        this.pagination.count = res.totalCount
        this.pagination.currentPage = res.currentPage
        this.pagination.pageSize = res.pageSize
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action.bound handleChange = (pagination, filters, sorter) => {
    this.pagination.currentPage = pagination.current
    this.order = sorter.order === 'descend' ? 'DESC' : 'ASC'
    this.sort = sorter.columnKey
    this.getList()
  }
}

export default new ObjDetailStore()
