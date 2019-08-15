import {observable, action} from 'mobx'
import io from './io'
import {errorTip} from '../common/util'

class Store {
  @observable tableList = [] // 表格数据

  @observable cateList = [] // 所属类目列表


  // 请求初始时的
  @action async getTableList() {
    try {
      const res = await io.getList({
        objId: '',
        storageId: '',
        tableName: '',
      })

      this.tableList = res
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
