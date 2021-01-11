import intl from 'react-intl-universal'
import io from './io'
import {
  successTip,
  errorTip,
  failureTip,
  changeToOptions,
} from '../../../common/util'

class DrawerStore {
  result = []
  source = []
  target = []

  sourceId
  projectId

  objList = [] // 下拉对象数据

  // 下拉对象列表
  async getObjList() {
    try {
      const res = await io.getObjList({
        id: this.sourceId,
        projectId: this.projectId,
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
        projectId: this.projectId,
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
      projectId: this.projectId,
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
        projectId: this.projectId,
      }

      const res = await io.getTagData(params)

      this.target = res || []
    } catch (e) {
      errorTip(e.message)
    }
  }

  async saveResult(params) {
    try {
      const res = await io.saveMappingResult({
        projectId: this.projectId,
        ...params,
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
      failureTip(
        intl
          .get(
            'ide.src.page-manage.page-aim-source.tag-config.store.82gceg0du65'
          )
          .d('操作失败')
      )
    }
  }
}

export default DrawerStore
