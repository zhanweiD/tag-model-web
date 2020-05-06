import io from './io'
import {successTip, errorTip, failureTip, changeToOptions} from '../../common/util'

class DrawerStore {
  result = []
  source = []
  target = []

  sourceId


  objList = [] // 下拉对象数据

  // 下拉对象列表
  async getObjList() {
    try {
      const res = await io.getObjList({
        id: this.sourceId,
      })
      this.objList = changeToOptions(res)('objName', 'objId') || []
    } catch (e) {
      errorTip(e.message)
    }
  }

  async getResultData() {
    try {
      const params = {
        id: this.sourceId,
      }
      
      const res = await io.getResultData(params)
     
      this.result = res || []
    } catch (e) {
      errorTip(e.message)
    }
  }

  async getFieldData() {
    const params = {
      id: this.sourceId,
    }
    try {
      const res = await io.getFieldData(params)
    
      this.source = res || []
    } catch (e) {
      errorTip(e.message)
    }
  }

  async getTagData() {
    try {
      const params = {
        id: this.sourceId,
      }

      const res = await io.getTagData(params)
      
      this.target = res || []
    } catch (e) {
      errorTip(e.message)
    }
  }

  async saveResult(params) {
    try {
      const res = await io.saveMappingResult(params)
      console.log(res)
      if (res === true) {
        successTip('绑定成功')
      } else {
        failureTip('绑定失败')
      }
    } catch (e) {
      errorTip(e.message)
      failureTip('绑定失败')
    }
  }
}

export default DrawerStore
