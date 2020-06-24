import ioContext from '../../common/io-context'
import {get, post, baseApi} from '../../common/util'

const api = {
  hasInit: get(`${baseApi}/oneProject/hasInit`), // 项目是否初始化
  initProject: post(`${baseApi}/project/initProjectWorkspace`), // 项目初始化
} 

ioContext.create('projectInit', api) 

export default ioContext.api.projectInit
