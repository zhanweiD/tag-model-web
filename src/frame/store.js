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
    try {
      const res = await io.getProjectList({
        currentPage: 1,
        pageSize: 9999,
      })

      // const res = {
      //   data: [],
      // }
      const storageProjectId = storage.get('tag_projectId')
      const projectId = storageProjectId ? +storageProjectId : undefined

      // 项目列表无数据 
      if (!res.data.length) {
        const spaceInfo = {
          projectId: undefined,
          projectList: res.data,
        }
        window.spaceInfo = spaceInfo
      }

      // 缓存中有项目id && 项目列表有数据 
      if (projectId && res.data.length) {
        const filter = res.data.filter(d => +d.id === +projectId)
        // 项目不存在项目列表中
        if (!filter.length) {
          storage.set('tag_projectId', res.data[0].id)
          const spaceInfo = {
            projectId: res.data[0].id,
            projectList: res.data,
          }
          window.spaceInfo = spaceInfo
        } else {
          // 项目存在项目列表中
          const spaceInfo = {
            projectId,
            projectList: res.data,
          }
          window.spaceInfo = spaceInfo
        }
      }


      // 缓存中没有项目id && 项目列表有数据 默认项目列表中第一个项目
      if (!projectId && res.data.length) {
        storage.set('tag_projectId', res.data[0].id)

        const spaceInfo = {
          projectId: res.data[0].id,
          projectList: res.data,
        }
        window.spaceInfo = spaceInfo
      } 
     
      runInAction(() => {
        if (res.data.length === 0) {
          window.spaceInfo = {}
          window.spaceInfo.projectList = res.data
          window.spaceInfo.finish = true
        } else {
          window.spaceInfo.projectList = res.data
          window.spaceInfo.finish = true
        }
        this.projectId = window.spaceInfo && window.spaceInfo.projectId
        this.projectList = res.data
      })
    } catch (e) {
      window.spaceInfo = {}
      errorTip(e.message)
    } 
  }
}

export default new Store()
