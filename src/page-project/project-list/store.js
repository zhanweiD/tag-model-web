import {
  observable, action, runInAction, toJS,
} from 'mobx'
import {
  successTip, errorTip, changeToOptions, trimFormValues,
} from '../../common/util'
import {ListContentStore} from '../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getList) {
  @observable cUser = [] // 项目所有者 
  @observable dataSource = [] // 数据源 
  @observable detail = {} // 项目详情

  // modal
  @observable visible = false // 控制弹窗
  @observable modalType = 'add' // 弹窗类型
  // loading
  @observable selectLoading = false
  @observable confirmLoading = false

  @action async getCuser() {
    try {
      const res = await io.getCuser()
      runInAction(() => {
        this.cUser = changeToOptions(toJS(res))('cUserName', 'userId')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async getDataSource() {
    this.selectLoading = true
    try {
      const res = await io.getDataSource()
      runInAction(() => {
        this.selectLoading = false
        this.dataSource = changeToOptions(toJS(res || []))('dataDbName', 'dataStorageId')
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
      await io.editList(trimFormValues(params))
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
      await io.addList(trimFormValues(params))
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
  
  // 重命名校验
  @action async checkName(params, callbak) {
    try {
      const res = await io.checkName(params)
      if (res.isExit) {
        callbak('项目名称已存在')
      } else {
        callbak()
      }
    } catch (e) {
      // ErrorEater(e, '校验失败')
      errorTip(e.message)
    }
  }
}

export default new Store()
