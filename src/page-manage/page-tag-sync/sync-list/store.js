import intl from 'react-intl-universal'
import { action, runInAction, observable } from 'mobx'
import {
  successTip,
  failureTip,
  errorTip,
  changeToOptions,
} from '../../../common/util'
import { ListContentStore } from '../../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getList) {
  projectId
  @observable visible = false
  @observable visibleEdit = false

  @observable selectItem = {}

  @action.bound closeDrawer() {
    this.visible = false
    this.selectItem = {}
  }

  @observable objList = [] // 下拉对象数据

  // 下拉对象列表
  @action async getObjList() {
    try {
      const res = await io.getObjList({
        projectId: this.projectId,
      })

      runInAction(() => {
        this.objList = changeToOptions(res)('name', 'objId')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 删除
  @action async delList(id) {
    try {
      await io.delList({
        projectId: this.projectId,
        deleteId: id,
      })

      runInAction(() => {
        successTip(
          intl
            .get(
              'ide.src.page-manage.page-aim-source.source-list.store.hz4myn73qbp'
            )
            .d('删除成功')
        )
        this.getList({ currentPage: 1 })
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable visibleStart = false
  // 启动
  @action async startSync(params) {
    try {
      const res = await io.startSync({
        projectId: this.projectId,
        ...params,
      })

      runInAction(() => {
        if (res) {
          successTip(
            intl
              .get(
                'ide.src.page-manage.page-tag-sync.sync-list.store.rgn76ck5bt'
              )
              .d('启动成功')
          )
          this.getList()
        } else {
          failureTip(
            intl
              .get(
                'ide.src.page-manage.page-tag-sync.sync-list.store.g33kpym7a9s'
              )
              .d('启动失败')
          )
        }
        this.visibleStart = false
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 暂停
  @action async pauseSync(id) {
    try {
      const res = await io.pauseSync({
        id,
        projectId: this.projectId,
      })

      runInAction(() => {
        if (res) {
          successTip(
            intl
              .get(
                'ide.src.page-manage.page-tag-sync.sync-list.store.9nh3b00j4hp'
              )
              .d('暂停成功')
          )
          this.getList()
        } else {
          failureTip(
            intl
              .get(
                'ide.src.page-manage.page-tag-sync.sync-list.store.9k59qn8o8ye'
              )
              .d('暂停失败')
          )
        }
        this.getList()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 执行
  @action async runSync(id) {
    try {
      const res = await io.runSync({
        id,
        projectId: this.projectId,
      })

      runInAction(() => {
        if (res) {
          successTip(
            intl
              .get(
                'ide.src.page-common.approval.pending-approval.store.voydztk7y5m'
              )
              .d('操作成功')
          )
          this.getList()
        } else {
          failureTip(
            intl
              .get(
                'ide.src.page-manage.page-aim-source.tag-config.store.82gceg0du65'
              )
              .d('操作失败')
          )
        }
        this.getList()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable submitLog = ''
  @observable visibleLog = false
  // 获取提交日志
  @action async getLog(id) {
    try {
      const res = await io.getLog({
        id,
        projectId: this.projectId,
      })

      runInAction(() => {
        this.submitLog = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
