import {
  observable, action, runInAction,
} from 'mobx'
import {errorTip} from '../common/util'
import storage from '../common/nattyStorage'
import io from './io'

const storageProjectId = storage.get('tag_projectId')

class Store {
  @observable projectList = []
  @observable projectId = storageProjectId ? +storageProjectId : undefined

  @action async getProjectList() {
    try {
      const res = await io.getProjectList({
        currentPage: 1,
        pageSize: 9999,
      })

      // const res = {
      //   data: [],
      // }

      let {projectId} = this
      if (!projectId && res.data.length) {
        projectId = res.data[0].id
        storage.set('tag_projectId', res.data[0].id)
        const spaceInfo = {
          projectId,
          projectList: res.data,
        }
        window.spaceInfo = spaceInfo
      } 

      if (projectId && res.data.length) {
        const filter = res.data.filter(d => +d.id === +projectId)
        // 项目不存在项目列表中
        if (!filter.length) {
          projectId = res.data[0].id
          storage.set('tag_projectId', res.data[0].id)
          const spaceInfo = {
            projectId,
            projectList: res.data,
          }
          window.spaceInfo = spaceInfo
        }
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
      
        this.projectId = projectId
        this.projectList = res.data
      })
    } catch (e) {
      window.spaceInfo = {}
      errorTip(e.message)
    } 
  }

  // // 点击项目空间
  // @action selectProject = value => {
  //   if (this.projectId !== value) {
  //     storage.set('tag_projectId', value)
  //     this.projectId = value
  //     if (window.spaceInfo) {
  //       window.spaceInfo.projectId = +value
  //     }
  //   }
  // }
}

export default new Store()
