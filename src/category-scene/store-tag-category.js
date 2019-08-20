import {
  observable, action, runInAction, toJS,
} from 'mobx'
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

  @observable treeLoading = false // 获取类目树
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

  // 所有标签
  @observable selectTagData = []

  // 树结构数据
  @observable selectTagTreeData = []

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
      this.treeLoading = true
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
  @action async deleteNode(type, cb) {
    try {
      // type: 0 标签 1 类目 2 对象
      if (type === 2) {
        await io.deleteObject({
          occasionId: this.sceneId,
        })
      } else if (type === 1) {
        await io.deleteCategory({
          occasionId: this.sceneId,
          catId: this.currentTreeItemKey,
        })
      } else {
        await io.deleteTag({
          occasionId: this.sceneId,
          tagId: this.currentTreeItemKey,
        })
      }
      runInAction(() => {
        successTip('删除成功')
        this.getCategoryList(() => {
          // 删除标签重新请求 场景详情 因为场景详情里面有 标签数这个扑街
          if (cb) cb()
        })
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
  @action async checkIsExist(params, cb) {
    try {
      const res = await io.checkIsExist({
        occasionId: this.sceneId,
        ...params,
      })

      runInAction(() => {
        if (cb) cb(res)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 标签 - 选择标签树结构
  @action async getSelectTag() {
    this.selectTagData.clear()
    this.selectTagTreeData.clear()

    try {
      this.detailLoading = true
      const res = await io.selectTag({
        occasionId: this.sceneId,
        catId: this.currentTreeItemKey,
      })
      runInAction(() => {
        this.selectTagData.replace(res)
        this.selectTagTreeData.replace(listToTree(res))
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
    this.confirmLoading = true
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
        this.modalVisible.selectTag = false
        this.getCategoryList()
      })
    } catch (e) {
      runInAction(() => {
        this.confirmLoading = false
      })
      errorTip(e.message)
    }
  }
}

export default TagCategoryStore
