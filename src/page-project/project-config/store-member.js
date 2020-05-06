import {action, runInAction, observable} from 'mobx'
import {successTip, errorTip, changeToOptions} from '../../common/util'
import {ListContentStore} from '../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getMemberList) {
  projectId
  @observable visible = false
  @observable modalType = 'add' // 弹窗类型
  @observable confirmLoading = false

  @observable users = [] // 可选用户列表 
  @observable roles = [] // 可选用户列表 
  @observable detail = {} // 成员详情 
  
  
  @action async getUsers() {
    try {
      const res = await io.getUsers({id: this.projectId})
      runInAction(() => {
        this.users = changeToOptions(res)('userName', 'memberId')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async getRole() {
    try {
      const res = await io.getRole({id: this.projectId})
      runInAction(() => {
        this.roles = changeToOptions(res)('roleName', 'roleId')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async delList(id) {
    try {
      await io.delList({id})
      runInAction(() => {
        successTip('删除成功')
        this.getList({
          currentPage: 1,
        })
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async editList(params, cb) {
    this.confirmLoading = true
    try {
      await io.editList(params)
      runInAction(() => {
        this.confirmLoading = false
        if (cb)cb()
        successTip('编辑成功')
        this.getList()
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.confirmLoading = false
      })
    }
  }

  @action async addList(params, cb) {
    this.confirmLoading = true
    try {
      await io.addList({
        id: +this.projectId,
        ...params,
      })
      runInAction(() => {
        this.confirmLoading = false
        if (cb)cb()
        successTip('添加成功')
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
}

export default new Store()
