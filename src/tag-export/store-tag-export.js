import {observable, action, runInAction, toJS} from 'mobx'
import {successTip, errorTip, listToTree} from '../common/util'
import io from './io'

class BackendExportStore {
  @observable typeCode = 1

  @observable currStep = 0

  @observable treeLoading = false
  @observable treeData = []
  @observable cateList = []

  // 选中类目下的标签列表
  @observable tableLoading = false
  @observable list = []

  // 导出数据预览
  @observable previewDataLoading = false
  @observable previewDataHead = []
  @observable previewDataList = []
  @observable keyRedis = ''

  @action async getTreeData() {
    try {
      this.treeLoading = true
      const res = await io.getTreeData({
        searchKey: '',
        objTypeCode: this.typeCode,
      })
      runInAction(() => {
        this.treeLoading = false
        this.cateList = res
        this.treeData = listToTree(res)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async getList(treeId) {
    try {
      this.tableLoading = true
      const res = await io.getList({
        objTypeCode: this.typeCode,
        treeId,
      })
      runInAction(() => {
        this.tableLoading = false
        this.list.replace(res)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async getPreviewData(treeIds) {
    try {
      this.previewDataLoading = true
      const res = await io.previewExport({
        treeIds,
      })

      runInAction(() => {
        this.previewDataLoading = false
        this.keyRedis = res.keyRedis

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
            o[res.fields[idx2]] = item2
            tabList[idx] = o
          })
        })
        this.previewDataList.replace(tabList)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async exportTag(cb) {
    try {
      // const res = await io.exportTag({
      //   keyRedis: this.keyRedis,
      // })
      runInAction(() => {
        const {pathPrefix} = window.__onerConfig
        window.open(`${pathPrefix}/file/download/api/v1/be_tag/tag/export?keyRedis=${this.keyRedis}`)

        this.currStep = 0
        this.keyRedis = ''
        successTip('操作成功')
        cb && cb()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new BackendExportStore()
