import {observable, action, runInAction, toJS} from 'mobx'
import {message} from 'antd'
import io from './io'

export default class <%ComponentName%>Store {
  // 被观察的属性
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
      message.error(e.message)
    }
  }

  // 同步action示例
  @action clearContent() {
    this.content = ''
  }
}
