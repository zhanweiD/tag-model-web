import {
  observable, action, runInAction, toJS,
} from 'mobx'
import {successTip, errorTip, listToTree} from '../common/util'
import io from './io'
import { destroyFns } from 'antd/lib/modal/Modal';

class TagCategoryStore {
  constructor(props) {
    this.props = props
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
    editObject: false,
    editCategory: false,
    editTag: false,
    moveTag: false,
    readCategory: false,
  }

  // 对象详情
  @observable objectDetail = false
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
  @observable relObjectList = []

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
      let res = await io.getCategoryList({
        type: this.typeCode,
        searchKey: this.searchKey,
      })

      runInAction(() => {
        if (!res || !Object.keys(res).length) res = []

        this.treeLoading = false
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
        cb && cb()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 获取关联的对象
  @action async getRelObj(id) {
    try {
      const res = await io.getRelObj({
        id,
      })
      // const res = [
      //   {
      //     id: 1,
      //     createTime: '2019.07.13',
      //     name: '保险产品',
      //     creator: '望舒',
      //     descr: '测试对象',
      //     objType: '人',
      //     objTypeCode: 1,
      //     tagCount: 100,
      //     tenantId: 4,
      //     userId: 1,
      //     isUserd: 0,
      //   },
      //   {
      //     id: 2,
      //     createTime: '2019.07.13',
      //     name: '保险人',
      //     creator: '望舒',
      //     descr: '测试对象1',
      //     objType: '物',
      //     objTypeCode: 2,
      //     tagCount: 1000,
      //     tenantId: 4,
      //     userId: 1,
      //     isUserd: 1,
      //   },
      // ]
      runInAction(() => {
        const arr = res.map(item => ({
          id: item.id,
          name: item.name,
          isUserd: !!item.isUserd,
        }))
        this.relObjectList.replace(arr)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async getCanMoveTree(treeId) {
    try {
      this.detailLoading = true
      const res = await io.getCanMoveTree({
        treeId,
      })
      runInAction(() => {
        this.detailLoading = false
        this.moveTreeData.replace(listToTree(res))
      })
    } catch (e) {
      runInAction(() => {
        this.detailLoading = false
      })
      errorTip(e.message)
    }
  }

  // 类目重命名校验
  @action async checkIsExist(param) {
    let content = ''
    try {
      content = await io.checkIsExist(param)
    } catch (e) {
      errorTip(e.message)
    }

    return content
  }
  
  // 删除节点
  @action async deleteNode(type) {
    try {
      const params = {
        deleteId: this.currentTreeItemKey,
      }
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


  // 对象
  @action async getObjectDetail() {
    try {
      const res = await io.getObjectDetail({
        id: toJS(this.cateList).find(item => item.id === this.currentTreeItemKey).aId,
      })
      runInAction(() => {
        this.objectDetail = res
        this.objectDetail.objIds = _.map(res.objRspList, 'id')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async updateObject(params, cb) {
    this.confirmLoading = true
    try {
      if (!params.id) {
        await io.addObject(params)
      } else {
        await io.editObject(params)
      }
      runInAction(() => {
        successTip('操作成功')
        this.confirmLoading = false
        this.modalVisible.editObject = false
        this.objectDetail = false
        this.getCategoryList()
        cb && cb()
      })
    } catch (e) {
      runInAction(() => {
        this.confirmLoading = false
      })
      errorTip(e.message)
    }
  }
  

  // 类目详情
  @action async getCategoryDetail() {
    try {
      this.detailLoading = true
      const res = await io.getCategoryDetail({
        id: this.currentTreeItemKey,
      })
      runInAction(() => {
        // const res2 = {
        //   id: 9999,
        //   catePath: '客户',
        //   createTime: '2019.07.13',
        //   creator: '望舒',
        //   descr: '测试类目',
        //   name: '望舒测试一级类目',
        //   objType: '人',
        //   objTypeCode: 1,
        //   tenantId: 4,
        //   userId: 1,
        //   level: 1,
        //   parentId: 0,
        // }
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

  @action async updateCategory(params) {
    this.confirmLoading = true
    try {
      if (!params.id) {
        await io.addCategory(params)
      } else {
        await io.editCategory(params)
      }
      runInAction(() => {
        successTip('操作成功')
        this.confirmLoading = false
        this.modalVisible.editCategory = false
        this.objectDetail = false
        return this.getCategoryList()
      })
    } catch (e) {
      runInAction(() => {
        this.confirmLoading = false
      })
      errorTip(e.message)
    }
  }


  // 标签
  @action async getTagDetail(id) {
    try {
      this.detailLoading = true
      const res = await io.getTagDetail({
        id,
      })
      runInAction(() => {
        this.tagDetail = res
        this.detailLoading = false
      })
    } catch (e) {
      runInAction(() => {
        this.detailLoading = false
      })
      errorTip(e.message)
    }
  }

  @action async updateTag(params, cb) {
    this.confirmLoading = true
    try {
      if (!params.id) {
        await io.addTag(params)
      } else {
        await io.editTag(params)
      }
      runInAction(() => {
        successTip('操作成功')
        this.confirmLoading = false
        this.modalVisible.editTag = false
        this.tagDetail = false
        this.getCategoryList()
        cb && cb()
      })
    } catch (e) {
      runInAction(() => {
        this.confirmLoading = false
      })
      errorTip(e.message)
    }
  }

  // 移动至
  @action async moveTag(params) {
    this.confirmLoading = true
    try {
      await io.moveTag(params)
      runInAction(() => {
        successTip('操作成功')
        this.confirmLoading = false
        this.modalVisible.moveTag = false
        this.tagDetail = false
        return this.getCategoryList()
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
