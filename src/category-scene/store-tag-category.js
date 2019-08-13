import {
  observable, action, runInAction, toJS,
} from 'mobx'
import {destroyFns} from 'antd/lib/modal/Modal'
import {successTip, errorTip, listToTree} from '../common/util'
import io from './io'

class TagCategoryStore {
  constructor(props) {
    this.props = props
    // 场景id
    this.sceneId = props.sceneId
  }

  @observable id = undefined
  @observable typeCode = undefined

  @observable cateList = [] // 类目列表(平铺)
  @observable treeData = [] // 类目列表(树结构)

  @observable isLoading = false // 获取类目树
  @observable expandAll = false // 是否展开全部树节点
  @observable searchExpandedKeys = [] // 关键字搜索展开的树节点

  @observable searchKey = undefined // 类目搜索关键词
  @observable currentTreeItemKey = false // 当前的类目key

  // 编辑状态
  @observable eStatus = {
    editObject: true,

    editCategory: false,
    editTag: false,
    moveTag: false,
  }

  // 弹窗显示控制
  @observable modalVisible = {
    // 对象操作弹窗标识
    editObject: false,
    // 类目操作弹窗标识
    editCategory: false,
    editTag: false,
    readCategory: false,

    // 选择标签弹窗标识
    selectTag: false,
  }

  // 选择对象
  @observable selectObj = []

  // 选择标签 - 树结构 
  @observable selectTagTreeData = []
  @observable selectTagList = []

  // 对象详情
  // @observable objectDetail = false

  // 类目详情
  @observable cateDetail = false
  // 标签详情
  @observable tagDetail = false

  // 弹框loading
  @observable detailLoading = false
  @observable confirmLoading = false

  // 可移动的标签类目树
  @observable moveTreeData = []

  // 获取关联的对象
  // @observable relObjectList = []

  @action destory() {
    this.expandAll = false
    this.searchExpandedKeys = []
    this.searchKey = undefined
    this.currentTreeItemKey = false
  }

  @action findParentId(id, data, expandedKeys) {
    data.forEach(item => {
      if (item.parentId !== 0 && item.id === id) {
        expandedKeys.push(item.parentId)
        this.findParentId(item.parentId, data, this.searchExpandedKeys)
      }
    })
  }

