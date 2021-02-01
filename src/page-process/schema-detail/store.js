import intl from 'react-intl-universal'
import { action, runInAction, observable } from 'mobx'
import { CycleSelect } from '@dtwave/uikit'
import { successTip, failureTip, errorTip } from '../../common/util'
import { cycleSelectMap } from '../util'
import io from './io'

class Store {
  processeId
  projectId
  @observable loading = false
  @observable detail = {}

  @action async getDetail() {
    try {
      const res = await io.getDetail({
        id: this.processeId,
        projectId: this.projectId,
      })

      runInAction(() => {
        this.detail = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 配置信息
   */

  @observable tagConfigList = [] // 标签配置
  @observable mainTagObj = []
  @observable obj = []
  @observable tql = ''
  @observable configDetail = {}

  @action async getConfigInfo() {
    try {
      const res = await io.getConfigInfo({
        id: this.processeId,
        projectId: this.projectId,
      })

      runInAction(() => {
        const mainTagObj = {}
        this.tql = res.source
        if (res.mainTagMappingKeys) {
          res.mainTagMappingKeys.forEach(d => {
            mainTagObj[d.objId] = d.columnName
          })
        }

        this.mainTagObj = mainTagObj
        this.obj = res.obj
        this.tagConfigList = res.filedTagRspList

        if (res.scheduleType === 1) {
          const expression = CycleSelect.cronSrialize(res.scheduleExpression)

          res.period = cycleSelectMap[expression.cycle]
          res.periodTime = expression.time
        }
        this.configDetail = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 提交方案
  @action async submitScheme() {
    try {
      const res = await io.submitScheme({
        id: this.processeId,
        projectId: this.projectId,
      })

      runInAction(() => {
        if (res) {
          successTip(
            intl
              .get(
                'ide.src.page-manage.page-tag-sync.sync-detail.main.yf96acx8evb'
              )
              .d('提交成功')
          )
          this.getDetail()
        } else {
          failureTip(
            intl
              .get(
                'ide.src.page-manage.page-tag-sync.sync-detail.main.2n0b3tsdnkb'
              )
              .d('提交失败')
          )
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
