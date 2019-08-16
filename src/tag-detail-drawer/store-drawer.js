import {observable, action, runInAction} from 'mobx'
import io from './io'
import {successTip, errorTip} from '../common/util'


class DrawerStore {
  result = []
  source = []
  target = []

  async getResultData(id) {
    try {
      const res = await io.getResultData({
        id,
      })

      this.result = res || []
    } catch (e) {
      errorTip(e.message)
    }
  }

  async getFieldData(id) {
    try {
      const res = await io.getFieldData({
        id,
      })

      this.target = res || []
    } catch (e) {
      errorTip(e.message)
    }
  }

  async getTagData(id) {
    try {
      const res = await io.getTagData({
        id,
      })

      this.source = res || []
    } catch (e) {
      errorTip(e.message)
    }
  }

  async saveResult(reqList, objId) {
    try {
      const res = await io.saveMappingResult({
        reqList,
        objId,
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
