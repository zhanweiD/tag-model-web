import {
  action, runInAction, observable,
} from 'mobx'
import {errorTip} from '../../common/util'
import {ListContentStore} from '../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getList) {
  visualId
  projectId

  @observable infoLoading = false
  @observable detail = {}

  @observable configInfo = {} // 配置信息
  @observable configInfoLoading = false
  @observable drawerVisible = false

  @action async getDetail() {
    this.infoLoading = true

    try {
      const res = await io.getDetail({
        id: this.visualId,
        projectId: this.projectId,
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
        id: this.visualId,
        projectId: this.projectId,
      })

      runInAction(() => {
        this.configInfo = res
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.configInfoLoading = false
      })
    }
  }

  @observable ruleInfo = {}
  @observable ruleInfoLoading = false
  @observable posInfoList = []

  @action async getRuleInfo() {
    this.ruleInfoLoading = true

    try {
      const res = await io.getRuleInfo({
        id: this.visualId,
        projectId: this.projectId,
      })

      // const res = {
      //   then: {
      //     function: '固定值',
      //     params: [
      //       'dsaf',
      //     ],
      //   },
      //   posInfoList: [
      //     {
      //       type: 1,
      //       flag: '0',
      //       level: [
      //         0,
      //       ],
      //       x: 0,
      //       y: 50,
      //       source: null,
      //       target: null,
      //       logic: 1,
      //     },
      //     {
      //       type: 2,
      //       flag: '0-0',
      //       level: [
      //         0,
      //         0,
      //       ],
      //       x: 104,
      //       y: 20,
      //       source: [
      //         44,
      //         66,
      //       ],
      //       target: [
      //         104,
      //         36,
      //       ],
      //       leftFunction: '标签值',
      //       leftTagId: '7076796224003584.7076824815263232',
      //       comparision: 'equals',
      //       rightFunction: '固定值',
      //       rightParams: 'sad',
      //     },
      //     {
      //       type: 3,
      //       flag: '0-1',
      //       level: [
      //         0,
      //         1,
      //       ],
      //       x: 104,
      //       y: 80,
      //       source: [
      //         44,
      //         66,
      //       ],
      //       target: [
      //         104,
      //         96,
      //       ],
      //     },
      //   ],
      //   when: {
      //     x: 0,
      //     logic: 1,
      //     comparisionList: [
      //       {
      //         comparision: 'equals',
      //         left: {
      //           function: '标签值',
      //           params: [
      //             '7076796224003584.7076824815263232',
      //           ],
      //         },
      //         right: {
      //           function: '固定值',
      //           params: [
      //             'sad',
      //           ],
      //         },
      //       },
      //     ],
      //   },
      // }

      runInAction(() => {
        this.ruleInfo = res

        this.posInfoList = res.posInfoList && res.posInfoList.filter(d => d.type !== 3)
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.ruleInfoLoading = true
      })
    }
  }
}

export default new Store()