  // 获取类目数据
  @action.bound async getCategoryList(cb) {
    try {
      this.isLoading = true
      let res = []

      if (this.searchKey) {
        res = await io.searchCategory({
          occasionId: this.sceneId,
          searchKey: this.searchKey,
        })
      } else {
        res = await io.getCategoryList({
          occasionId: this.sceneId,
        })
      }
      

      runInAction(() => {
        this.isLoading = false
        this.searchExpandedKeys.clear()

        const data = res.map(item => {
          // 关键字搜索定位
          if (this.searchKey && item.name.includes(this.searchKey)) {
            this.findParentId(item.id, res, this.searchExpandedKeys)
          }
          return item
        })

        this.cateList.replace(data)
        this.treeData.replace(listToTree(data))
        if (cb) cb()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 选择对象 - 下拉框内容 
  @action async getSelectObj() {
    try {
      const res = await io.getSelectObj({
        occasionId: this.sceneId,
        searchKey: this.searchKey,
      })

      runInAction(() => {
        this.selectObj.replace(res)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 选择对象 - 保存
  @action async saveObj(params) {
    try {
      await io.saveObj({
        occasionId: this.sceneId,
        ...params,
      })

      runInAction(() => {
        // successTip("操作成功")
        this.modalVisible.editObject = false
        // 刷新类目树 ？ 
        this.getCategoryList()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 类目 - 类目详情
  @action async getCategoryDetail() {
    try {
      this.detailLoading = true
      const res = await io.getCategoryDetail({
        occasionId: this.sceneId,
        catId: this.currentTreeItemKey,
      })
      runInAction(() => {
        this.cateDetail = res
        this.detailLoading = false
      })
    } catch (e) {
      runInAction(() => {
        this.detailLoading = false
      })
      errorTip(e.message)
    }
  }

  // 类目 - 更新类目(添加 / 编辑)
  @action async updateCategory(param, parentIsObj) {
    const params = {
      occasionId: this.sceneId,
      ...param,
    }
    this.confirmLoading = true
    console.log(parentIsObj, params)
    try {
      // 编辑类目
      if (this.eStatus.editCategory) {
        await io.editCategory(params)
      } else if (parentIsObj) {
        // 对象-添加类目
        await io.addObjCategory(params)
      } else {
        // 类目-添加类目
        await io.addCategory(params)
      }

      runInAction(() => {
        successTip('操作成功')
        this.confirmLoading = false
        this.modalVisible.editCategory = false
        // this.objectDetail = false
        return this.getCategoryList()
      })
    } catch (e) {
      runInAction(() => {
        this.confirmLoading = false
      })
      errorTip(e.message)
    }
  }

  // 对象/类目/标签 - 删除节点
  @action async deleteNode(type) {
    try {
      const params = {
        occasionId: this.sceneId,
        catId: this.currentTreeItemKey,
      }

      // type: 0 标签 1 类目 2 对象
      if (type === 2) {
        await io.deleteObject(params)
      } else if (type === 1) {
        await io.deleteCategory(params)
      } else {
        await io.deleteTag(params)
      }
      runInAction(() => {
        successTip('删除成功')
        this.getCategoryList()

        // // 如果要删除的节点和当前选中的是同一个, 则要跳转路由，且清空选中节点
        // if (this.cateId !== this.currentTreeItemKey) {
        //   this.getCategoryList(() => {
        //     // 父类目、跨父类目删除
        //     if (!toJS(this.cateList).filter(item => item.id === this.cateId).length) {
        //       this.props.history.push('/-1')
        //     }
        //   })
        // } else {
        //   this.props.history.push('/-1')
        //   this.getCategoryList()
        // }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 类目重命名校验
  @action async checkIsExist(param) {
    let content = ''
    try {
      content = await io.checkIsExist({
        occasionId: this.sceneId,
        ...param,
      })
    } catch (e) {
      errorTip(e.message)
    }
    return content
  }

  // 标签 - 选择标签树结构
  @action async getSelectTag() {
    try {
      this.detailLoading = true
      const res = await io.selectTag({
        occasionId: this.sceneId,
        catId: this.currentTreeItemKey,
      })
      runInAction(() => {
        this.selectTagTreeData.replace(res)
        this.selectTagList.replace(listToTree(res))
        this.detailLoading = false
      })
    } catch (e) {
      runInAction(() => {
        this.detailLoading = false
      })
      errorTip(e.message)
    }
  }

  // 标签 - 选择标签保存
  @action async saveTag(param, cb) {
    try {
      this.confirmLoading = true
      await io.saveTag({
        occasionId: this.sceneId,
        catId: this.currentTreeItemKey,
        tagIdList: param,
      })
      runInAction(() => {
        if (cb) cb()
        successTip('操作成功')
        this.confirmLoading = false
        this.getCategoryList()
      })
    } catch (e) {
      runInAction(() => {
        this.confirmLoading = false
      })
      errorTip(e.message)
    }
  }

  //   @action async getCanMoveTree() {
  //    try {
  //      this.detailLoading = true
  //      const res2 = await io.getRelObj({
  //        id: 2,
  //      })
  //      const res = [
  //        {
  //          id: 1,
  //          aId: 1,
  //          type: 2,
  //          position: 0,
  //          objTypeCode: 1,
  //          name: '客户',
  //          enName: 'customer',
  //          parentId: 0,
  //          isLeaf: 0,
  //          canEdit: 1,
  //          canDelete: 1,
  //          canAddTag: 0,
  //          canAddCate: 1,
  //          tagCount: 100,
  //        },
  //        {
  //          id: 2,
  //          aId: -1,
  //          type: 1,
  //          position: 0,
  //          objTypeCode: 1,
  //          name: '默认类目',
  //          enName: 'default_cate',
  //          parentId: 1,
  //          isLeaf: 2,
  //          canEdit: 0,
  //          canDelete: 0,
  //          canAddTag: 1,
  //          canAddCate: 0,
  //          tagCount: 0,
  //        },
  //      ]
  //      runInAction(() => {
  //        this.detailLoading = false
  //        this.moveTreeData.replace(listToTree(res))
  //      })
  //    } catch (e) {
  //      errorTip(e.message)
  //    }
  //  }

  // 场景-树-对象；没有查看对象详情
  // @action async getObjectDetail() {
  //   try {
  //     const res = await io.getObjectDetail({
  //       id: toJS(this.cateList).find(item => item.id === this.currentTreeItemKey).aId,
  //     })
  //     runInAction(() => {
  //       const res2 = {
  //         createTime: '2019.07.13',
  //         name: '客户',
  //         enName: 'sdfsdfsdf',
  //         id: 99999,
  //         creator: '望舒',
  //         descr: '测试对象',
  //         objType: '人',
  //         objTypeCode: 1,
  //         tagCount: 100,
  //         tenantId: 4,
  //         userId: 1,
  //         objIds: [2],
  //       }
  //       this.objectDetail = res2
  //     })
  //   } catch (e) {
  //     errorTip(e.message)
  //   }
  // }

  // @action async updateObject(params) {
  //   this.confirmLoading = true
  //   try {
  //     if (params.id) {
  //       await io.addObject(params)
  //     } else {
  //       await io.editObject(params)
  //     }
  //     runInAction(() => {
  //       successTip('操作成功')
  //       this.confirmLoading = false
  //       this.modalVisible.editObject = false
  //       // this.objectDetail = false
  //       return this.getCategoryList()
  //     })
  //   } catch (e) {
  //     runInAction(() => {
  //       this.confirmLoading = false
  //     })
  //     errorTip(e.message)
  //   }
  // }


  // 标签详情
  //   @action async getTagDetail() {
  //    try {
  //      this.detailLoading = true
  //      const res = await io.getTagDetail({
  //        id: this.currentTreeItemKey,
  //      })
  //      runInAction(() => {
  //        const res2 = {
  //          id: 99999,
  //          createTime: '2019.07.13',
  //          creator: '望舒',
  //          dataSource: 'ws_hive',
  //          descr: '测试类目',
  //          enName: 'demo_type',
  //          fieldName: 'type',
  //          isEnum: 1,
  //          name: '望舒测试一级类目',
  //          objType: '人',
  //          objTypeCode: 1,
  //          tableName: 'demo',
  //          tenantId: 4,
  //          userId: 1,
  //          valueName: '文本型',
  //          valueType: 1,
  //        }
  //        this.tagDetail = res2
  //        this.detailLoading = false
  //      })
  //    } catch (e) {
  //      runInAction(() => {
  //        this.detailLoading = false
  //      })
  //      errorTip(e.message)
  //    }
  //  }

  //   @action async updateTag(params) {
  //    this.confirmLoading = true
  //    try {
  //      if (params.id) {
  //        await io.addTag(params)
  //      } else {
  //        await io.editTag(params)
  //      }
  //      runInAction(() => {
  //        successTip('操作成功')
  //        this.confirmLoading = false
  //        this.modalVisible.editTag = false
  //        this.tagDetail = false
  //        return this.getCategoryList()
  //      })
  //    } catch (e) {
  //      runInAction(() => {
  //        this.confirmLoading = false
  //      })
  //      errorTip(e.message)
  //    }
  //  }

  // 移动至
  // @action async moveTag(params) {
  //   this.confirmLoading = true
  //   try {
  //     await io.moveTag(params)
  //     runInAction(() => {
  //       successTip('操作成功')
  //       this.confirmLoading = false
  //       this.modalVisible.moveTag = false
  //       this.tagDetail = false
  //       return this.getCategoryList()
  //     })
  //   } catch (e) {
  //     runInAction(() => {
  //       this.confirmLoading = false
  //     })
  //     errorTip(e.message)
  //   }
  // }
}

export default TagCategoryStore
