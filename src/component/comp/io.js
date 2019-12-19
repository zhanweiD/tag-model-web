import ioContext from '../../common/io-context'
import {projectApi, get, post} from '../../common/util'

const api = {
  getList: get(`${projectApi}/list`), // 项目列表
} 

ioContext.create('project', api) 

export default ioContext.api.project
