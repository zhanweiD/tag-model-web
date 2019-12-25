import {
  observable, action, runInAction,
} from 'mobx'
import {
  successTip, errorTip, failureTip, listToTree,
} from '../../common/util'
import io from '../io'

class Store {
  @observable objId
  @observable modalSelectTagVisible = false // 选择标签弹窗控制标识

  @observable cateDetail = {} // 类目详情

  @observable treeLoading = false
  @observable confirmLoading = false
  @observable categoryModal = {
    visible: false,
    title: '',
    editType: 'add',
    detail: {},
  }

  // 标签类目树
  @observable searchKey = undefined
  @observable expandAll = false
  @observable treeData = [] // 类目树数据
  @observable searchExpandedKeys = [] // 关键字搜索展开的树节点
  @observable currentSelectKeys = undefined
  @observable defaultCate = {}// 默认类目
  @observable categoryData = [] // 所有类目
  @observable keyword = undefined // 标签列表搜索关键字

  // 选择标签弹窗 - 标签列表
  @observable tagListModal = {
    list: [],
    loading: false,
    currentPage: 1,
    pageSize: 5,
  }

  // 标签列表
  @observable tagList = {
    list: [],
    loading: false,
    currentPage: 1,
    pageSize: 10,
  }

  // 弹窗移动至
  @observable modalMove = {
    selectKeys: [],
    visible: false,
  }


  @action async getTagCateDetail() {
    try {
      const res = await io.getTagCateDetail({
        id: this.currentSelectKeys,
      })
      runInAction(() => {
        this.cateDetail = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async getTagCateTree(cb) {
    this.treeLoading = true

    try {
      const res = await io.getTagCateTree({
        id: this.objId,
        searchKey: this.searchKey,
      })
      runInAction(() => {
        this.treeLoading = false
        this.searchExpandedKeys.clear()

        let data = res

        // 判断是否进行搜索
        if (this.searchKey) {
          data = res.map(item => {
            // 关键字搜索定位
            if (this.searchKey && item.name.includes(this.searchKey)) {
              this.findParentId(item.id, res, this.searchExpandedKeys)
            }
            return item
          })
        }

        if (!this.currentSelectKeys) {
          // 默认类目
          [this.defaultCate] = res.filter(d => d.aId === -1)
          this.currentSelectKeys = this.defaultCate.id
        }
        this.categoryData = res.filter(d => d.isLeaf !== 1) // 叶子类目

        this.treeData = listToTree(data)
      })

      if (cb) cb()
    } catch (e) {
      runInAction(() => {
        this.treeLoading = false
      })
      errorTip(e.message)
    }
  }

  /**
   * @description 添加标签类目
   */
  @action async addNode(params, cb) {
    this.confirmLoading = true
    try {
      const res = await io.addTagCate({
        objId: this.objId,
        ...params,
      })

      runInAction(() => {
        this.confirmLoading = false
        if (res.success) {
          successTip('操作成功')
          // 刷新类目树
          this.getTagCateTree(cb)
        } else {
          failureTip('操作失败')
        }
      })
    } catch (e) {
      runInAction(() => {
        this.confirmLoading = false
      })
      errorTip(e.message)
    }
  }

  /**
   * @description 编辑标签类目
   */
  @action async editNode(params, cb) {
    this.confirmLoading = true
    try {
      await io.editTagCate({
        objId: this.objId,
        ...params,
      })

      runInAction(() => {
        this.confirmLoading = false
        successTip('操作成功')
        // 刷新类目树
        this.getTagCateTree()
        if (cb) cb()
      })
    } catch (e) {
      runInAction(() => {
        this.confirmLoading = false
      })
      errorTip(e.message)
    }
  }

  /**
   * @description 删除标签类目
   * @param {*} params 
   * @param {*} cb 
   */
  @action async delNode(deleteIds, cb) {
    try {
      await io.delTagCate({deleteIds: [deleteIds]})
      successTip('操作成功')
      // 刷新类目树
      this.getTagCateTree()
      if (cb) cb()
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 重名校验
   */
  @action async checkName(params, cb) {
    try {
      const res = await io.checkTagCateName({
        objId: this.objId,
        ...params,
      })
      if (res.success) {
        cb('名称已存在')
      } else {
        cb()
      }
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 标签列表
   */
  @action async getTagList(params, type, cb) {
    if (type === 'modal') {
      this.tagListModal.loading = true
    } else {
      this.tagList.loading = true
    }
    
    try {
      const res = await io.getTagList(params)
      runInAction(() => {
        const data = {
          loading: false,
          list: res.data,
          currentPage: res.currentPage || 1,
          pageSize: res.pageSize || 10,
        }
        if (type === 'modal') {
          this.tagListModal = data
          this.tagListModal.loading = false
        } else {
          this.tagList = data
          this.tagList.loading = false
        }
        if (cb) cb()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 移动标签
   */
  @action async moveTag(params, cb) {
    this.confirmLoading = true
    try {
      const res = await io.moveTag(params)
      runInAction(() => {
        this.confirmLoading = false
        if (res.success) {
          successTip('操作成功')
          if (cb) cb()
        } else {
          failureTip('操作失败')
        }
      })
    } catch (e) {
      runInAction(() => {
        this.confirmLoading = false
      })
      errorTip(e.message)
    }
  }
}

export default new Store()