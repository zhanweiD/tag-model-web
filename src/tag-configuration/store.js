import {observable, action, toJS} from 'mobx'
import io from './io'
import {errorTip, successTip} from '../common/util'
import {listToTree} from '../page-map/util'

// for test
async function sleep(delay = 2000) {
  await new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, delay)
  })
}

export default class Store {
  @observable initialList = [] // 第一步拿到的初始数据

  @observable secondTableList = [] // 第二步的表格数据，同时是第一步表格的选中数据

  @observable cateList = [] // 第二步，格式转换后所属类目列表（可直接作为级联选择的options）

  @observable cateMap = {} // 第二步，类目列表id到name的映射对象

  @observable secondSelectedRows = [] // 第二步选中的行数据，用于批量“选择所属类目”

  @observable successResult = {} // 第三步，成功时的数据

  @observable loadings = {
    firstTable: false, // 第一步表格的Loading
    tagSaving: false, // 第二步，保存标签时的加载状态
  }

  // 创建实例时需要传入一些数据
  constructor({
    treeId, objId, storageId, tableName,
  } = {}) {
    this.treeId = treeId // 树节点id
    this.objId = objId // 对象id
    this.storageId = storageId // 数据源id
    this.tableName = tableName // 数据表名
  }


  // 请求初始时的字段列表
  @action async getInitialList() {
    try {
      this.loadings.firstTable = true
      const res = await io.getFieldList({
        objId: this.objId,
        storageId: this.storageId,
        tableName: this.tableName,
      })

      this.initialList = res || []
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.loadings.firstTable = false
    }
  }

  // 请求类目列表
  @action async getCateList() {
    try {
      const res = await io.getCateList({
        treeId: this.treeId,
      }) || []

      // id -> name的映射
      const cateMap = {}

      // 加上value\label属性，用于antd的级联组件
      res.forEach(node => {
        const {id, name} = node
        node.value = id
        node.label = name

        cateMap[id] = name
      })

      this.cateMap = cateMap
      this.cateList = listToTree(res)
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 批量创建标签
  @action async saveTags(successCallback, errorCallack) {
    try {
      await io.saveTags({
        checkList: toJS(this.secondTableList),
      })
      successTip('创建成功')

      successCallback && successCallback()
    } catch (e) {
      errorTip(e.message)

      errorCallack && errorCallack(e)
    }
  }

  // 校验标签是否可创建， params是有需要时自定义的参数，cb是请求成功的回调函数
  @action async checkTagList(params, cb) {
    // 如果只传了一个函数作为参数，说明只给了回调函数（只简单检验一下）
    if (typeof params === 'function') {
      cb = params
      params = undefined
    }

    console.log('checkTagList params', params)

    try {
      const res = await io.checkTagList({
        // 有传入参数，那就用；没有就将当前列表传上去; 注意params需要是原生数组
        checkList: params || toJS(this.secondTableList),
      })

      console.log('checkTagList', res)

      cb && cb()
      
      this.secondTableList = res || []
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 获取成功结果
  @action async getStorageDetail() {
    try {
      const res = await io.getStorageDetail({
        objId: this.objId,
        storageId: this.storageId,
        tableName: this.tableName,
      })
      console.log('getStorageDetail', res)

      this.successResult = res || {}
    } catch (e) {
      errorTip(e.message)
    }
  }
}
