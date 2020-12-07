import {
  observable, action, runInAction, toJS,
} from 'mobx'
import _ from 'lodash'
import {
  successTip, failureTip, errorTip, changeToOptions, listToTree,
} from '../../../common/util'
import {ListContentStore} from '../../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getList) {
  projectId
  @observable objId

  // 创建标签
  @observable drawerTagVisible = false
  @observable drawerTagType = 'add' // 创建标签弹窗类型 添加 & 编辑
  @observable drawerTagInfo = {} // 编辑标签时 标签详情
  @observable objectSelectList = [] // 所属对象下拉数据
  @observable tagCateSelectList = [] // 所属类目下拉数据

  @observable isEnum = false // 是否枚举
  @observable ownObject = undefined // 所属对象

  @observable editDetail = {} // 编辑标签事的详情数据 
  @observable detailLoading = false // 请求标签详情时loading

  // 标签配置
  @observable drawerTagConfigVisible = false
  @observable drawerTagConfigInfo = {}
  @observable drawerTagConfigType = 'one' // 单个绑定

  // 批量绑定
  @observable batchConfigVisible = false

  // 上下架申请操作
  @observable tagApplyVisible = false // 上下架申请弹窗控制
  @observable applyInfo = {} // 标签信息

  @observable confirmLoading = false // 提交loading

  // @observable selectedRows = []
  // @observable rowKeys = []

  // 批量发布
  @observable publishRowKeys = []

  @observable modalApplyVisible = false
  @observable selectItem = {}

  // 上下架申请modal
  @action.bound openModal(info) {
    this.tagApplyVisible = true
    this.applyInfo = info
  }

  // 上下架申请modal
  @action.bound closeModal() {
    this.tagApplyVisible = false
    this.applyInfo = {}
  }

  // 创建标签Drawer
  @action.bound openDrawer(type, data) {
    this.drawerTagType = type

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


  // 批量创建标签
  @action.bound openBatchConfig() {
    this.batchConfigVisible = true
  }

  @action.bound closeBatchConfig() {
    this.batchConfigVisible = false
  }


  // 更新标签配置
  @action.bound updateBatchConfig() {
    this.closeBatchConfig()
    this.getList()
  }

  /*
   * @description 上下架申请
   * @param {*} params 
   */
  @action async tagApply(params) {
    this.confirmLoading = true

    try {
      const res = await io.tagApply({
        projectId: this.projectId,
        ...params,
      })
      runInAction(() => {
        if (res.success) {
          successTip('操作成功')
          this.closeModal()
          this.getList()
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
   * @description 修改标签发布状态
   * @param {*} params 
   */
  @action async updateTagStatus(params) {
    try {
      const res = await io.updateTagStatus({
        projectId: this.projectId,
        ...params,
      })
      runInAction(() => {
        if (res.success) {
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

  // 批量发布
  @action async batchPublish() {
    try {
      const res = await io.updateTagStatus({
        projectId: this.projectId,
        status: 2,
        tagIdList: toJS(this.publishRowKeys),
      })
      runInAction(() => {
        if (res.success) {
          successTip('操作成功')
          this.getList()
          this.publishRowKeys.clear()
        } else {
          failureTip('操作失败')
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
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
        projectId: this.projectId,
        ...params,
      })
      runInAction(() => {
        this.drawerTagInfo = res
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
   * @description 创建标签
   */
  @action async createTag(params, cb) {
    this.confirmLoading = true

    try {
      const res = await io.createTag({
        projectId: this.projectId,
        ...params,
      })
      runInAction(() => {
        if (res.success) {
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
   * @description 编辑标签
   */
  @action async updateTag(params, cb) {
    this.confirmLoading = true

    try {
      const res = await io.updateTag({
        projectId: this.projectId,
        ...params,
      })
      runInAction(() => {
        if (res.success) {
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
        projectId: this.projectId,
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

  @observable drawerInheritVis = false
  // 标签树
  // objId
  @observable tagTreeList = []
  @observable tagTreeListAll = []
  @observable tagTreeListAvailable = []
  @observable treeSearchKey
  @observable tagParentIds = []
  @observable tagTreeLoading = false
  @observable checkedKeys = []

  @action async getTagTree() {
    this.tagTreeLoading = true
    try {
      const res = await io.getTagTree({
        objId: +this.objId,
        projectId: this.projectId,
        searchKey: this.treeSearchKey,
      })

      const availableRes = _.filter(res, item => item.available === true)
      
      this.tagTreeListAll = listToTree(res)
      this.tagTreeListAvailable = listToTree(availableRes)
      this.tagTreeList = listToTree(availableRes)
      this.tagParentIds = _.map(this.tagTreeList, item => {
        if (item.children && item.children.length > 0) {
          return String(item.aid)
        }
      })

      this.checkedKeys = _.map(_.filter(res, e => e.checked), 'aid').map(String)
      if (!this.treeSearchKey && this.checkedKeys.length > 0) {
        // 说明有选择的
        this.getTagsList()
      }
      this.tagTreeLoading = false
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable tagDetaiList = []
  @observable tagDetailTableLoading = false
  // 根据标签 id 查询标签详情，批量
  // objId
  // tagIds
  @action async getTagsList(tagIds) {
    this.tagDetailTableLoading = true
    try {
      const res = await io.getTagsList({
        projectId: this.projectId,
        objId: +this.objId,
        tagIds: this.checkedKeys.map(Number),
      })

      this.tagDetaiList = res
      this.tagDetailTableLoading = false
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable inheritLoading = false
  // 继承标签
  // tagIds
  @action async inheritTags(cb = () => {}) {
    this.inheritLoading = true
    try {
      const res = await io.inheritTags({
        projectId: this.projectId,
        objId: +this.objId,
        tagIds: this.checkedKeys.map(Number),
      })
      
      successTip('操作成功')
      cb()
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.inheritLoading = false
    }
  }
}

export default new Store()
