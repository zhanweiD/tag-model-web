import {
  observable, action, runInAction,
} from 'mobx'
import {successTip, errorTip} from '../../common/util'
import io from './io'


class Store {
  projectId // 项目ID

  @observable loading = false

  // 场景列表
  @observable list = []

  // 场景详情
  @observable info = {}

  // 弹窗标识 
  @observable modalVisible = false

  // 弹窗编辑／新增 判断标识
  @observable isEdit = false

  // 确认loading
  @observable confirmLoading = false

  // 场景列表
  @action async getList() {
    this.loading = true
    try {
      const res = await io.getList({
        projectId: this.projectId,
      })

      runInAction(() => {
        this.loading = false
        this.list.replace(res)
      })
    } catch (e) {
      runInAction(() => {
        this.loading = false
      })
      errorTip(e.message)
    }
  }

  // 场景新增
  @action async addScene(params) {
    this.confirmLoading = true
    try {
      await io.addScene({
        projectId: this.projectId,
        ...params,
      })

      runInAction(() => {
        this.confirmLoading = false
        this.modalVisible = false
        this.getList()
        successTip('添加成功')
      })
    } catch (e) {
      errorTip(e.message)
      runInAction(() => {
        this.confirmLoading = false
        this.modalVisible = false
      })
    }
  }

  // 场景删除
  @action async delScene(id) {
    try {
      await io.delScene({
        occasionId: id,
      })

      runInAction(() => {
        this.getList()
        successTip('删除成功')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 场景编辑
  @action async editScene(params) {
    this.confirmLoading = true
    try {
      await io.editScene({
        projectId: this.projectId,
        ...params,
      })

      runInAction(() => {
        this.confirmLoading = false
        this.modalVisible = false
        this.getList()
        successTip('编辑成功')
      })
    } catch (e) {
      errorTip(e.message)
      runInAction(() => {
        this.confirmLoading = false
        this.modalVisible = false
      })
    }
  }

  // 名称校验
  @action async checkName(params, cb) {
    try {
      const res = await io.checkName(params)

      runInAction(() => {
        if (cb) cb(res)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
