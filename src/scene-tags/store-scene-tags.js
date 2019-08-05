import {observable, action, runInAction, toJS} from 'mobx'
import {successTip, errorTip} from '../common/util'
import io from '../io'


export default class SceneTagsStore {
  // 被观察的属性
  @observable content = ''

  // 异步 action 示例
  @action getContent = async () => {
    try {
      const content = await io.getContent({
        param: 'xxx',
      })
      runInAction(() => {
        this.content = content.story
      })
    } catch (e) {
      message.error(e.message)
    }
  }

  // 同步 action 示例
  @action clearContent = () => {
    this.content = ''
  }
}
