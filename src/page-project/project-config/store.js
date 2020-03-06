import {
  observable, action, runInAction,
} from 'mobx'
import {successTip, errorTip, changeToOptions} from '../../common/util'
import {ListContentStore} from '../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getList) {
  @observable projectId // 项目id
  @observable users = [] // 可选用户列表 
  @observable roles = [] // 可选用户列表 
  @observable detail = {} // 成员详情 
  @observable projectDetail = {} // 项目详情 
  @observable projectDetailLoading = {} // 项目详情loading 

   // modal
   @observable visible = false // 控制弹窗
   @observable modalType = 'add' // 弹窗类型
  // loading
  @observable confirmLoading = false

  // @action resetModal() {
  //   this.detail = {}
  // }

  @action async getDetail() {
    this.projectDetailLoading = true
    try {
      const res = await io.getDetail({id: this.projectId})
      runInAction(() => {
        this.projectDetail = res
        this.projectDetailLoading = false
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

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
        this.getList()
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
      runInAction(() => {
        this.confirmLoading = false
      })
      errorTip(e.message)
    }
  }

  @action async addList(params, cb) {
    this.confirmLoading = true
    try {
      await io.addList({
        id: this.projectId,
        ...params,
      })
      runInAction(() => {
        this.confirmLoading = false
        if (cb)cb()
        successTip('添加成功')
        this.getList({currentPage: 1})
      })
    } catch (e) {
      runInAction(() => {
        this.confirmLoading = false
      })
      errorTip(e.message)
    }
  }

  @observable paramsList = []
  
  @action async getParamsList() {
    try {
      const res = await io.getParamsList()
      runInAction(() => {
        this.paramsList = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
