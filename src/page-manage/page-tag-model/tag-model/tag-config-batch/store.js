import intl from 'react-intl-universal'
import { action, observable, runInAction, toJS } from 'mobx'
import {
  successTip,
  errorTip,
  failureTip,
  changeToOptions,
} from '../../../../common/util'
import io from './io'

class DrawerStore {
  constructor({ projectId } = {}) {
    this.projectId = projectId
  }

  result = []
  source = []
  target = []

  @observable confirmLoading = false
  @observable currentStep = 0

  @observable checkedPulish = true
  @observable pubTagList = []

  // 选择标签 - 搜索相关
  @observable objId = undefined // 选择的对象id
  // @observable objList = [] // 对象下拉列表数据
  @observable boundMethodId = '' // 绑定方式
  @observable isShowPublished = false // 是否展示标签状态为已发布的标签

  // 选择标签 - 标签列表
  @observable selectTagList = []
  @observable rowKeys = []
  @observable selectedRowKeys = []

  // 上一步
  @action.bound lastStep() {
    this.currentStep = this.currentStep - 1
  }

  // 下一步
  @action.bound nextStep() {
    this.currentStep = this.currentStep + 1
  }

  @action async updateTagStatus(data) {
    try {
      const res = await io.updateTagStatus({
        projectId: this.projectId,
        status: 2,
        tagIdList: data,
      })

      runInAction(() => {
        if (res.success) {
          successTip(
            intl
              .get(
                'ide.src.page-manage.page-tag-model.tag-model.tag-config-batch.store.a6ttkst1gyn'
              )
              .d('发布成功')
          )
        } else {
          failureTip(
            intl
              .get(
                'ide.src.page-manage.page-tag-model.tag-model.tag-config-batch.store.40aw73ubna9'
              )
              .d('发布失败')
          )
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable configTagList = []

  @action async getConfigTagList() {
    try {
      const res = await io.getConfigTagList({
        objId: this.objId,
        configType: this.boundMethodId,
        projectId: this.projectId,
      })

      runInAction(() => {
        this.configTagList = res
        this.selectedRowKeys = res
          .filter(d => d.deployStatus === 2 || d.configStatus === 1)
          .map(d => d.id)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

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

      if (+this.boundMethodId === 1) {
        res = await io.getDeriveResultData(params)
      } else {
        res = await io.getResultData(params)
      }

      this.result = res || []
      this.pubTagList = res || []
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
        tagIds: toJS(this.selectedRowKeys),
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

  async saveResult(reqList, cb) {
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

      if (this.checkedPulish) {
        const tagIdList = this.pubTagList
          .filter(item => item.status !== 2)
          .map(item => item.tagId)
        if (tagIdList.length) {
          await this.updateTagStatus(tagIdList)
        }
      }
      runInAction(() => {
        if (cb) cb()
      })

      if (res === true) {
        successTip(
          intl
            .get(
              'ide.src.page-common.approval.pending-approval.store.voydztk7y5m'
            )
            .d('操作成功')
        )
      } else {
        failureTip(
          intl
            .get(
              'ide.src.page-manage.page-aim-source.tag-config.store.82gceg0du65'
            )
            .d('操作失败')
        )
      }
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default DrawerStore
