import {observable, action} from 'mobx'
import io from './io'
import {errorTip} from '../common/util'

class Store {
  @observable initialList = [] // 第一步拿到的初始数据

  @observable secondTableList = [] // 第二步的表格数据，同时是第一步表格的选中数据

  @observable cateList = [] // 第二步，所属类目列表

  @observable secondSelectedRows = [] // 第二步选中的行数据，用于批量“选择所属类目”

  @observable successResult = {} // 第三步，成功时的数据

  @observable loadings = {
    firstTable: false, // 第一步表格的Loading
    secondTable: false, // 第二步表格的Loading
  }


  // 请求初始时的
  @action async getInitialList() {
    try {
      this.loadings.firstTable = true
      const res = await io.getList({
        objId: '',
        storageId: '',
        tableName: '',
      })

      this.initialList = res
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.loadings.firstTable = false
    }
  }
}

export default new Store()
