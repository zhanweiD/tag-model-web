import intl from 'react-intl-universal'
import {action, runInAction, observable} from 'mobx'
import {errorTip, changeToOptions, listToTree} from '../../../common/util'
import io from './io'

class Store {
  projectId
  @observable currentStep = 0
  @observable previewData = {}

  // 基础信息
  @observable objId = undefined
  @observable storageType = undefined
  @observable storageId = undefined
  @observable storageName = undefined

  @action.bound destroy() {
    this.currentStep = 0
    this.previewData = {}
    this.storageId = undefined
    this.storageType = undefined
    this.storageName = undefined
    this.confirmLoading = false
    this.objList.clear()
    this.storageList.clear()
    this.storageTypeList.clear()
  }

  // 上一步
  @action.bound lastStep() {
    this.currentStep = this.currentStep - 1
  }

  // 下一步
  @action.bound nextStep() {
    this.currentStep = this.currentStep + 1
  }

  @observable objList = [] // 下拉对象数据
  @observable syncObjList = [] // 下拉对象数据

  // 下拉对象列表
  @action async getObjList() {
    try {
      const res = await io.getObjList({
        projectId: this.projectId,
        storageId: this.storageId,
      })

      runInAction(() => {
        this.objList = changeToOptions(res)('name', 'objId')
        this.syncObjList = res || []
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable defaultStorage = {}
  @observable getDefaultLogin = true
  @observable oneForm = {}
  @observable selecStorageType
  // 判断是否单一数据源
  @action async getDefaultStorage() {
    this.getDefaultLogin = true
    try {
      const res = await io.getDefaultStorage({
        projectId: this.projectId,
      })

      runInAction(() => {
        this.defaultStorage = res || {}
        if (this.defaultStorage.storageType) {
          this.oneForm.setFieldsValue({
            dataDbType: {label: res.storageTypeName, key: res.storageType},
          })
          this.selecStorageType({
            key: res.storageType,
            label: res.storageName,
          })
        }
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.getDefaultLogin = false
    }
  }

  @observable storageTypeList = []
  // 数据源类型
  @action async getStorageType() {
    try {
      const res = await io.getStorageType({
        projectId: this.projectId,
      })

      runInAction(() => {
        this.storageTypeList = changeToOptions(res || [])('name', 'type')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable storageList = []
  // 数据源列表
  @action async getStorageList(params, cb) {
    try {
      const res = await io.getStorageList({
        projectId: this.projectId,
        ...params,
      })

      runInAction(() => {
        this.storageList = res || []

        if (this.defaultStorage.storageId) {
          this.oneForm.setFieldsValue({
            dataStorageId: {
              key: this.defaultStorage.storageId,
              label: this.defaultStorage.storageName,
            },
          })
        }

        if (cb) {
          cb({
            key: this.defaultStorage.storageId,
            label: this.defaultStorage.storageName,
          }) 
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable storageDetailLoading = false
  @observable storageDetail = {}
  @observable storageVisible = false

  // 数据源详情
  @action async getStorageDetail(params) {
    this.storageDetailLoading = true

    try {
      const res = await io.getStorageDetail({
        id: this.projectId,
        ...params,
        projectId: this.projectId,
      })

      runInAction(() => {
        this.storageDetail = res
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.storageDetailLoading = false
      })
    }
  }

  // 标签树
  @observable treeData = []
  @observable originTreeData = []
  @observable treeLoading = false
  // 标签列表
  @observable tableData = []
  @observable majorTagList = []

  @action async getTagTree(params) {
    this.treeLoading = true
    try {
      const res = await io.getTagTree({
        projectId: this.projectId,
        storageId: this.storageId,
        objId: this.objId,
        ...params,
      })

      runInAction(() => {
        this.originTreeData = res
        this.treeData = listToTree(res)
        if (res.length) {
          const majorTag = res.filter(d => d.isMajor)
          this.majorTagList = majorTag

          this.tableData = majorTag.map(d => ({
            ...d,
            columnName: d.enName,
          }))
        }
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.treeLoading = false
      })
    }
  }

  @action async checkName(params, cb) {
    try {
      const res = await io.checkName({
        projectId: this.projectId,
        ...params,
      })

      if (res.isExist) {
        cb(
          intl
            .get(
              'ide.src.page-manage.page-aim-source.source-list.store.o07pkyecrw'
            )
            .d('名称已存在')
        )
      } else {
        cb()
      }
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async checkTableName(params, cb) {
    try {
      const res = await io.tableNameCheck({
        projectId: this.projectId,
        ...params,
      })

      if (res.isExist) {
        cb(
          intl
            .get(
              'ide.src.page-manage.page-tag-sync.sync-list.store-drawer.e5ts5izctvj'
            )
            .d('表名已存在')
        )
      } else {
        cb()
      }
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable confirmLoading = false
  // 新增同步计划
  @action async addSync(params, cb) {
    this.confirmLoading = true

    try {
      await io.addSync({
        projectId: this.projectId,
        ...params,
      })

      runInAction(() => {
        // if (cb) {
        //   cb()
        // }
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.confirmLoading = false
        if (cb) {
          cb()
        }
      })
    }
  }
}

export default new Store()
