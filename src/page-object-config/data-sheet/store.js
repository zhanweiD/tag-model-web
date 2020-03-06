import {
  observable, action, runInAction, toJS,
} from 'mobx'
import {
  successTip, failureTip, errorTip,
} from '../../common/util'
import {ListContentStore} from '../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getList) {
  projectId
  objId
  typeCode // 区分实体&关系

  bothTypeCode // 区分 2实体 & 0简单关系 & 1复杂关系

  @observable confirmLoading = false
  @observable modalVisible = false
  @observable editSelectedItem = {}
  
  @observable storageId = undefined
  @observable tableName = undefined
  @observable majorKeyField = undefined
  @observable entity1Key = undefined
  @observable entity2Key = undefined
  
  @observable dataSourceList = [] // 数据源下拉列表数据
  @observable dataSheetList = [] // 数据表下拉列表数据
  @observable fieldList = [] // 字段列表下拉列表数据

  @action.bound closeModal(cb) {
    this.modalVisible = false

    this.storageId = undefined
    this.tableName = undefined
    this.majorKeyField = undefined

    this.entity1Key = undefined
    this.entity2Key = undefined

    this.editSelectedItem = {}

    this.dataSourceList.clear()
    this.dataSheetList.clear()
    this.fieldList.clear()

    if (cb) cb()
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

  /**
   * @description 数据源列表
   */
  @action async getDataSource() {
    try {
      const res = await io.getDataSource({
        projectId: this.projectId,
      })
      runInAction(() => {
        this.dataSourceList = res ? [res] : []
        this.storageId = res.storageId

        if (res) {
          this.getDataSheet()
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 数据源列表(从关联实体的数据表中选择)
   */
  @action async getEntityDataSource(objId) {
    try {
      const res = await io.getList({
        objId,
        currentPage: 1,
        pageSize: 20,
        projectId: this.projectId,
      })
      runInAction(() => {
        const data = res.data.map(d => ({
          tableName: d.dataTableName,
        }))

        this.dataSheetList.replace(data)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 数据表列表
   */
  @action async getDataSheet() {
    try {
      const res = await io.getDataSheet({
        objId: this.objId,
        projectId: this.projectId,
        storageId: this.storageId,
      })
      runInAction(() => {
        this.dataSheetList = res || []
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 字段列表
   */
  @action async getFieldList() {
    try {
      const res = await io.getFieldList({
        tableName: this.tableName,
        storageId: this.storageId,
        projectId: this.projectId,
      })
      runInAction(() => {
        this.fieldList = res || []
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 字段列表
   */
  @action async getMappingKey(objId, cb) {
    try {
      const res = await io.getMappingKey({
        objId,
        storageId: this.storageId,
        tableName: this.tableName,
        projectId: this.projectId,
      })
      runInAction(() => {
        if (cb) cb(res)
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

    const selectFields = this.fieldList.filter(d => d.field !== this.majorKeyField)

    const filedObjReqList = selectFields.map(d => ({
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
      const res = await io.saveEntityField({
        objId: this.objId,
        projectId: this.projectId,
        filedObjReqList,
      })
      runInAction(() => {
        if (res && cb) {
          if (cb)cb()
          successTip('操作成功')
        } else {
          failureTip('操作失败')
        }
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.confirmLoading = false
      })
    }
  }

  /**
   * @description 保存添加关系关联字段
   */
  @action async saveRelField(fieldParams, cb) {
    this.confirmLoading = true

    const dataDbInfo = this.dataSourceList.filter(d => d.storageId === this.storageId)[0]

    // const majorKeyInfo = this.fieldList.filter(d => d.field === this.majorKeyField)[0] || {}
    console.log(toJS(this.entity1Key), toJS(this.entity2Key))
    const mappingKeys = this.fieldList
      .filter(d => d.field === this.entity1Key || d.field === this.entity2Key)
      .map(d => ({
        obj_id: `${d.objId}`,
        filed_name: d.field,
        file_type: d.type,
      }))

    const selectFields = this.fieldList.filter(d => (d.field !== this.entity1Key) && (d.field !== this.entity2Key))

    const filedObjAssReqList = selectFields.map(d => ({
      dataDbName: dataDbInfo.storageName,
      dataStorageId: dataDbInfo.storageId,
      dataDbType: dataDbInfo.storageType,
      dataTableName: this.tableName,
      dataFieldName: d.field,
      dataFieldType: d.type,
      mappingKeys: JSON.stringify(mappingKeys),
      // mappingKey: majorKeyInfo.field,
      // mappingKeyType: majorKeyInfo.type,
      ...fieldParams,
    }))

    try {
      const res = await io.saveRelField({
        objId: this.objId,
        projectId: this.projectId,
        filedObjAssReqList,
        
      })
      runInAction(() => {
        if (res && cb) {
          if (cb)cb()
          successTip('操作成功')
        } else {
          failureTip('操作失败')
        }
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.confirmLoading = false
      })
    }
  }
}

export default new Store()
