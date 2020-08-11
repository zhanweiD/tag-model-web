import ioContext from '../common/io-context'
import {post, get} from '../common/util'


const api = {
  getProjectList: post('api/project/1_0_0/project/list'), // 项目列表
  userFunctionCode: get('/api/uac/1_0_0/function/listUserProductFunctions'),
} 

ioContext.create('frame', api) 

export default ioContext.api.frame
