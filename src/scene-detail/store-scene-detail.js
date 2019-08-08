import {
  observable, action, runInAction,
} from 'mobx'
import {successTip, errorTip} from '../common/util'
import io from './io'


class SceneDetailStore {
  // 场景基本信息
  @observable info = {}

  // 场景详情编辑弹窗标识
  @observable modalVisible = false

  // 添加目的数据源弹窗标识
  @observable dSourceVisible = false

  // 标签详情
  @action async getDetail() {
    try {
      const res = await io.getDetail()

      runInAction(() => {
        this.info = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 场景编辑
  @action async editScene() {
    try {
      await io.editScene()

      runInAction(() => {
        this.modalVisible = false
        successTip('编辑成功')
        this.getDetail()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 中文名校验
  @action async checkName(name, cb) {
    try {
      await io.checkName({
        name,
      })

      runInAction(() => {
        if (cb) {
          cb()
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new SceneDetailStore()
