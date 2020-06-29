import ioContext from '../../common/io-context'
import {get, post, baseApi} from '../../common/util'

const api = {
  judgeInit: get(`${baseApi}/oneProject/hasInit`), // 项目是否初始化
  initProject: post(`${baseApi}/oneProject/initProjectWorkspace`), // 项目初始化
  getWorkspace: get(`${baseApi}/oneProject/getWorkspace`), // 查询工作控件
} 

ioContext.create('projectInit', api) 

export default ioContext.api.projectInit
