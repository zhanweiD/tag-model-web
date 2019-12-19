import ioContext from '../common/io-context'
import {get, projectApi} from '../common/util'

const api = {
  getProjectList: get(`${projectApi}/list`), // 项目列表
} 

ioContext.create('frame', api) 

export default ioContext.api.frame
