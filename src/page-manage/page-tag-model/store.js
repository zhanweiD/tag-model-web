import intl from 'react-intl-universal'
import {observable, action, runInAction, toJS} from 'mobx'
import {successTip, failureTip, errorTip, listToTree} from '../../common/util'
import io from './io'

class Store {
  @observable typeCode // 实体 vs 关系
  @observable objId // 当前选中对象id
  @observable projectId // 项目id
  @observable tabId // 当前详情tabID

  @observable objType // 实体 vs 简单关系 vs 复杂关系

  //* ------------------------------ 类目树相关 start ------------------------------*//
  @observable searchKey // 类目树搜索值
  @observable treeLoading = false
  @observable expandAll = false
  @observable treeData = [] // 类目树数据
  @observable searchExpandedKeys = [] // 关键字搜索展开的树节点
  @observable currentSelectKeys = undefined // 默认展开的树节点
  // @observable isSelectObj = false
  // 选择对象
  @observable selectObjVisible = false
  @observable selectObjLoading = false
  @observable selectObjConfirmLoading = false
  @observable objCateTree = []
  @observable objCateExpandedKeys = [] // 关键字搜索展开的树节点
  @observable selectedObjList = []
  @observable selectedObjLoading = false

  @observable selectObjUpdateKey = undefined

  @observable tagClassVisible = false
  @observable tagClassObjId // 标签类目选中的对象id
  @observable cateDetail = {} // 类目详情
  @observable defaultCate = {} // 默认类目
  @observable categoryData = [] // 所有类目
  @observable keyword = undefined // 标签列表搜索关键字
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

  // 弹窗移动至
  @observable modalMove = {
    selectKeys: [],
    visible: false,
  }

  @action destory() {
    this.searchKey = undefined
    this.expandAll = false
    this.searchExpandedKeys = []
    this.currentSelectKeys = undefined
  }

  @action findParentId(id, data, expandedKeys) {
    data.forEach(item => {
      if (item.parentId !== 0 && item.id === id) {
        expandedKeys.push(item.parentId)
        this.findParentId(item.parentId, data, this.searchExpandedKeys)
      }
    })
  }

  // @action async getTagCateTree(cb) {
  //   this.treeLoading = true

  //   try {
  //     const res = await io.getTagCateTree({
  //       id: this.tagClassObjId,
  //       searchKey: this.searchKey,
  //     })
  //     runInAction(() => {
  //       this.treeLoading = false
  //       this.searchExpandedKeys.clear()

  //       let data = res

  //       // 判断是否进行搜索
  //       if (this.searchKey) {
  //         data = res.map(item => {
  //           // 关键字搜索定位
  //           if (this.searchKey && item.name.includes(this.searchKey)) {
  //             this.findParentId(item.id, res, this.searchExpandedKeys)
  //           }
  //           return item
  //         })
  //       }

  //       if (!this.currentSelectKeys) {
  //         // 默认类目
  //         [this.defaultCate] = res.filter(d => d.aId === -1)
  //         this.currentSelectKeys = this.defaultCate.id
  //       }
  //       this.categoryData = res.filter(d => d.isLeaf !== 1) // 叶子类目

  //       this.treeData = listToTree(data)
  //     })

