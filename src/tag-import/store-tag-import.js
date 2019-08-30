import {
  observable, action, runInAction, toJS,
} from 'mobx'
import {successTip, errorTip} from '../common/util'
import io from './io'

class ImportStore {
  @observable currStep = 0
 
  // @observable typeCodes = []
  @observable objs = []
  @observable typeCode = ''
  @observable objId = undefined


  // 导出数据预览
  @observable previewDataLoading = false
  @observable previewDataHead = []
  @observable previewDataList = []
  @observable canImportData = []

  @observable total = 0
  @observable failTotal = 0
  @observable failPreView = 0
  @observable correctPreView = 0

  // 导出失败文件的参数
  @observable failKey = undefined
  // 导出按钮loading状态
  @observable importDataLoading = false

  // @action async getTypeCodes() {
  //   try {
  //     const res = await io.getTypeCodes() || []
  //     runInAction(() => {
  //       this.typeCodes.replace(res)
  //     })
  //   } catch (e) {
  //     errorTip(e.message)
  //   }
  // }

  @action async getObjs() {
    try {
      const res = await io.getObjs({
        objTypeCode: this.typeCode,
      })
      runInAction(() => {
        res && this.objs.replace(res)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 获取预览数据
  @action async getPreviewData(data) {
    try {
      this.previewDataLoading = true

      const {total, failTotal, failPreView, correctPreView} = data
      let {canImportData, preViewFailData} = data
      if (!canImportData) canImportData = []
      if (!preViewFailData) preViewFailData = []
      const allPreviewData = preViewFailData.concat(canImportData)

      runInAction(() => {
        this.previewDataLoading = false
        this.total = total
        this.failTotal = failTotal
        this.failPreView = failPreView
        this.correctPreView = correctPreView
        
        this.previewDataHead.clear()
        this.previewDataList.clear()

        const tableKeys = _.keys(data.columns)
        _.values(data.columns).forEach((item, idx) => {
          this.previewDataHead.push({
            title: item,
            key: tableKeys[idx],
            dataIndex: tableKeys[idx],
          })
        })

        const tabList = allPreviewData.map(item => ({
          isError: !!item.errorMsg,
          ...item,
        }))

        this.previewDataList.replace(tabList)
        this.canImportData.replace(data.canImportData)
        this.currStep = 2
        this.failKey = data.failKey
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 导入数据
  @action async postImportData(cb) {
    this.importDataLoading = true
    try {
      await io.importTag({
        objTypeCode: this.typeCode,
        objId: this.objId,
        list: toJS(this.canImportData),
      })

      runInAction(() => {
        this.importDataLoading = false
        this.currStep = 0
        successTip('导入操作成功')
        cb && cb()
      })
    } catch (e) {
      runInAction(() => {
        this.importDataLoading = false
      })
      errorTip(e.message)
    }
  }
}

export default new ImportStore()
