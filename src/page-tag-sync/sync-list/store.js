import {
  action, runInAction, observable,
} from 'mobx'
import {successTip, errorTip, changeToOptions} from '../../common/util'
import {ListContentStore} from '../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getList) {
  projectId
  @observable visible = false

  @observable list = []

  @action.bound closeDrawer() {
    this.visible = false
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

  // 删除
  @action async delList(id) {
    try {
      await io.delList({id})
      runInAction(() => {
        successTip('删除成功')
        this.getList({currentPage: 1})
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 启动
  @action async startSync(id) {
    try {
      await io.startSync({id})
      runInAction(() => {
        this.getList()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 暂停
  @action async pauseSync(id) {
    try {
      await io.pauseSync({id})
      runInAction(() => {
        this.getList()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 执行
  @action async runSync(id) {
    try {
      await io.runSync({id})
      runInAction(() => {
        this.getList()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable submitLog = ''
  // 获取提交日志
  @action async getLog(id) {
    try {
      const res = await io.getLog({id})
      runInAction(() => {
        this.submitLog = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
