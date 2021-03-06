import intl from 'react-intl-universal'
import {action, runInAction, observable} from 'mobx'
import {successTip, errorTip, changeToOptions} from '../../../common/util'
import {ListContentStore} from '../../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getList) {
  projectId

  @observable visible = false
  @observable drawerVisible = false
  @observable confirmLoading = false
  @observable drawerTagConfigInfo = {}

  @action.bound closeDrawer() {
    this.storageList.clear()
    this.storageTable.clear()
    this.fieldList.clear()
    this.objRelList.clear()
    this.storageTypeList.clear()
    this.visible = false
  }

  // 标签配置Drawer
  @action.bound closeTagConfig() {
    this.drawerTagConfigInfo = {}
    this.drawerVisible = false
  }

  // 更新标签配置
  @action.bound updateTagConfig() {
    this.closeTagConfig()
    this.getList()
  }

  @observable objList = [] // 下拉对象数据

  // 下拉对象列表
  @action async getObjList() {
    try {
      const res = await io.getObjList({
        projectId: this.projectId,
      })

      runInAction(() => {
        this.objList = changeToOptions(res)('name', 'objId')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable underObjList = [] // 新建对象下拉
  @observable storageId = null // 新建对象下拉
  // 下拉对象列表
  @action async getUnderObjList() {
    try {
      const res = await io.getUnderObjList({
        projectId: this.projectId,
        storageId: this.storageId,
      })

      runInAction(() => {
        this.underObjList = res || []
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable objRelList = [] // 关联的对象

  // 根据objId 查询关联对象（实体就是其自身）
  @action async getRelObj(params) {
    try {
      const res = await io.getRelObj({
        projectId: this.projectId,
        ...params,
      })

      runInAction(() => {
        this.objRelList = res
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
        this.storageId = this.defaultStorage.storageId
        if (this.defaultStorage.storageType) {
          this.oneForm.setFieldsValue({dataStorageType: res.storageType})
          this.selecStorageType(res.storageType)
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
        this.storageTypeList = changeToOptions(res)('name', 'type')
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
        this.storageList = res
        // const defaultId = res[0] ? res[0].dataStorageId : undefined
        if (cb) cb(this.defaultStorage.storageId)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable storageTable = []
  // 数据源列表
  @action async getStorageTable(params) {
    try {
      const res = await io.getStorageTable({
        projectId: this.projectId,
        ...params,
      })

      runInAction(() => {
        this.storageTable = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable fieldList = []
  // 数据表下 字段数据
  @action async getFieldList(params) {
    try {
      const res = await io.getFieldList({
        projectId: this.projectId,
        ...params,
      })

      runInAction(() => {
        this.fieldList = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable storageLoading = false
  @observable storageDetail = {}
  @observable storageDetailVisible = false

  // 数据源详情
  @action async getStorageDetail(params) {
    this.storageLoading = true

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
        this.storageLoading = false
      })
    }
  }

  @action async addList(params, cb) {
    this.confirmLoading = true
    try {
      await io.addStorage({
        projectId: this.projectId,
        ...params,
      })

      runInAction(() => {
        successTip(
          intl
            .get(
              'ide.src.page-manage.page-aim-source.source-list.store.gzikr4o96re'
            )
            .d('新建成功')
        )
        if (cb) {
          cb()
        }
        this.getList({currentPage: 1})
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.confirmLoading = false
      })
    }
  }

  @action async delList(id) {
    try {
      await io.delList({
        id,
        projectId: this.projectId,
      })

      runInAction(() => {
        successTip(
          intl
            .get(
              'ide.src.page-manage.page-aim-source.source-list.store.hz4myn73qbp'
            )
            .d('删除成功')
        )
        this.getList({currentPage: 1})
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async checkName(params, cb) {
    try {
      const res = await io.checkName({
        projectId: this.projectId,
        ...params,
      })

      if (res.isExit) {
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
}

export default new Store()
