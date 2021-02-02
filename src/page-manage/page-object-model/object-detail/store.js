import intl from 'react-intl-universal'
import {observable, action, runInAction, toJS} from 'mobx'
import {
  errorTip,
  successTip,
  failureTip,
  changeToOptions,
} from '../../../common/util'
import io from './io'

class Store {
  @observable projectId
  // 基本详情
  @observable objId // 对象id
  @observable typeCode // 对象类型
  @observable objDetail = {} // 对象详情
  @observable objCard = {} // 指标卡
  @observable objView = {} // 对象视图
  @observable objViewLoading = false // 对象视图

  @observable storageId = undefined
  @observable tableName = undefined
  @observable dataSourceList = [] // 数据源下拉列表数据
  @observable dataSheetList = [] // 数据表下拉列表数据
  @observable fieldList = [] // 字段列表下拉列表数据
  @observable fieldList1 = [] // 字段列表下拉列表数据
  @observable fieldList2 = [] // 字段列表下拉列表数据

  @observable loading = false
  @observable releaseLoading = false

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
   * @description 获取所属对象下拉数据
   */
  @action async getObjectSelectList() {
    try {
      const res = await io.getObjectSelectList({
        projectId: this.projectId,
      })

      runInAction(() => {
        this.objectSelectList = changeToOptions(res)('name', 'id')
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

  /*
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
  // @action async getObjectSelectList() {
  //   try {
  //     const res = await io.getObjectSelectList({
  //       projectId: this.projectId,
  //     })
  //     runInAction(() => {
  //       this.objectSelectList = changeToOptions(res)('name', 'id')
  //     })
  //   } catch (e) {
  //     errorTip(e.message)
  //   }
  // }
}

export default new Store()