  //     if (cb) cb()
  //   } catch (e) {
  //     runInAction(() => {
  //       this.treeLoading = false
  //     })
  //     errorTip(e.message)
  //   }
  // }

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
          successTip(
            intl
              .get(
                'ide.src.page-common.approval.pending-approval.store.voydztk7y5m'
              )
              .d('操作成功')
          )
          // 刷新类目树
          this.getTagCateTree(cb)
        } else {
          failureTip(
            intl
              .get(
                'ide.src.page-manage.page-aim-source.tag-config.store.82gceg0du65'
              )
              .d('操作失败')
          )
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
        successTip(
          intl
            .get(
              'ide.src.page-common.approval.pending-approval.store.voydztk7y5m'
            )
            .d('操作成功')
        )
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

  // @action async getTagCateDetail() {
  //   try {
  //     const res = await io.getTagCateDetail({
  //       id: this.currentSelectKeys,
  //     })
  //     runInAction(() => {
  //       this.cateDetail = res
  //     })
  //   } catch (e) {
  //     errorTip(e.message)
  //   }
  // }

  //* ------------------------------ 类目树相关 end ------------------------------*//
  //* ------------------------------ 对象详情 start ------------------------------*//
  @observable detailLoading = false
  @observable objDetail = {}
  @observable objCard = {}

  @observable objView = {} // 对象视图
  @observable objViewLoading = false // 对象视图
  @observable firstChildrens = [] // 存放第一个孩子集

  @action defaultKey = data => {
    for (const item of data) {
      if (item.children) {
        this.defaultKey(item.children)
      } else if (item.parentId) {
        // 判断条件不定，使用场景有限
        return this.firstChildrens.push(item)
      }
    }
  }

  //* ------------------------------ 对象详情 end ------------------------------*//

  @observable confirmLoading = false
  // 获取对象类目树
  @action async getObjTree(cb) {
    this.treeLoading = true
    this.firstChildrens = []

    try {
      const res = await io.getObjTree({
        type: this.typeCode,
        searchKey: this.searchKey,
        projectId: this.projectId,
      })

      runInAction(() => {
        this.treeLoading = false
        this.searchExpandedKeys.clear()

        let data = res
        this.treeData = listToTree(data)

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

        if (res.length) {
          if (!this.objId || !res.filter(d => +d.aId === +this.objId).length) {
            // const firstObject = res.filter(item => item.parentId !== 0)[0]
            this.defaultKey(toJS(this.treeData))
            const firstObject = this.firstChildrens[0]
            // 默认展开第一个对象
            this.currentSelectKeys = firstObject && firstObject.aId
          } else {
            this.currentSelectKeys = this.objId
          }
        } else {
          this.currentSelectKeys = undefined
          // this.selectObjVisible = true
        }
        // 获取所有类目的数据；用于编辑对象时选择所属类目
        // this.categoryData = res.filter(item => item.parentId === 0)

        if (cb) cb()
      })
    } catch (e) {
      runInAction(() => {
        this.treeLoading = false
      })
      errorTip(e.message)
    }
  }

  // 选择对象类目树
  @action async getObjCate(params) {
    this.selectObjLoading = true
    try {
      const res = await io.getObjCate({
        ...params,
        projectId: this.projectId,
      })

      runInAction(() => {
        // this.selectObjLoading = false
        let data = res
        // 判断是否进行搜索
        if (params.searchKey) {
          data = res.map(item => {
            // 关键字搜索定位
            if (params.searchKey && item.name.includes(params.searchKey)) {
              this.findParentId(item.id, res, this.objCateExpandedKeys)
            }
            return item
          })
        }
        this.objCateTree = listToTree(data)
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.selectObjLoading = false
      })
    }
  }

  /*
   * @description 已选对象列表
   */
  @action async getObjSelectedList(cb) {
    this.selectedObjLoading = true
    try {
      const res = await io.getObjSelectedList({
        projectId: this.projectId,
      })

      runInAction(() => {
        let data = res
        if (data.length) {
          data = res.map(d => ({
            aId: d.id,
            ...d,
          }))
        }
        if (cb) cb(data)
        this.selectedObjList = data
        // this.selectedObjLoading = false
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.selectedObjLoading = false
      })
    }
  }

  /*
   * @description 获取选择对象列表信息加入选择列表
   */
  @action async getObjSelectedDetail(objIds, cb) {
    this.selectedObjLoading = true
    try {
      const res = await io.getObjSelectedDetail({
        objIds,
        projectId: this.projectId,
      })

      runInAction(() => {
        let data = res
        if (data.length) {
          data = res.map(d => ({
            aId: d.id,
            ...d,
          }))
        }
        if (cb) cb(data)
        // this.selectedObjLoading = false
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.selectedObjLoading = false
      })
    }
  }

  /*
   * @description 保存已选对象
   */
  @action async saveSelectedObj(params, cb) {
    this.selectObjConfirmLoading = true
    try {
      const res = await io.saveSelectedObj({
        projectId: this.projectId,
        ...params,
      })

      runInAction(() => {
        if (res.success) {
          successTip(
            intl
              .get(
                'ide.src.page-common.approval.pending-approval.store.voydztk7y5m'
              )
              .d('操作成功')
          )
          this.selectObjVisible = false
        } else {
          failureTip(
            intl
              .get(
                'ide.src.page-manage.page-aim-source.tag-config.store.82gceg0du65'
              )
              .d('操作失败')
          )
        }
        if (cb) cb()
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.selectObjConfirmLoading = false
      })
    }
  }

  /**
   * @description 对象详情
   */
  @action async getObjDetail(cb) {
    const {objId, projectId} = this
    try {
      const res = await io.getObjDetail({
        id: objId,
        projectId,
      })

      runInAction(() => {
        if (projectId !== this.projectId || objId !== this.objId) {
          return
        }
        this.objDetail = res
        if (cb) cb(res)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 移除对象
   */
  @action async removeObj(cb) {
    try {
      const res = await io.removeObj({
        id: this.objDetail.id,
        projectId: this.projectId,
      })

      runInAction(() => {
        if (res.success) {
          successTip(
            intl
              .get(
                'ide.src.page-common.approval.pending-approval.store.voydztk7y5m'
              )
              .d('操作成功')
          )
        } else {
          failureTip(
            intl
              .get(
                'ide.src.page-manage.page-aim-source.tag-config.store.82gceg0du65'
              )
              .d('操作失败')
          )
        }
        if (cb) cb()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 对象配置指标卡
   */
  @action async getObjCard() {
    const {objId, projectId} = this
    try {
      const res = await io.getObjCard({
        id: objId,
        projectId,
      })

      runInAction(() => {
        if (projectId !== this.projectId || objId !== this.objId) {
          return
        }
        this.objCard = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 对象视图
   */
  @action async getObjView(cb) {
    this.objViewLoading = true
    try {
      const res = await io.getObjView({
        id: this.objId,
        projectId: this.projectId,
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

  @observable modelLoading = false
  @observable businessModel = {}

  /**
   * @description 业务视图
   */
  @action async getBusinessModel(cb, params) {
    const {objId, projectId} = this
    
    if (!objId) {
      return
    }
    this.modelLoading = true

    try {
      const res = await io.getBusinessModel({
        id: objId,
        projectId,
        ...params,
      })

      runInAction(() => {
        if (projectId !== this.projectId || objId !== this.objId) {
          return
        }
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

  /**
   * @description 项目下与对象相关的关系对象列表
   */
  @action async getBMRelation(cb) {
    const {objId, projectId} = this
    try {
      const res = await io.getBMRelation({
        id: objId,
        projectId,
      })

      runInAction(() => {
        if (projectId !== this.projectId || objId !== this.objId) {
          return
        }
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

  @observable functionCodes = []

  /**
   * @description 权限code
   */
  @action async getAuthCode() {
    try {
      const res = await io.getAuthCode({
        projectId: this.projectId,
      })

      runInAction(() => {
        this.functionCodes = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
