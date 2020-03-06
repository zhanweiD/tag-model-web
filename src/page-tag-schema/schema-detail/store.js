import {
  action, runInAction, observable,
} from 'mobx'
import {CycleSelect} from '@dtwave/uikit'
import {successTip, failureTip, errorTip} from '../../common/util'
import io from './io'

const cycleSelectMap = {
  day: '每天',
  week: '每周',
  month: '每月',
}

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
        const data = {...res}        
        const expression = CycleSelect.cronSrialize(res.schedule_expression)

        data.period = cycleSelectMap[expression.cycle]
        data.periodTime = expression.time
      
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
  @observable majorTagList = []
  @observable tql = ''

  @action async getConfigInfo() {
    try {
      const res = await io.getConfigInfo({
        id: this.processeId,
      })
      runInAction(() => {
        this.tql = res.source
        this.majorTagList = res.main_tag_mapping_keys
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
