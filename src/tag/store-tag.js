import {
  observable, action, runInAction, toJS,
} from 'mobx'
import {successTip, errorTip} from '../common/util'
import io from './io'

export default class TagStore {
  // 类目id
  @observable id = undefined
  // 标签树类型 1:人 2:物 3:关系
  @observable typeCode = undefined

  @observable content = ''
  // 异步action示例
  @action async getContent() {
    try {
      const res = await io.getContent({
        param: 'xxx',
      })
      runInAction(() => {
        this.content = res.story
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 同步action示例
  @action clearContent() {
    this.content = ''
  }
}
