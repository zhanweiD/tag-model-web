import intl from 'react-intl-universal'
import {action, runInAction, observable, toJS} from 'mobx'
import {
  errorTip,
  successTip,
  failureTip,
  changeToOptions,
} from '../../../common/util'
import {ListContentStore} from '../../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getTableList) {
  projectId
  objId
  relationType // 区分 2实体 & 0简单关系 & 1复杂关系
  typeCode // 区分实体：4&关系：3

  @observable bothTypeCode // 区分 2实体 & 0简单关系 & 1复杂关系

  @observable confirmLoading = false
  @observable modalVisible = false
  @observable editSelectedItem = {}

  @observable storageId = undefined
  @observable tableName = undefined
  @observable majorKeyField = undefined
  @observable entity1Key = undefined
  @observable entity2Key = undefined
  @observable dataSourceLoading = false
  @observable dataTableLoading = false

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
          successTip(
            intl
              .get(
                'ide.src.page-common.approval.pending-approval.store.voydztk7y5m'
              )
              .d('操作成功')
          )
          if (cb) cb()
        } else {
          failureTip(
            intl
              .get(
                'ide.src.page-manage.page-aim-source.tag-config.store.82gceg0du65'
              )
              .d('操作失败')
          )
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
    this.dataSourceLoading = true
    try {
      const res = await io.getDataSource({
        // projectId: this.projectId,
      })
      runInAction(() => {
        this.dataSourceList = res || []
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.dataSourceLoading = false
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
        const data = res
          && res.map(d => ({
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
  @action async getDataSheet(params) {
    this.dataTableLoading = true
    try {
      const res = await io.getDataSheet(params)
      runInAction(() => {
        this.dataSheetList = res || []
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.dataTableLoading = false
    }
  }

  /*
   * @description 字段列表
   */
  @action async getFieldList(params, cb) {
    try {
      const res = await io.getFieldList({
        tableName: this.dataTableName,
        storageId: this.dataStorageId,
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
   * @description 保存添加实体关联字段
   */
  @action async saveEntityField(cb) {
    this.confirmLoading = true

    const dataDbInfo = this.dataSourceList.filter(
      d => d.storageId === this.storageId
    )[0]

    const majorKeyInfo = this.fieldList.filter(
      d => d.field === this.majorKeyField
    )[0]

    const selectFields = this.fieldList.filter(
      d => d.field !== this.majorKeyField
    )

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
          if (cb) cb()
          successTip(
            intl
              .get(
                'ide.src.page-common.approval.pending-approval.store.voydztk7y5m'
              )
              .d('操作成功')
          )
        } else {
          failureTip(
            intl
              .get(
                'ide.src.page-manage.page-aim-source.tag-config.store.82gceg0du65'
              )
              .d('操作失败')
          )
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

    const dataDbInfo = this.dataSourceList.filter(
      d => d.storageId === this.storageId
    )[0]

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
    const selectFields = uniqFieldList.filter(
      d => d.field !== this.entity1Key && d.field !== this.entity2Key
    )

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
          if (cb) cb()
          successTip(
            intl
              .get(
                'ide.src.page-common.approval.pending-approval.store.voydztk7y5m'
              )
              .d('操作成功')
          )
        } else {
          failureTip(
            intl
              .get(
                'ide.src.page-manage.page-aim-source.tag-config.store.82gceg0du65'
              )
              .d('操作失败')
          )
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
   * @description 获取所属对象下拉数据
   */
  @action async getObjectSelectList() {
    try {
      const res = await io.getObjectSelectList({
        projectId: this.projectId,
        // objId: this.objId,
      })
      runInAction(() => {
        this.objectSelectList = changeToOptions(res)('name', 'id')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // ---------- 多表设置
  @observable mode = 0
  @observable dataStorageId
  @observable dataTableName
  @observable dataField
  @observable dataField1
  @observable dataField2

  // 设置数据表 主表模式，并集模式
  @action async updateObjJoinMode(params, cb = () => {}) {
    this.confirmLoading = true
    try {
      const res = await io.updateObjJoinMode(params)

      successTip(
        intl
          .get(
            'ide.src.page-common.approval.pending-approval.store.voydztk7y5m'
          )
          .d('操作成功')
      )
      cb()
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.confirmLoading = false
      })
    }
  }

  @observable joinModeDetail

  // 获取已有的多表关联模式
  // objId
  @action async getObjJoinMode(params, cb = () => {}) {
    try {
      const res = await io.getObjJoinMode(params)

      this.joinModeDetail = res
      cb()
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
