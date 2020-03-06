// import {observable, action, runInAction} from 'mobx'
import io from './io'
import {successTip, errorTip} from '../../common/util'

class DrawerStore {
  constructor({
    projectId,
    // objId,
    // tagIds,
  } = {}) {
    this.projectId = projectId
    // this.objId = objId
    // this.tagIds = tagIds
  }

  result = []
  source = []
  target = []

  objId
  tagIds = []
  configType

  async getResultData() {
    try {
      const params = {
        id: this.objId,
        projectId: this.projectId,
      }
      
      let res = []

      if (this.configType === 1) {
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
      if (this.configType === 1) {
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
        tagIds: this.tagIds,
        // tagIds: [],
      }

      let res = []

      if (this.configType === 1) {
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

      if (this.configType === 1) {
        res = await io.saveDeriveMappingResult(params)
      } else {
        res = await io.saveMappingResult(params)
      }
     
      if (res === true) {
        successTip('保存成功')
      }
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default DrawerStore
