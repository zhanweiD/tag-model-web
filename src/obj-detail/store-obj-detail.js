import {
  observable, action, runInAction, toJS,
} from 'mobx'
import {successTip, errorTip} from '../common/util'
import io from './io'

class ObjDetailStore {
  id = undefined
  // 弹窗显示控制
  @observable modalVisible = {
    addRelField: false,
    editRelField: false,
    viewRelField: false,
    tagConfiguration: false,
  }

  @observable baseInfo = false
  @observable baseInfoLoading = false

  // 指标卡
  @observable dailyCard = false 
  
  // 对象存储信息
  @observable tableLoading = false
  @observable list = []
  @observable pagination = {
    pageSize: 10,
    currentPage: 1,
    count: 0,
  }

  // 获取关联对象字段列表
  @observable relDbField = []
  // // 查询条件
  // @observable order = ''
  // @observable sort = ''


  // 添加关联字段
  @observable drawerLoading = false
  @observable dacList = []
  @observable tableList = []
  @observable fieldList = []
  @observable tableListLoading = false
  @observable fieldListLoading = false

  // 编辑关联字段
  @observable relDbFieldLoading = false

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
      const res = await io.getDailyCard({
        id: this.id,
      })
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
      const res = await io.getObjStorageList({
        objId: this.id,
        // order: this.order,
        // sort: this.sort,
        currentPage: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
      })
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
        res && this.dacList.replace(arr)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async getTableList(storageId) {
    this.tableListLoading = true
    try {
      const res = await io.getTableList({
        objId: this.id,
        storageId,
      })
      runInAction(() => {
        this.tableListLoading = false
        res && this.tableList.replace(res)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async getFieldList(storageId, tableName) {
    this.fieldListLoading = true
    try {
      const res = await io.getFieldList({
        storageId,
        tableName,
      }) || []
      runInAction(() => {
        this.fieldListLoading = false
        res.map(item => {
          item.disabled = _.map(toJS(this.relDbField), 'dataFieldName').includes(item.field)
        })
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
          filedObjAssReqList: filedObjReqList,
        })
      } else {
        await io.addRelField({
          objId: this.id,
          filedObjReqList,
        })
      }
      runInAction(() => {
        successTip('添加成功')
        // 更新
        this.getDailyCard()
        this.getList()
        cb && cb()  
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async updateRelField(param, cb) {
    try {
      if (this.baseInfo.objTypeCode === 3) {
        await io.updateRelFieldAss(param)
      } else {
        await io.updateRelField(param)
      }
      runInAction(() => {
        successTip('添加成功')
        this.getDailyCard()
        this.getList()
        cb && cb()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
  
  // 获取已关联字段列表(编辑时)
  @action async getRelDbField(storageId, tableName, cb) {
    this.relDbFieldLoading = true
    try {
      const res = await io.getRelDbField({
        objId: this.id,
        storageId,
        tableName,
      })
      runInAction(() => {
        this.relDbFieldLoading = false
        this.relDbField.clear()
        res.forEach(item => {
          this.relDbField.push({
            dataFieldName: item.dataFieldName,
            dataFieldType: item.dataFieldType,
            isMajorKey: item.isMajorKey,
            isUsed: item.isUsed,
          })
        })
        cb && cb()
      })
    } catch (e) {
      runInAction(() => {
        this.relDbFieldLoading = false
      })
      errorTip(e.message)
    }
  }

  
  @action async delObjFieldRel(storageId, tableName) {
    try {
      await io.delObjFieldRel({
        objId: this.id,
        storageId,
        tableName,
      })
      runInAction(() => {
        successTip('移除成功')
        this.getDailyCard()
        this.getList()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new ObjDetailStore()
