import {
  observable, action, runInAction, toJS,
} from 'mobx'
import {
  successTip, failureTip, errorTip, changeToOptions,
} from '../../common/util'
import {ListContentStore} from '../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getList) {
  projectId
  objId
  typeCode

  @observable drawerVisible = false
  @observable drawerType
  @observable currentStep = 0
  @observable editSelectedItem = {} // 编辑关联字段时 选中的数据表

  @observable dataSourceList = [] // 添加关联字段 - 数据源列表
  @observable dataSourceSelectList = [] // 添加关联字段 - 数据源列表
  @observable dataSheetList = [] // 添加关联字段 - 数据表列表
  @observable dataSheetSelectList = [] // 添加关联字段 - 数据表列表
  @observable fieldList = [] // 添加关联字段 - 字段列表(全部)
  @observable fieldTableList = [] // 添加关联字段 - 字段列表(列表,排除已选主键)
  @observable fieldListLoading = false

  // 选择操作
  @observable storageId = undefined
  @observable tableName = undefined
  @observable majorKeyField = undefined
  @observable entity1Key = undefined
  @observable entity2Key = undefined

  @observable selectedRowKeys = []
  @observable selectedRows = []
  @observable confirmLoading = false

  // 添加成功展示内容
  @observable successInfo = {} // 添加成功展示消息
  @observable successInfoLoading = false

  @action.bound openDrawer() {
    this.currentStep = 0
    this.drawerVisible = true
  }

  @action.bound closeDrawer(cb) {
    this.drawerVisible = false

    this.storageId = undefined
    this.tableName = undefined
    this.majorKeyField = undefined
    
    this.dataSourceList.clear()
    this.dataSheetList.clear()
    this.fieldList.clear()
    this.fieldTableList.clear()
    
    this.selectedRowKeys.clear()
    this.selectedRows.clear()
    this.editSelectedItem = {}

    if (cb) cb()
  }

  // 上一步
  @action.bound lastStep() {
    this.currentStep = this.currentStep - 1
  }

  // 下一步
  @action.bound nextStep() {
    this.currentStep = this.currentStep + 1
  }

  /**
   * @description 添加关联字段 - 数据源列表
   */
  @action async getDataSource() {
    try {
      const res = await io.getDataSource({
        projectId: this.projectId,
      })
      runInAction(() => {
        this.dataSourceList = res
        this.dataSourceSelectList = changeToOptions(res)('storageName', 'storageId')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 添加关联字段 - 数据表列表
   */
  @action async getDataSheet() {
    try {
      const res = await io.getDataSheet({
        objId: this.objId,
        projectId: this.projectId,
        storageId: this.storageId,
      })
      runInAction(() => {
        this.dataSheetList = res
        this.dataSheetSelectList = res.map(d => ({
          name: d.tableName,
          value: d.tableName,
          disabled: Boolean(d.isUsed), 
        }))
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 添加关联字段 - 字段列表
   */
  @action async getFieldList(cb) {
    try {
      const res = await io.getFieldList({
        tableName: this.tableName,
        storageId: this.storageId,
        projectId: this.projectId,
      })
      runInAction(() => {
        if (this.drawerType === 'add') {
          this.fieldList = res.map(d => ({
            ...d,
            name: d.field,
            value: d.field, 
          }))
        }

        if (this.drawerType === 'edit') {
          this.fieldTableList = res.filter(d => d.field !== this.majorKeyField)
        }
       
        if (cb) cb(res)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 添加关联字段 - 获取关联对象已选字段列表(编辑字段)
   */
  @action async getReledFieldList() {
    try {
      const res = await io.getReledFieldList({
        objId: this.objId,
        tableName: this.tableName,
        storageId: this.storageId,
        projectId: this.projectId,
      })

      runInAction(() => {
        this.selectedRows = _.filter(res, d => d.id)
        this.selectedRowKeys = _.map(this.selectedRows.slice(), 'dataFieldName')
        this.fieldTableList = _.filter(res, d => d.dataFieldName !== this.editSelectedItem.mappingKey) 
      })
    } catch (e) {
      errorTip(e.message)
    }
  }


  /**
   * @description 保存添加实体关联字段
   */
  @action async saveEntityField(cb) {
    this.confirmLoading = true

    const dataDbInfo = this.dataSourceList.filter(d => d.storageId === this.storageId)[0]

    const majorKeyInfo = this.fieldList.filter(d => d.field === this.majorKeyField)[0]

    const filedObjReqList = this.selectedRows.map(d => ({
      dataDbName: dataDbInfo.storageName,
      dataStorageId: dataDbInfo.storageId,
      dataDbType: dataDbInfo.storageType,
      dataTableName: this.tableName,
      dataFieldName: d.field,
      dataFieldType: d.type,
      mappingKey: majorKeyInfo.field,
      mappingKeyType: majorKeyInfo.type,
    }))

    try {
      await io.saveEntityField({
        objId: this.objId,
        projectId: this.projectId,
        filedObjReqList,
      })
      runInAction(() => {
        this.confirmLoading = false
        this.nextStep()
        this.fieldSuccessInfo()
        if (cb) cb()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 保存添加关系关联字段
   */
  @action async saveRelField(cb) {
    this.confirmLoading = true

    const dataDbInfo = this.dataSourceList.filter(d => d.storageId === this.storageId)[0]

    const majorKeyInfo = this.fieldList.filter(d => d.field === this.majorKeyField)[0] || {}

    const mappingKeys = this.fieldList
      .filter(d => d.field === this.entity1Key || d.field === this.entity2Key)
      .map(d => ({
        obj_id: d.objId,
        filed_name: d.field,
        file_type: d.type,
      }))

    const filedObjAssReqList = this.selectedRows.map(d => ({
      dataDbName: dataDbInfo.storageName,
      dataStorageId: dataDbInfo.storageId,
      dataDbType: dataDbInfo.storageType,
      dataTableName: this.tableName,
      dataFieldName: d.field,
      dataFieldType: d.type,
      mappingKeys: JSON.stringify(mappingKeys),
      mappingKey: majorKeyInfo.field,
      mappingKeyType: majorKeyInfo.type,
    }))

    try {
      await io.saveRelField({
        objId: this.objId,
        projectId: this.projectId,
        filedObjAssReqList,
      })
      runInAction(() => {
        this.confirmLoading = false
        this.nextStep()
        this.fieldSuccessInfo()
        if (cb) cb()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 获取保存添加关联字段成功后数据
   */
  @action async fieldSuccessInfo() {
    this.successInfoLoading = true
    try {
      const res = await io.fieldSuccessInfo({
        objId: this.objId,
        projectId: this.projectId,
        storageId: this.storageId,
        tableName: this.tableName,
      })

      runInAction(() => {
        this.successInfo = res
        this.successInfoLoading = false
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 更新关联字段(实体)
   */
  @action async updateEntityField(cb) {
    this.confirmLoading = true

    const filedObjReqList = this.selectedRows.map(d => ({
      dataFieldName: d.dataFieldName,
      dataFieldType: d.dataFieldType,
    }))

    try {
      const res = await io.updateEntityField({
        objId: this.objId,
        projectId: this.projectId,
        dataStorageId: this.storageId,
        dataTableName: this.tableName,
        dataDbName: this.editSelectedItem.dataDbName,
        dataDbType: this.editSelectedItem.dataDbType,
        filedObjReqList,
      })

      runInAction(() => {
        this.successInfo = res
        this.confirmLoading = false
        this.nextStep()
        if (cb) cb()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 更新关联字段(关系)
   */
  @action async updateRelField(cb) {
    this.confirmLoading = true

    const filedObjAssReqList = this.selectedRows.map(d => ({
      dataFieldName: d.dataFieldName,
      dataFieldType: d.dataFieldType,
    }))

    try {
      const res = await io.updateRelField({
        objId: this.objId,
        projectId: this.projectId,
        dataStorageId: this.storageId,
        dataDbType: this.editSelectedItem.dataDbType,
        dataDbName: this.editSelectedItem.dataDbName,
        dataTableName: this.tableName,
        filedObjAssReqList,
      })

      runInAction(() => {
        this.successInfo = res
        this.confirmLoading = false
        this.nextStep()
        if (cb) cb()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 移除数据表
   */
  @action async removeList(params, cb) {
    try {
      await io.removeList({
        objId: this.objId,
        projectId: this.projectId,
        ...params,
      })

      runInAction(() => {
        successTip('操作成功')
        if (cb)cb()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
