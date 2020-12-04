import {
  observable, action, runInAction, 
} from 'mobx'
import {successTip, errorTip, listToTree, failureTip} from '../../common/util'
import io from './io'

class Store {
  @observable projectId
  @observable updateDetailKey = undefined
  @observable updateTreeKey = undefined

  @observable addObjectUpdateKey = undefined

  @observable tabId = 0
  // 基本详情
  @observable objId // 对象id
  @observable typeCode // 对象类型
  @observable objDetail = {} // 对象详情
  @observable objCard = {} // 指标卡
  @observable objView = {} // 对象视图
  @observable objViewLoading = false // 对象视图

  @observable loading = false
  @observable releaseLoading = false

  // 标签类目
  @observable tagClassVisible = false
  @observable tagClassObjId // 标签类目选中的对象id
  @observable cateDetail = {} // 类目详情
  @observable searchExpandedKeys = [] // 关键字搜索展开的树节点
  @observable categoryData = [] // 所有类目
  @observable treeData = [] // 类目树数据
  @observable currentSelectKeys = undefined
  @observable categoryModal = {
    visible: false,
    title: '',
    editType: 'add',
    detail: {},
  }

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

  /*
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
          pageSize: res.pages || 10,
          total: res.totalCount,
        }
        if (type === 'modal') {
          this.tagListModal = data
        } else {
          this.tagList = data
        }
        if (cb) cb()
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        if (type === 'modal') {
          this.tagListModal.loading = false
        } else {
          this.tagList.loading = false
        }
      })
    }
  }
  
  @action findParentId(id, data, expandedKeys) {
    data.forEach(item => {
      if (item.parentId !== 0 && item.id === id) {
        expandedKeys.push(item.parentId)
        this.findParentId(item.parentId, data, this.searchExpandedKeys)
      }
    })
  }
    // 项目列表
    @action async getProjects(cb) {
    try {
      const res = await io.getProjects({})
      this.isProject = res.length > 0
      runInAction(() => {
        cb(this.isProject)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async getTagCateTree(cb) {
      this.treeLoading = true

      try {
        const res = await io.getTagCateTree({
          id: this.tagClassObjId,
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

    @observable modalMove = {
      selectKeys: [],
      visible: false,
    }
  
    /*
     * @description 添加标签类目
     */
    @action async addNode(params, cb) {
      this.confirmLoading = true
      try {
        const res = await io.addTagCate({
          objId: this.tagClassObjId,
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
  
    /*
     * @description 编辑标签类目
     */
    @action async editNode(params, cb) {
      this.confirmLoading = true
      try {
        await io.editTagCate({
          objId: this.tagClassObjId,
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
    /*
     * @description 重名校验
     */
    @action async checkName(params, cb) {
      try {
        const res = await io.checkTagCateName({
          objId: this.tagClassObjId,
          ...params,
        })
        runInAction(() => {
          if (res.success) {
            cb('名称已存在')
          } else {
            cb()
          }
        })
      } catch (e) {
        errorTip(e.message)
      }
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

  @action async getObjDetail() {
      this.loading = true
      try {
        const res = await io.getObjDetail({
          id: this.objId,
        })
        runInAction(() => {
          this.loading = false
          this.objDetail = res
        })
      } catch (e) {
        errorTip(e.message)
      }
    }

  @action async getObjCard() {
    try {
      const res = await io.getObjCard({
        id: this.objId,
      })
      runInAction(() => {
        this.objCard = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 对象视图
  @action async getObjView(cb) {
    this.objViewLoading = true
    try {
      const res = await io.getObjView({
        id: this.objId,
      })
      runInAction(() => {
        this.objView = res
        if (cb) cb()
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.objViewLoading = false
      })
    }
  }

  @action async changeObjStatus(status, cb) {
    this.releaseLoading = true
    try {
      await io.changeObjStatus({
        id: this.objId,
        status,
      })
      runInAction(() => {
        successTip('操作成功')
        this.releaseLoading = false
        if (cb) cb()
      })
    } catch (e) {
      runInAction(() => {
        // failureTip('操作失败')
        this.releaseLoading = false
      })
      errorTip(e.message)
    }
  }


  /*
   * @description 业务视图
   */

  @observable modelLoading = false
  @observable businessModel = []
  
  @action async getBusinessModel(cb, params) {
    this.modelLoading = true
    try {
      const res = await io.getBusinessModel({
        id: this.objId,
        ...params,
      })

      runInAction(() => {
        const data = this.getLinksObj(res.links, res.obj)
        this.businessModel = data
        if (cb) cb()
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.modelLoading = false
      })
    }
  }

  @observable relList = [] // 项目下与对象相关的关系对象列表

  /*
   * @description 项目下与对象相关的关系对象列表
   */
  @action async getBMRelation(cb) {
    try {
      const res = await io.getBMRelation({
        id: this.objId,
      })
      runInAction(() => {
        this.relList = res
        if (cb) cb(res)
      })
    } catch (e) {
      errorTip(e.message)
    } 
  }

  getLinksObj = (links, obj) => {
    if (!links.length) return {links: [], obj}
    if (obj.length === 1) return {links: [], obj}

    const relObj = obj.filter(d => d.objTypeCode === 3)[0]
    const relObjTag = relObj.tag.map(d => d.id)

    let relObjInx

    for (let index = 0; index < obj.length; index += 1) {
      if (obj[index].objTypeCode === 3) {
        relObjInx = index
      }
    }

    const resObj = obj
    
    if (relObjInx === 0) {
      resObj.push(resObj.shift())
    }

    const resLinks = links.map(d => ({
      source: d.u,
      // target: d.relationId,
      target: d.v, // TODO: 不确定啊
      sourceIndex: 0,
      targetIndex: relObjTag.indexOf(d.v) + 1,
      value: 1,
    }))

    return {
      links: resLinks,
      obj: resObj,
    }
  }
}

export default new Store()
