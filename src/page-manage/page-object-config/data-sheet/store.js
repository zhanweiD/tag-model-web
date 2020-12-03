import {
  observable, action, runInAction, toJS,
} from 'mobx'
import {
  successTip, failureTip, errorTip,
} from '../../../common/util'
import {ListContentStore} from '../../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getList) {
  projectId
  objId
  relationType // 区分 2实体 & 0简单关系 & 1复杂关系
  typeCode // 区分实体&关系

  bothTypeCode // 区分 2实体 & 0简单关系 & 1复杂关系

  @observable confirmLoading = false
  @observable modalVisible = false
  @observable editSelectedItem = {}
  
  @observable storageId = undefined
  @observable tableName = undefined
  @observable majorKeyField = undefined
  @observable whereCondition = undefined
  @observable entity1Key = undefined
  @observable entity2Key = undefined
  
  @observable dataSheetDetail = [] // 数据表详情
  @observable dataSourceList = [] // 数据源下拉列表数据
  @observable dataSheetList = [] // 数据表下拉列表数据
  @observable fieldList = [] // 字段列表下拉列表数据
  @observable fieldList1 = [] // 字段列表下拉列表数据
  @observable fieldList2 = [] // 字段列表下拉列表数据

  @action.bound closeModal(cb) {
    this.modalVisible = false

    this.storageId = undefined
    this.tableName = undefined
    this.majorKeyField = undefined
    this.whereCondition = undefined

    this.entity1Key = undefined
    this.entity2Key = undefined

    this.editSelectedItem = {}

    this.dataSourceList.clear()
    this.dataSheetList.clear()
    this.fieldList.clear()
    this.fieldList1.clear()
    this.fieldList2.clear()

    if (cb) cb()
  }

  /*
   * @description 移除数据表
   */
  @action async removeList(params, cb) {
    try {
      const res = await io.removeList({
        objId: this.objId,
        projectId: this.projectId,
        ...params,
      })

      runInAction(() => {
        if (res) {
          successTip('操作成功')
          if (cb)cb()
        } else {
          failureTip('操作失败')
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /*
   * @description 数据源列表
   */
  @action async getDataSource() {
    try {
      const res = await io.getDataSource({
        projectId: this.projectId,
      })
      runInAction(() => {
        this.dataSourceList = res ? [res] : []
        if (res) {
          this.storageId = res.storageId
          this.getDataSheet()
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /*
   * @description 数据源列表(从关联实体的数据表中选择)
   */
  @action async getEntityDataSource(entityId) {
    try {
      const res = await io.getEntityDataSource({
        entityId,
        id: this.objId,
        storageId: this.storageId,
        projectId: this.projectId,
      })
      runInAction(() => {
        const data = res && res.map(d => ({
          tableName: d.dataTableName,
          isUsed: d.isUsed,
        }))

        this.dataSheetList.replace(data)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /*
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

  /*
   * @description 数据表详情
   */
  @action async getDataSheetDetail() {
    try {
      const res = await io.getDataSheetDetail({
        objId: this.objId,
        // projectId: this.projectId,
        storageId: this.storageId,
      })
      runInAction(() => {
        this.dataSheetDetail = res || []
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /*
   * @description 字段列表
   */
  @action async getFieldList(params, cb) {
    try {
      const res = await io.getFieldList({
        tableName: this.tableName,
        storageId: this.storageId,
        projectId: this.projectId,
        ...params,
      })
      runInAction(() => {
        this.fieldList = res || []
        if (cb) cb(res)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /*
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

  /*
   * @description where条件校验
   */
  @observable whereSuccess = false
  @action async checkWhere() {
    console.log(this.storageId, this.tableName)
    try {
      const res = await io.checkWhere({
        // storageType: this.typeCode,
        storageId: this.storageId,
        tableName: this.tableName,
        whereCondition: this.whereCondition,
      })
      runInAction(() => {
        this.whereSuccess = res.success
        if (res) {
          successTip('校验成功')
        } else {
          failureTip(res.message)
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /*
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
        whereCondition: this.whereCondition,
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

  /*
   * @description 保存添加关系关联字段
   */
  @action async saveRelField(fieldParams, cb) {
    this.confirmLoading = true

    const dataDbInfo = this.dataSourceList.filter(d => d.storageId === this.storageId)[0]


    const mappingKeys1 = toJS(this.fieldList1)
      .filter(d => d.field === this.entity1Key)
      .map(d => ({
        obj_id: `${d.objId}`,
        field_name: d.field,
        field_type: d.type,
      }))

    const mappingKeys2 = toJS(this.fieldList2)
      .filter(d => d.field === this.entity2Key)
      .map(d => ({
        obj_id: `${d.objId}`,
        field_name: d.field,
        field_type: d.type,
      }))
    const mappingKeys = mappingKeys1.concat(mappingKeys2)
    const fieldList = toJS(this.fieldList1).concat(toJS(this.fieldList2))
    const uniqFieldList = _.unionBy(fieldList, 'field')
    const selectFields = uniqFieldList.filter(d => (d.field !== this.entity1Key) && (d.field !== this.entity2Key))

    const filedObjAssReqList = selectFields.map(d => ({
      dataDbName: dataDbInfo.storageName,
      dataStorageId: dataDbInfo.storageId,
      dataDbType: dataDbInfo.storageType,
      dataTableName: this.tableName,
      dataFieldName: d.field,
      dataFieldType: d.type,
      mappingKeys: JSON.stringify(mappingKeys),
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
