import intl from 'react-intl-universal'
import { observable, action, runInAction, toJS } from 'mobx'
import { successTip, errorTip, changeToOptions } from '../../common/util'
import io from './io'

class Store {
  @observable projectId = 0 // 项目ID
  @observable dataSource = [
    { name: '1', value: '1' },
    { name: '2', value: '2' },
  ] // 环境列表
  @observable visible = false // 控制配置弹窗
  @observable confirmLoading = false // 确认按钮loading
  @observable initVisible = true // 初始化页面是否显示

  // 初始化项目环境
  @action async initProject(data) {
    try {
      const res = await io.initProject({
        projectId: this.projectId,
        ...data,
      })

      runInAction(() => {
        this.hasInit()
        this.confirmLoading = false
        this.visible = false
        successTip(
          intl
            .get('ide.src.component.project-provider.store.2qjw8hay0zb')
            .d('初始化成功')
        )
      })
    } catch (e) {
      errorTip(e.message)
      this.confirmLoading = false
    }
  }

  // 获取项目信息
  @action async hasInit() {
    try {
      const res = await io.hasInit({
        projectId: this.projectId,
      })

      runInAction(() => {
        this.initVisible = !res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
