/**
 * 类目树 store
 */

import {
  observable, action, runInAction,
} from 'mobx'
import {
  successTip, failureTip, errorTip, listToTree,
} from '../../common/util'

import io from '../io'

class Store {
  typeCode
  objId

  @observable searchKey // 类目树搜索值
  @observable treeLoading = false

  @observable expandAll = false
  @observable treeData = [] // 类目树数据
  @observable categoryData = [] // 所有类目数据
  @observable searchExpandedKeys = [] // 关键字搜索展开的树节点
  @observable relToEntityData = [] // 添加关系对象时选择 关联的实体对象类目树数据
  @observable currentSelectKeys = undefined// 默认展开的树节点

  // modal
  @observable confirmLoading = false

  // 类目 —— 添加/编辑/查看详情
  @observable categoryModal = {
    visible: false,
    editType: undefined, // 添加/编辑
    type: undefined, // 编辑弹窗:modal / 详情:detail
    detail: {},
  }

  // 对象 —— 添加/编辑
  @observable objModal = {
    visible: false,
    editType: undefined, // 添加/编辑
    type: undefined, // 编辑弹窗:modal / 详情:detail
    detail: {},
  }

  // 对象 —— 移动至
  @observable moveModal = {
    visible: false,
    detail: {},
  }

  @action destory() {
    this.searchKey = undefined
    this.expandAll = false
    this.searchExpandedKeys = []
    this.currentSelectKeys = undefined
    // this.currentTreeItemKey = false
    // this.currSelectCategory = undefined
  }

  @action findParentId(id, data, expandedKeys) {
    data.forEach(item => {
      if (item.parentId !== 0 && item.id === id) {
        expandedKeys.push(item.parentId)
        this.findParentId(item.parentId, data, this.searchExpandedKeys)
      }
    })
  }

  /**
   * @description 获取对象类目树
   */
  @action async getObjTree(cb) {
    this.treeLoading = true

    try {
      const res = await io.getObjTree({
        type: this.typeCode,
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

        if (!this.objId) {
          const firstObject = res.filter(item => item.parentId !== 0)[0]
          // 默认展开第一个对象
          this.currentSelectKeys = firstObject && firstObject.aId
          this.objId = firstObject && firstObject.aId
        } else {
          this.currentSelectKeys = this.objId
        }
       
        // 获取所有类目的数据；用于编辑对象时选择所属类目
        this.categoryData = res.filter(item => item.parentId === 0)
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
   * @description 添加对象类目 & 添加对象
   */
  @action async addNode(data, type, cb) {
    this.confirmLoading = true
    try {
      const params = {
        objTypeCode: this.typeCode,
        ...data,
      }
      if (type === 'obj') {
        await io.addObject(params)
      } else {
        await io.addObjCate(params)
      }

      runInAction(() => {
        this.confirmLoading = false
        successTip('操作成功')
        // 刷新类目树
        this.getObjTree(cb)
      })
    } catch (e) {
      runInAction(() => {
        this.confirmLoading = false
      })
      errorTip(e.message)
    }
  }

  /**
   * @description 编辑对象类目 && 编辑对象
   */
  @action async editNode(data, type, cb) {
    this.confirmLoading = true
    try {
      const params = {
        objTypeCode: this.typeCode,
        ...data,
      }

      if (type === 'obj') {
        await io.editObject(params)
      } else {
        await io.editObjCate(params)
      }

      runInAction(() => {
        this.confirmLoading = false
        successTip('操作成功')
        // 刷新类目树
        this.getObjTree()
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
   * @description 删除对象类目 & 删除对象
   * @param {*} params 
   * @param {*} cb 
   */
  @action async delNode(deleteIds, type, cb) {
    try {
      if (type === 'obj') {
        await io.delObject({deleteIds: [deleteIds]})
      } else {
        await io.delObjCate({deleteIds: [deleteIds]})
      }
      successTip('操作成功')
      if (cb) cb()
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 类目详情
   */
  @action async getCateDetail(id) {
    try {
      const res = await io.getCateDetail({id})
      this.categoryModal.detail = res
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 对象详情
   */
  @action async getObjDetail(id) {
    try {
      const res = await io.getObjDetail({id})
      this.objModal.detail = res
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 对象移动
   */
  @action async moveObject(params, cb) {
    try {
      const res = await io.moveObject(params)
      if (res.success) {
        successTip('操作成功')
        // 刷新类目树
        this.getObjTree()
      } else {
        failureTip('操作失败')
      }
      if (cb)cb()
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 添加关系对象时 选择关联的实体对象的类目树数据
   */
  @action async getRelToEntityData() {
    try {
      const res = await io.getRelToEntityData()
      this.relToEntityData = listToTree(res)
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 重名校验
   */
  @action async checkName(params, cb) {
    try {
      const res = await io.checkName({
        objTypeCode: this.typeCode,
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
}

export default new Store()
