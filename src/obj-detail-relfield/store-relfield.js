import {
  observable, action, runInAction, toJS,
} from 'mobx'
import {successTip, errorTip, listToTree} from '../common/util'
import io from './io'

class RelfieldStore {
  @observable defaultCateId = undefined // 默认类目的id，如果标签没有选择类目，那么就放在默认类目下

  id = undefined

  // 查询条件
  @observable isConfigured = ''
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
      const res = await io.getList({
        objId: this.id,
        isConfigured: this.isConfigured,
        keyword: this.keyword,
        // order: this.order,
        // sort: this.sort,
        currentPage: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
      })
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

  @action async delObjFieldRel(o, cb) {
    try {
      await io.delObjFieldRel({
        objId: this.id,
        storageId: o.dataStorageId,
        tableName: o.dataTableName,
        fieldName: o.dataFieldName,
        tagId: o.tagId,
      })
      runInAction(() => {
        successTip('移除成功')
        this.getList()
        cb && cb()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }


  @action async saveTags(checkList, cb) {
    try {
      await io.saveTags({
        checkList,
      })
      runInAction(() => {
        successTip('配置成功')
        this.getList()
        cb && cb()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }


  @observable detailLoading = false
  @observable moveTreeData = []
  @action async getCanMoveTree(treeId) {
    try {
      this.detailLoading = true
      const res = await io.getCanMoveTree({
        treeId,
      })
      runInAction(() => {
        // 默认类目
        let defaultCate = {}

        // 加上value\label属性，用于antd的级联组件
        res.forEach(node => {
          const {id, name} = node
          node.value = id
          node.label = name

          if (node.aId === -1) {
            defaultCate = node
          }
        })

        this.defaultCateId = defaultCate.id
        this.moveTreeData.replace(listToTree(res))
        this.detailLoading = false
      })
    } catch (e) {
      runInAction(() => {
        this.detailLoading = false
      })
      errorTip(e.message)
    }
  }
}

export default new RelfieldStore()
