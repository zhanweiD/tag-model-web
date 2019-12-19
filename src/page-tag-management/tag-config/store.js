import {observable, action, runInAction} from 'mobx'
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

  async getResultData() {
    try {
      const res = await io.getResultData({
        id: this.objId,
        projectId: this.projectId,
      })

      this.result = res || []
    } catch (e) {
      errorTip(e.message)
    }
  }

  async getFieldData() {
    try {
      const res = await io.getFieldData({
        id: this.objId,
        projectId: this.projectId,
      })
     
      this.target = res || []
    } catch (e) {
      errorTip(e.message)
    }
  }

  async getTagData() {
    try {
      const res = await io.getTagData({
        id: this.objId,
        projectId: this.projectId,
        tagIds: this.tagIds,
      })
      
      this.source = res || []
    } catch (e) {
      errorTip(e.message)
    }
  }

  async saveResult(reqList) {
    try {
      const res = await io.saveMappingResult({
        reqList,
        objId: this.objId,
        projectId: this.projectId,
      })
  
      if (res === true) {
        successTip('保存成功')
      }
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default DrawerStore
