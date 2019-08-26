import {observable, action, runInAction, toJS} from 'mobx'
import {successTip, errorTip, listToTree} from '../common/util'
import io from './io'

class BackendExportStore {
  @observable currStep = 0

  @observable typeCode = undefined
  @observable typeCodes = []
  @observable searchKey = ''

  @observable treeLoading = false
  @observable treeData = []
  @observable cateList = []
  // 是否展开全部树节点
  @observable expandAll = false
  // 搜索自动展开
  @observable searchExpandedKeys = []

  // 选中类目下的标签列表
  @observable tableLoading = false
  @observable list = []

  // 导出数据预览
  @observable previewDataLoading = false
  @observable previewDataHead = []
  @observable previewDataList = []
  @observable keyRedis = ''
  @observable totalTag = undefined

  // 获取人、物、对象
  @action async getTypeCodes() {
    try {
      const res = await io.getTypeCodes() || []
      runInAction(() => {
        this.typeCode = res[0].objTypeCode
        this.typeCodes.replace(res)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async getTreeData() {
    try {
      this.treeLoading = true
      let res = await io.getTreeData({
        searchKey: this.searchKey,
        objTypeCode: this.typeCode,
      })
      runInAction(() => {
        if (!res || !Object.keys(res).length) res = []

        this.treeLoading = false
        this.searchExpandedKeys.clear()

        const data = res.map(item => {
          // 关键字搜索定位
          if (this.searchKey && item.name.includes(this.searchKey)) {
            this.findParentId(item.id, res, this.searchExpandedKeys)
          }
          return item
        })

        this.cateList.replace(data)
        this.treeData.replace(listToTree(data))
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action findParentId(id, data, expandedKeys) {
    data.forEach(item => {
      if (item.parentId !== 0 && item.id === id) {
        expandedKeys.push(item.parentId)
        this.findParentId(item.parentId, data, this.searchExpandedKeys)
      }
    })
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
        this.totalTag = res.totalTag

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
        const {tenantId, userId} = window.__userConfig
        console.log(this.keyRedis)
        window.open(`${pathPrefix}/file/download/api/v1/be_tag/tag/export?keyRedis=${this.keyRedis}&tenantId=${tenantId}&userId=${userId}`)

        this.currStep = 0
        this.keyRedis = ''
        successTip('导出操作成功')
        cb && cb()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new BackendExportStore()
