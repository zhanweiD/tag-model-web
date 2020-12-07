import {
  observable, action, runInAction, toJS,
} from 'mobx'
import {
  successTip, failureTip, errorTip, changeToOptions, listToTree,
} from '../../../common/util'
import {ListContentStore} from '../../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getTagList) {
  projectId = undefined
  objId

  // 创建标签
  @observable drawerTagVisible = false
  @observable drawerTagType = 'add' // 创建标签弹窗类型 添加 & 编辑
  @observable drawerTagInfo = {} // 编辑标签时 标签详情
  @observable objectSelectList = [] // 所属对象下拉数据
  @observable tagCateSelectList = [] // 所属类目下拉数据

  @observable isEnum = false // 是否枚举
  @observable editCateId = undefined
  @observable ownObject = undefined // 所属对象
  @observable getForm 

  @observable detailLoading = false // 请求标签详情时loading


  // 标签配置
  @observable drawerTagConfigVisible = false
  @observable drawerTagConfigInfo = {}
  @observable drawerTagConfigType = 'one' // 单个绑定

  // 创建标签Drawer
  @action.bound openDrawer(type, data) {
    this.drawerTagType = type
    // this.drawerTagInfo = data || {}
    
    if (type === 'edit') {
      // 获取对象详情
      this.getTagDetail({
        id: data.id,
      })
      // 根据所属对象id 查询所属类目下拉框数据
      this.getTagCateSelectList({
        id: data.objId,
      })
    }
    // 根据所属对象id 查询所属类目下拉框数据
    this.getTagCateSelectList({
      id: this.objId,
    })
    this.drawerTagVisible = true
  }

  // 创建标签Drawer
  @action.bound closeDrawer() {
    this.drawerTagInfo = {}
    this.drawerTagVisible = false
    this.isEnum = false
    this.ownObject = undefined
  }

  // 标签配置Drawer
  @action.bound openTagConfig(type, data) {
    this.drawerTagConfigType = type
    this.drawerTagConfigInfo = data
    this.drawerTagConfigVisible = true
  }

  // 标签配置Drawer
  @action.bound closeTagConfig() {
    this.drawerTagConfigInfo = {}
    this.drawerTagConfigVisible = false
    this.drawerTagConfigType = 'one'
  }

  // 更新标签配置
  @action.bound updateTagConfig() {
    this.closeTagConfig()
    this.getList()
  }


  // 更新标签配置
  @action.bound updateBatchConfig() {
    this.closeBatchConfig()
    this.getList()
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

  /*
   * @description 新建标签
   */
  @action async createTag(params, cb) {
    try {
      const res = await io.createTag({
        objId: this.objId,
        ...params,
      })
      runInAction(() => {
        if (res) {
          successTip('操作成功')
          if (cb) cb()
        } else {
          failureTip('操作失败')
        }
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.confirmLoading = false
    }
  }

  /*
   * @description 获取所属类目下拉数据
   */
  @action async getTagCateSelectList(params) {
    try {
      const res = await io.getTagCateSelectList({
        projectId: this.projectId,
        ...params,
      })
      runInAction(() => {
        this.tagCateSelectList = listToTree(res)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /*
   * @description 标签详情
   */
  @action async getTagDetail(params) {
    this.detailLoading = true

    try {
      const res = await io.getTagDetail({
        // projectId: this.projectId,
        ...params,
      })
      runInAction(() => {
        this.drawerTagInfo = res
        this.editCateId = res.cateId
        this.isEnum = res.isEnum
        this.ownObject = res.objId  
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.detailLoading = false
    }
  }

  /*
   * @description 编辑标签
   */
  @action async updateTag(params, cb) {
    this.confirmLoading = true

    try {
      const res = await io.updateTag({
        // objId: this.objId,
        ...params,
      })
      runInAction(() => {
        if (res) {
          successTip('操作成功')
          if (cb) cb()
        } else {
          failureTip('操作失败')
        }
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.confirmLoading = false
    }
  }

  /*
   * @description 删除标签
   */
  @action async deleteTag(params) {
    try {
      const res = await io.deleteTag({
        // projectId: this.projectId,
        ...params,
      })
      runInAction(() => {
        if (res) {
          successTip('操作成功')
          this.getList({currentPage: 1})
        } else {
          failureTip('操作失败')
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /*
   * @description 重名校验
   */
  @action async checkName(params, cb) {
    try {
      const res = await io.checkName({
        projectId: this.projectId,
        objId: this.ownObject,
        ...params,
      })
      runInAction(() => {
        if (res.success) {
          cb('名称已存在')
        } else {
          cb()
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable nameKeyWord = []
  @action async checkKeyWord() {
    try {
      const res = await io.checkKeyWord({
        projectId: this.projectId,
      })
      runInAction(() => {
        this.nameKeyWord = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async cancelTagConfig(params) {
    try {
      const res = await io.cancelTagConfig({
        ...params,
        projectId: this.projectId,
      })
      runInAction(() => {
        if (res) {
          successTip('操作成功')
          this.getList()
        } else {
          failureTip('操作失败')
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable functionCodes = []

  /*
   * @description 权限code
   */
  @action async getAuthCode() {
    try {
      const res = await io.getAuthCode({
        projectId: this.projectId,
      })
      runInAction(() => {
        this.functionCodes = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}


export default new Store()
