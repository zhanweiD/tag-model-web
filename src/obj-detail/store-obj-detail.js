import {
  observable, action, runInAction, toJS,
} from 'mobx'
import {successTip, errorTip} from '../common/util'
import io from './io'

class ObjDetailStore {
  id = undefined
  // 弹窗显示控制
  @observable modalVisible = {
    editRelField: false,
  }

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
        currentPage: 1,
        data: [{
          id: 1,
          storageId: 'jdsjsjksjk212dsd',
          storageName: 'wangshu_test',
          storageType: 4,
          storageTypeName: 'HIVE',
          tableName: 'demo',
          configuredField: 100,
          associatedField: 100,
          isUsed: 0,
        }, {
          id: 1,
          storageId: 'jdsjsjksjk212dsd',
          storageName: 'wangshu_test',
          storageType: 4,
          storageTypeName: 'HIVE',
          tableName: 'demo1',
          configuredField: 100,
          associatedField: 100,
          isUsed: 1,
        }, {
          id: 1,
          storageId: 'jdsjsjksjk212dsd',
          storageName: 'wangshu_test',
          storageType: 4,
          storageTypeName: 'HIVE',
          tableName: 'demo2',
          configuredField: 100,
          associatedField: 100,
          isUsed: 0,
        }, {
          id: 1,
          storageId: 'jdsjsjksjk212dsd',
          storageName: 'wangshu_test',
          storageType: 4,
          storageTypeName: 'HIVE',
          tableName: 'demo3',
          configuredField: 100,
          associatedField: 100,
          isUsed: 0,
        }, {
          id: 1,
          storageId: 'jdsjsjksjk212dsd',
          storageName: 'wangshu_test',
          storageType: 4,
          storageTypeName: 'HIVE',
          tableName: 'demo4',
          configuredField: 100,
          associatedField: 100,
          isUsed: 0,
        }, {
          id: 1,
          storageId: 'jdsjsjksjk212dsd',
          storageName: 'wangshu_test',
          storageType: 4,
          storageTypeName: 'HIVE',
          tableName: 'demo5',
          configuredField: 100,
          associatedField: 100,
          isUsed: 0,
        }],
        pageSize: 5,
        pages: 1,
        totalCount: 1,
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


  @observable drawerLoading = false
  @observable dacList = []
  @observable tableList = []
  @observable fieldList = []
  @action async getDacList() {
    this.drawerLoading = true
    try {
      const res = await io.getDacList({})
      runInAction(() => {
        this.drawerLoading = false
        const arr = res.map(item => ({
          dataStorageId: item.storageId,
          dataDbName: item.storageName,
          dataDbType: item.storageType,
        }))
        this.dacList.replace(arr)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async getTableList(storageId) {
    try {
      const res = await io.getTableList({
        objId: this.id,
        storageId,
      })
      runInAction(() => {
        this.tableList.replace(res)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async getFieldList(storageId, tableName) {
    try {
      const res = await io.getFieldList({
        storageId,
        tableName,
      })
      runInAction(() => {
        // const arr = res.map(item => ({
        //   dataFieldName: item.field,
        //   dataFieldType: item.type,
        // }))
        this.fieldList.replace(res)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async addRelField(filedObjReqList, cb) {
    try {
      if (this.baseInfo.objTypeCode === 3) {
        await io.addRelFieldAss({
          objId: this.id,
          filedObjReqList,
        })
      } else {
        await io.addRelField({
          objId: this.id,
          filedObjReqList,
        })
      }
      runInAction(() => {
        successTip('添加成功')
        cb && cb()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new ObjDetailStore()
