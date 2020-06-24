import {
  observable, action, runInAction,
} from 'mobx'
import {errorTip} from '../common/util'
import storage from '../common/nattyStorage'
import io from './io'

class Store {
  @observable projectList = []
  @observable projectId = undefined

  @action async getProjectList() {
    const storageProjectId = storage.get('tag_projectId')
    const projectId = storageProjectId ? +storageProjectId : undefined
    try {
      const res = await io.getProjectList({
        currentPage: 1,
        pageSize: 9999,
      })

      // const res = {
      //   data: [],
      // }

      runInAction(() => {
        // 项目列表无数据 
        if (!res.list.length) {
          const spaceInfo = {
            projectId: undefined,
            projectList: res.list,
          }
          window.spaceInfo = spaceInfo
        }

        // 缓存中有项目id && 项目列表有数据 
        if (projectId && res.list.length) {
          const filter = res.list.filter(d => +d.projectId === +projectId)
          // 项目不存在项目列表中
          if (!filter.length) {
            storage.set('tag_projectId', res.list[0].projectId)
            const spaceInfo = {
              projectId: res.list[0].projectId,
              projectList: res.list,
            }
            window.spaceInfo = spaceInfo
          } else {
            // 项目存在项目列表中
            const spaceInfo = {
              projectId,
              projectList: res.list,
            }
            window.spaceInfo = spaceInfo
          }
        }


        // 缓存中没有项目id && 项目列表有数据 默认项目列表中第一个项目
        if (!projectId && res.list.length) {
          storage.set('tag_projectId', res.list[0].projectId)

          const spaceInfo = {
            projectId: res.list[0].projectId,
            projectList: res.list,
          }
          window.spaceInfo = spaceInfo
        }
        if (res.list.length === 0) {
          window.spaceInfo = {}
          window.spaceInfo.projectList = res.list
          window.spaceInfo.finish = true
        } else {
          window.spaceInfo.projectList = res.list
          window.spaceInfo.finish = true
        }
        this.projectId = window.spaceInfo && window.spaceInfo.projectId
        this.projectList = res.list
      })
    } catch (e) {
      window.spaceInfo = {}
      console.log(e.message)

      errorTip(e.message)
    }
  }
}

export default new Store()
