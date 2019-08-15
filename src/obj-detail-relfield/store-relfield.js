import {
  observable, action, runInAction, toJS,
} from 'mobx'
import {successTip, errorTip} from '../common/util'
import io from './io'

class RelfieldStore {
  // 查询条件
  @observable status = ''
  @observable keyword = ''
  // @observable order = ''
  // @observable sort = ''

  // 对象存储信息
  @observable tableLoading = false
  @observable list = []
  @observable pagination = {
    pageSize: 10,
    currentPage: 1,
    count: 0,
  }


  @action async getList() {
    try {
      this.tableLoading = true
      const res2 = await io.getList({
        // objId: this.id,
        status: this.status,
        keyword: this.keyword,
        // order: this.order,
        // sort: this.sort,
        currentPage: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
      })
      const res = {"data":[{"isUsed":0,"associatedField":1,"configuredField":0,"dataTableName":"demo","storageTypeName":"Hive数据源","dataDbType":4,"dataDbName":"hive_default_hy项目_dev","dataStorageId":"1559877138336fz68","id":5608992670692608}],"hasNextPage":false,"hasPreviousPage":false,"isLastPage":false,"isFirstPage":true,"pages":1,"pageSize":10,"currentPage":1,"totalCount":1}
      runInAction(() => {
        this.tableLoading = false
        this.list.replace(res.data)
        this.pagination.count = res.totalCount
        this.pagination.currentPage = res.currentPage
        this.pagination.pageSize = res.pageSize
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action.bound handleChange = (pagination, filters, sorter) => {
    this.pagination.currentPage = pagination.current
    // this.order = sorter.order === 'descend' ? 'DESC' : 'ASC'
    // this.sort = sorter.columnKey
    this.getList()
  }

  @action async delObjFieldRel(storageId, tableName) {
    try {
      await io.delObjFieldRel({
        // objId: this.id,
        // storageId,
        // tableName,
      })
      runInAction(() => {
        successTip('移除成功')
        this.getList()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new RelfieldStore()
