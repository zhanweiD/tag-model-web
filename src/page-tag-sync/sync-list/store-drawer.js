import {
  action, runInAction, observable,
} from 'mobx'
import {successTip, errorTip, changeToOptions, listToTree} from '../../common/util'
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

  // 上一步
  @action.bound lastStep() {
    this.currentStep = this.currentStep - 1
  }

  // 下一步
  @action.bound nextStep() {
    this.currentStep = this.currentStep + 1
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
  @action async getStorageList(params) {
    try {
      const res = await io.getStorageList({
        projectId: this.projectId,
        ...params,
      })
      runInAction(() => {
        this.storageList = res
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
      const res = await io.getTagTree(params)
      // const res = [
      //   {
      //     id: 69521331111,
      //     aId: 13123,
      //     type: 0, // 0 标签 1 类目 2 对象
      //     name: '标签名称1',
      //     parentId: 6952133304359872,
      //     isUsed: 0, // 0标签未选择 1标签已选择
      //     columnType: 'varchar',
      //     enName: 'enName',
      //     valueType: 1,
      //     valueTypeName: '文本型',
      //     isMajor: 1, // 是否主标签
      //   },
      //   {
      //     id: 69521598722,
      //     aId: 1311223,
      //     type: 0, // 0 标签 1 类目 2 对象
      //     name: '标签名称2',
      //     parentId: 6952133304359872,
      //     isUsed: 0, // 0标签未选择 1标签已选择
      //     columnType: 'varchar',
      //     enName: 'enName',
      //     valueType: 1,
      //     valueTypeName: '文本型',
      //   }, {
      //     id: 69523598721,
      //     aId: 13123123,
      //     type: 0, // 0 标签 1 类目 2 对象
      //     name: '标签名称3',
      //     parentId: 6952133304359872,
      //     isUsed: 0, // 0标签未选择 1标签已选择
      //     columnType: 'varchar',
      //     enName: 'enName',
      //     valueType: 1,
      //     valueTypeName: '文本型',
      //   }, 
      //   {
      //     id: 6952133304359872,
      //     aId: 6952133304359872,
      //     type: 1, // 0 标签 1 类目 2 对象
      //     name: '类目名称',
      //     parentId: 0,
      //   },
      // ]
      runInAction(() => {
        this.originTreeData = res
        this.treeData = listToTree(res)
        if (res.length) {
          const majorTag = res.filter(d => d.isMajor)
          this.majorTagList = majorTag
          this.tableData = majorTag
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
        cb('名称已存在')
      } else {
        cb()
      }
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
