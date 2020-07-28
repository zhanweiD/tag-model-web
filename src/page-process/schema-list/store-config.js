import {
  action, runInAction, observable, toJS,
} from 'mobx'
import {
  successTip, failureTip, errorTip, changeToOptions, listToTree,
} from '../../common/util'
import io from './io'

export default class Store {
  @observable processId = 0 // 加工方案id
  @observable projectId = 0 // 项目id
  @observable tagId = 0 // 要配置的标签id
  @observable ownObject = 0 // 所属对象id
  @observable configNum = 0 // 已配置个数
  @observable currentStep = 0 // 抽屉步骤条
  @observable tabValue = 1 // tab
  @observable fieldName = '' // 搜索字段名称

  @observable configDrawerVisible = false // 配置抽屉显示
  @observable disNext = true // 禁止下一步
  @observable release = false // 是否已发布
  @observable isConfig = false // 是否已配置
  @observable isEnum = false // 是否枚举
  @observable isNewTag = true // 是否新建标签
  @observable tableLoading = false // 列表加载

  @observable tagBaseInfo = {} // 衍生标签详情
  @observable form // form 表单
  @observable recordObj = {} // 点击的字段
  @observable list = [] // 字段列表
  @observable allList = [] // 全部字段列表
  @observable noConfigList = [] // 保存配置前列表信息列表
  @observable configList = [] // 已配置字段列表
  @observable noConList = [] // 未配置字段列表
  @observable previews = [] // 预览列表
  @observable tagList = [] // 衍生标签列表
  @observable tagCateSelectList = [] // 类目列表
  @observable pagination = {
    pageSize: 9999,
    currentPage: 1,
    totalCount: 0,
  }

  @action resetData = () => {
    this.configList = [] // 已配置字段列表
    this.noConList = [] // 未配置字段列表
    this.tabValue = 1 
    this.configNum = 0
  }

  // tab切换更新列表
  @action tabChange = v => {
    const {allList, noConList, configList} = this
    this.tabValue = v
    switch (v) {
      case 1:
        this.list = allList
        this.pagination.totalCount = allList.length
        break
      case 2:
        this.list = configList
        this.pagination.totalCount = configList.length
        break
      default:
        this.list = noConList
        this.pagination.totalCount = noConList.length
        break
    }
    this.recordObj = {}
  }
  
  // 保存配置前字段分页列表信息， 只在初次打开抽屉使调用，只用于存储信息
  @action async getNoConList() {
    this.noConfigList = []
    try {
      const res = await io.getFieldList({
        id: this.processId,
        fieldName: this.fieldName,
      })
      runInAction(() => {
        this.noConfigList = res || []
      })
    } catch (e) {
      console.log(e.message)
    }
  }

  // 获取字段分页列表
  @action async getList() {
    this.resetData()
    this.tableLoading = true

    try {
      const res = await io.getFieldList({
        id: this.processId,
        fieldName: this.fieldName,
      })

      runInAction(() => {
        this.previews = this.allList = res || []
        this.list = this.allList
        this.list.forEach(item => {
          if (item.tagFieldId) {
            this.configList.push(item)
            this.configNum++
          } else {
            this.noConList.push(item)
          }
        })

        this.pagination.totalCount = res.length
        this.tableLoading = false
      })
    } catch (e) {
      this.tableLoading = false
      errorTip(e.message)
    }
  }

  // 预览页面数组
  @action nextList = () => {
    for (let i = 0; i < this.noConfigList.length; i++) {
      this.previews[i].bfieldName = this.noConfigList[i].fieldName
      this.previews[i].btagEnName = this.noConfigList[i].tagEnName
      this.previews[i].btagName = this.noConfigList[i].tagName
      this.previews[i].btagFieldId = this.noConfigList[i].tagFieldId
    }
    this.list = this.previews.filter(item => item.tagFieldId || item.btagFieldId)
    this.pagination.totalCount = this.list.length
  }

  // 新建标签
  @action async createTag(params) {
    this.confirmLoading = true
    try {
      const res = await io.createTag({
        projectId: this.projectId,
        ...params,
        objId: this.ownObject,
        configType: 1,
      })
      runInAction(() => {
        if (res) {
          successTip('新建标签成功')
          this.tagId = res
          this.saveTagRelation()
        } else {
          failureTip('新建标签失败')
        }
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.confirmLoading = false
    }
  }

  // 获取衍生标签详情
  @action async getTagBaseDetail() {
    try {
      const res = await io.getTagBaseDetail({
        id: this.recordObj.tagId || this.tagId,
      })
      runInAction(() => {
        this.tagBaseInfo = res
        this.isEnum = res.isEnum
        this.form.resetFields()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 获取类目列表
  @action async getTagCateSelectList() {
    try {
      const res = await io.getTagCateSelectList({
        id: this.ownObject,
      })
      runInAction(() => {
        this.tagCateSelectList = listToTree(res)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 获取未配置衍生标签列表
  @action async getTagList() {
    try {
      const res = await io.getTagList({
        projectId: this.projectId,
        objId: this.ownObject,
      })
      runInAction(() => {
        this.tagList = changeToOptions(toJS(res || []))('name', 'id')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 配置
  @action async saveTagRelation() {
    try {
      const res = await io.saveTagRelation({
        projectId: this.projectId,
        tagDerivativeSchemeId: this.processId,
        tagId: this.tagId,
        dataFieldName: this.recordObj.fieldName,
        dataFieldType: this.recordObj.fieldType,
      })
      runInAction(() => {
        if (res) {
          successTip('配置成功')
          this.isConfig = true
          this.getList()
        } 
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 取消配置
  @action async delTagRelation() {
    try {
      const res = await io.delTagRelation({
        id: this.recordObj.tagFieldId,
        projectId: this.projectId,
      })
      runInAction(() => {
        if (res) {
          successTip('取消成功')
          this.isConfig = false
          this.isNewTag = true
          this.getList()
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 重名校验
  @action async tabCheckName(params, cb) {
    try {
      const res = await io.tabCheckName({
        projectId: this.projectId,
        objId: this.ownObject, // 所属对象
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
}
