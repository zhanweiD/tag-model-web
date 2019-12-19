/**
 * @description 列表store 备用；
 * @description 此方法采用高阶函数 合并store
 * @author  mahua
 */
import {observable, action, runInAction} from 'mobx'
import {successTip, errorTip} from '../../common/util'
import ioContext from '../../common/io-context'

export default function combineStore(store, api, apiName) {
  class CombineStore extends store {
    // 列表内容
    @observable list = []
    // 加载标识
    @observable tableLoading = false
  
    // 列表默认创建时间排序
    @observable tableSorter = {
      order: 'DESC', // 排序方式
      sort: 'ctime', // 排序字段
    }
  
    // 列表分页信息
    @observable pagination = {
      pageSize: 10,
      currentPage: 1,
      count: 0,
    }

    /**
     * 分页操作函数
     * @param {number} curPage   
     * @param {number} pageSize
     */
    @action.bound handlePageChange(curPage, pageSize) {
      this.pagination = {
        pageSize,
        currentPage: curPage,
      }
      this.getList()
    }
    
    /**
     * 表格操作函数
     * @param {number} curPage   
     * @param {number} pageSize
     */
    @action.bound handleTableChange(pagination, filters, sorter) {
      const {order, columnKey} = sorter

      this.tableSorter = {
        order: order === 'descend' ? 'DESC' : 'ASC',
        sort: columnKey,
      }
      this.getList()
    }
  
    /**
     * 获取列表内容
     * @param {object} params
     */
    @action async getList(params) {
      try {
        this.tableLoading = true
        const res = await ioContext.api[api][apiName]({
          ...this.tableSorter,
          pageSize: this.pagination.pageSize,
          currentPage: this.pagination.currentPage,
          ...params,
        })
        runInAction(() => {
          const {
            data = [], totalCount, pageSize, currentPage,
          } = res
          this.tableLoading = false
          this.list.replace(data)
  
          this.pagination = {
            pageSize,
            total: totalCount,
            current: currentPage,
          }
        })
      } catch (e) {
        errorTip(e.message)
      }
    }
  }

  return new CombineStore()
}
