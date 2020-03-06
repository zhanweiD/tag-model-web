import {
  observable, action, runInAction,
} from 'mobx'
import {
  successTip, failureTip, errorTip, changeToOptions, listToTree,
} from '../../common/util'
import {ListContentStore} from '../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getList) {
  projectId

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

  // 上下架申请操作
  @observable tagApplyVisible = false // 上下架申请弹窗控制
  @observable applyInfo = {} // 标签信息

  @observable confirmLoading = false // 提交loading

  @observable selectedRows = []
  @observable rowKeys = []

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

  /**
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
          successTip('提交成功')
          this.closeModal()
          this.getList()
        } else {
          failureTip('提交失败')
        }
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.confirmLoading = false
    }
  }

  /**
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

  /**
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

  /**
   * @description 获取所属类目下拉数据
   */
  @action async getTagCateSelectList(params) {
    try {
      const res = await io.getTagCateSelectList(params)
      runInAction(() => {
        this.tagCateSelectList = listToTree(res)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 标签详情
   */
  @action async getTagDetail(params) {
    this.detailLoading = true

    try {
      const res = await io.getTagDetail(params)
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

  /**
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

  /**
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

  /**
   * @description 删除标签
   */
  @action async deleteTag(params) {
    try {
      const res = await io.deleteTag(params)
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


  /**
   * @description 重名校验
   */
  @action async checkName(params, cb) {
    try {
      const res = await io.checkName({
        projectId: this.projectId,
        objId: this.ownObject,
        ...params,
      })
      if (res.success) {
        cb('名称已存在')
      } else {
        cb()
      }
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable functionCodes = []

  /**
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
