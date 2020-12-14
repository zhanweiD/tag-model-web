import {observable, action, runInAction} from 'mobx'
import io from './io'
import {successTip, errorTip, failureTip, changeToOptions} from '../../../../common/util'

class DrawerStore {
  constructor({
    projectId,
  } = {}) {
    this.projectId = projectId
  }

  projectId
  result = []
  source = []
  target = []

  objId
  tagIds = []
  configType

  @observable tableList = []

  @action async getTableList() {
    try {
      const res = await io.getTableList({
        id: this.objId,
        projectId: this.projectId,
      })

      runInAction(() => {
        this.tableList = changeToOptions(res)('dataTableName', 'dataTableName')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable schemeList = []

  @action async getSchemeList() {
    try {
      const res = await io.getSchemeList({
        objId: this.objId,
        projectId: this.projectId,
      })

      runInAction(() => {
        this.schemeList = changeToOptions(res)('name', 'name')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

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
        successTip('操作成功')
      } else {
        failureTip('操作失败')
      }
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default DrawerStore
