import ioContext from '../common/io-context'
import {post} from '../common/util'


const api = {
  getProjectList: post('api/project/1_0_0/project/list'), // 项目列表
} 

ioContext.create('frame', api) 

export default ioContext.api.frame
