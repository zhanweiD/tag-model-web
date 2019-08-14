import {
  observable, action, runInAction, toJS,
} from 'mobx'
import {errorTip} from '../common/util'
import io from './io'


class SelectTagStore {
  constructor(props) {
    this.props = props
  }

  // 场景id
  @observable sceneId = undefined

  // 选择标签id
  @observable tagId = undefined

  // 标签详情
  @observable tagInfo = {}

  // 添加目的数据源弹窗标识
  @observable selectTagVisible = false

  // API调用数趋势数据
  @observable apiTrendData = []

  // 标签调用次数趋势
  @observable tagTrendData = []

  // 标签详情
  @action async getTagDetail() {
    try {
      const res = await io.getTagDetail({
        occasionId: this.sceneId,
        tagId: this.tagId,
      })

      runInAction(() => {
        this.tagInfo = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // API调用数趋势
  @action async getApiTrend(params, cb) {
    try {
      const res = await io.getApiTrend({
        occasionId: this.sceneId,
        tagId: this.tagId,
        ...params,
      })

      runInAction(() => {
        this.apiTrendData.clear()
        this.apiTrendData = res
        if (cb) cb(toJS(res))
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 标签调用次数趋势
  @action async getTagTrend(params, cb) {
    try {
      const res = await io.getTagTrend({
        occasionId: this.sceneId,
        tagId: this.tagId,
        ...params,
      })

      runInAction(() => {
        this.tagTrendData.clear()
        this.tagTrendData = res
        if (cb) cb(toJS(res))
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default SelectTagStore
