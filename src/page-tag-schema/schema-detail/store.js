import {
  action, runInAction, observable,
} from 'mobx'
import {CycleSelect} from '@dtwave/uikit'
import {successTip, failureTip, errorTip} from '../../common/util'
import {cycleSelectMap} from '../util'
import io from './io'

class Store {
  processeId
  @observable loading = false
  @observable detail = {}

  @action async getDetail() {
    try {
      const res = await io.getDetail({
        id: this.processeId,
      })
      runInAction(() => {
        const data = res
        if (res.scheduleType === 1) {
          const expression = CycleSelect.cronSrialize(res.scheduleExpression)

          data.period = cycleSelectMap[expression.cycle]
          data.periodTime = expression.time
        }

        this.detail = data
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

  @action async getConfigInfo() {
    try {
      const res = await io.getConfigInfo({
        id: this.processeId,
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
      })
      runInAction(() => {
        if (res) {
          successTip('提交成功')
          this.getDetail()
        } else {
          failureTip('提交失败')
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()