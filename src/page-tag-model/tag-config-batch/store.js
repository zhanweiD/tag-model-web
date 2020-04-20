import {
  action, observable,
} from 'mobx'
import {toJS} from 'mobx-react'
import {successTip, errorTip, failureTip} from '../../common/util'
import io from './io'

class Store {
  constructor({
    projectId,
  } = {}) {
    this.projectId = projectId
  }

  @observable confirmLoading = false
  @observable currentStep = 0
  
  // 选择标签 - 搜索相关
  @observable objId = '' // 选择的对象id
  @observable objList = [] // 对象下拉列表数据
  @observable boundMethodId = 0 // 绑定方式
  @observable isShowPublished = false // 是否展示标签状态为已发布的标签

  // 选择标签 - 标签列表
  @observable selectTagList = []
  @observable rowKeys = []

  // 上一步
  @action.bound lastStep() {
    this.currentStep = this.currentStep - 1
  }

  // 下一步
  @action.bound nextStep() {
    this.currentStep = this.currentStep + 1
  }

  async getResultData() {
    try {
      const params = {
        id: this.objId,
        projectId: this.projectId,
      }
      
      let res = []

      if (+this.boundMethodId === 1) {
        res = await io.getDeriveResultData(params)
      } else {
        res = await io.getResultData(params)
      }

      this.result = res || []
    } catch (e) {
      errorTip(e.message)
    }
  }

  async getFieldData() {
    const params = {
      id: this.objId,
      projectId: this.projectId,
    }
    try {
      let res = []
      if (+this.boundMethodId === 1) {
        res = await io.getDeriveFieldData(params)
      } else {
        res = await io.getFieldData(params)
      }
     
      this.target = res || []
    } catch (e) {
      errorTip(e.message)
    }
  }

  async getTagData() {
    try {
      const params = {
        id: this.objId,
        projectId: this.projectId,
        tagIds: toJS(this.rowKeys),
      }

      let res = []

      if (+this.boundMethodId === 1) {
        res = await io.getDeriveTagData(params)
      } else {
        res = await io.getTagData(params)
      }
      
      this.source = res || []
    } catch (e) {
      errorTip(e.message)
    }
  }

  async saveResult(reqList) {
    try {
      const params = {
        reqList,
        objId: this.objId,
        projectId: this.projectId,
      }

      let res 

      if (+this.boundMethodId === 1) {
        res = await io.saveDeriveMappingResult(params)
      } else {
        res = await io.saveMappingResult(params)
      }
     
      if (res === true) {
        successTip('绑定成功')
      } else {
        failureTip('绑定失败')
      }
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
