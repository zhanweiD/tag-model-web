import {
  action, runInAction, observable, toJS,
} from 'mobx'
import {
  successTip, failureTip, errorTip, listToTree,
} from '../../common/util'
import io from './io'

export default class Store {
  constructor(rootStore) {
    this.rootStore = rootStore
    this.codeStore = rootStore.codeStore
    this.listStore = rootStore.listStore
  }

  projectId

  @observable drawerVisible = false
  @observable drawerType
  @observable currentStep = 0
  
  @observable schemeDetail = {}

  @action.bound closeDrawer() {
    this.drawerVisible = false
    this.destory()
  }

  @action.bound destory() {
    this.codeStore.isRuned = false
    this.currentStep = 0
    this.drawerType = undefined
    this.schemeDetail = {}
  }

  // 上一步
  @action.bound lastStep() {
    this.currentStep = this.currentStep - 1
  }

  // 下一步
  @action.bound nextStep() {
    this.currentStep = this.currentStep + 1
  }

  // ************************* 方案详情 start ************************* //
 
  @action async getSchemeDetail(params) {
    try {
      const res = await io.getSchemeDetail(params)
      runInAction(() => {
        this.schemeDetail = {...res, ...this.schemeDetail}
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async getSchemeConfigInfo(params) {
    try {
      const res = await io.getSchemeConfigInfo(params)
      runInAction(() => {
        this.schemeDetail = {...res, ...this.schemeDetail}
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
  // ************************* 方案详情 end ************************* //

  // ************************* 基础信息 start ************************* //
  @observable objList = []
  // @observable objName
  // @observable objId
  // @observable obj = [] // 用于第三步 主标签配置
  @observable objDetail = {}

  // 基础信息
  @observable oneForm = {}
  @observable oneStepSuccess = false

  /**
   * @description 获取 逻辑配置-函数树
   */
  @action async getObjList() {
    try {
      const res = await io.getObjList({
        projectId: this.projectId,
      })
      runInAction(() => {
        this.objList = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 获取 对象详情
   */
  @action async getObjDetail(params, cb) {
    try {
      const res = await io.getObjDetail({
        projectId: this.projectId,
        ...params,
      })
      runInAction(() => {
        if (cb)cb(res)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 重名校验
   */
  @action async checkName(params, cb) {
    try {
      const res = await io.checkName({
        projectId: this.projectId,
        ...params,
      })
      if (res.isExit) {
        cb('名称已存在')
      } else {
        cb()
      }
    } catch (e) {
      errorTip(e.message)
    }
  }
  // ************************* 基础信息 end *************************** //

  // ************************* 函数树 & 标签树 start ************************* //
  @observable treeLoading = false

  @observable searchKey = undefined
  @observable expandAll = false
  @observable treeData = [] // 类目树数据
  @observable searchExpandedKeys = [] // 关键字搜索展开的树节点

  @action findParentId(id, data, expandedKeys) {
    data.forEach(item => {
      if (item.parentId !== 0 && item.id === id) {
        expandedKeys.push(item.parentId)
        this.findParentId(item.parentId, data, this.searchExpandedKeys)
      }
    })
  }

  /**
   * @description 获取 逻辑配置-标签树
   */
  @action async getTagTree() {
    this.treeLoading = true
    try {
      const res = await io.getTagTree({
        projectId: this.projectId,
        searchKey: this.searchKey,
      })
      runInAction(() => {
        this.treeLoading = false
        this.searchExpandedKeys.clear()

        let data = res

        // 判断是否进行搜索
        if (this.searchKey) {
          data = res.map(item => {
            // 关键字搜索定位
            if (this.searchKey && item.name.includes(this.searchKey)) {
              this.findParentId(item.id, res, this.searchExpandedKeys)
            }
            return item
          })
        }

        this.treeData = listToTree(data)
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.treeLoading = false
      })
    }
  }

  /**
   * @description 获取 逻辑配置-函数树
   */
  @action async getFunTree() {
    this.treeLoading = true
    try {
      const res = await io.getFunTree()
      runInAction(() => {
        // this.treeData = listToTree(res)
        this.treeData = res.map(d => ({
          id: d,
          aId: d,
          name: d,
          parentId: 0,
        }))
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.treeLoading = false
      })
    }
  }

  // ************************* 函数树 & 标签树 end ************************* //


  /**
   * @description 方案保存
   */
  @action async saveSchema(p) {
    const params = this.getSaveParams()

    try {
      const res = await io.saveSchema({
        ...p,
        ...params,
      })
      runInAction(() => {
        if (res) {
          successTip('保存成功')
          this.closeDrawer()
          this.listStore.getList({
            currentPage: 1,
            pageSize: 10,
          })
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 保存方案入參处理
  @action.bound getSaveParams() {
    const {
      id,
      objId,
      name,
      descr,
    } = this.schemeDetail
    console.log(toJS(this.schemeDetail))
    const params = {
      projectId: this.projectId,
      objId,
      name,
      descr,
    }

    if (id) {
      params.id = id
    }

    return params
  }
}
