import {
  observable, action, runInAction, toJS,
} from 'mobx'
import {successTip, errorTip} from '../common/util'
import io from './io'

class ImportStore {
  @observable currStep = 0
 
  @observable typeCodes = []
  @observable objs = []
  @observable typeCode = ''
  @observable objId = ''


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

  @action async getTypeCodes() {
    try {
      const res = await io.getTypeCodes()
      runInAction(() => {
        this.typeCodes.replace(res)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async getObjs() {
    try {
      const res = await io.getObjs({
        objTypeCode: this.typeCode,
      })
      runInAction(() => {
        this.objs.replace(res)
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
      const allPreviewData = canImportData.concat(preViewFailData)
      const res = {
        dataList: allPreviewData.map(item => {
          const arr = _.values(item)
          arr.push(!!item.errorMsg)
          return arr
        }),
        fields: _.values(data.columns),
        success: data.success,
      }

      runInAction(() => {
        this.previewDataLoading = false
        this.total = total
        this.failTotal = failTotal
        this.failPreView = failPreView
        this.correctPreView = correctPreView
        
        this.previewDataHead.clear()
        this.previewDataList.clear()

        res.fields.forEach(item => {
          this.previewDataHead.push({
            title: item,
            key: item,
            dataIndex: item,
          })
        })

        const tabList = []
        res.dataList.forEach((item, idx) => {
          const o = {}
          item.forEach((item2, idx2) => {
            const key = res.fields[idx2]
            if (key) {
              o[key] = item2
            }
           
            if (idx2 === item.length - 1) {
              o.isError = item2
            }
            tabList[idx] = o
          })
        })

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
    try {
      await io.importTag({
        objTypeCode: this.typeCode,
        objId: this.objId,
        list: toJS(this.canImportData),
      })

      runInAction(() => {
        this.currStep = 0
        successTip('导入操作成功')
        cb && cb()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new ImportStore()
