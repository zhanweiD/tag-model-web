import {
  action, runInAction, observable,
} from 'mobx'
import {CycleSelect} from '@dtwave/uikit'
import {successTip, errorTip} from '../../common/util'
import {ListContentStore} from '../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getList) {
  syncId
  projectId

  @observable infoLoading = false
  @observable detail = {}

  @observable visible = false
  @observable confirmLoading = false

  @observable configInfo = {} // 配置信息
  @observable configInfoLoading = false

  @action async getDetail() {
    this.infoLoading = true

    try {
      const res = await io.getDetail({
        id: this.syncId,
      })

      runInAction(() => {
        this.detail = res
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.infoLoading = false
      })
    }
  }

  @action async getConfigInfo() {
    this.configInfoLoading = true
    try {
      const res = await io.getConfigInfo({
        id: this.syncId,
      })
      
      runInAction(() => {
        this.configInfo = res

        if (res.scheduleType === 1) {
          const expression = CycleSelect.cronSrialize(res.scheduleExpression)

          this.configInfo.period = '每天'
          this.configInfo.periodTime = expression.time
        }
      })
    } catch (e) {
      errorTip(e.message)
      runInAction(() => {
        this.configInfo = {}
      })
    } finally {
      runInAction(() => {
        this.configInfoLoading = false
      })
    }
  }
}

export default new Store()
