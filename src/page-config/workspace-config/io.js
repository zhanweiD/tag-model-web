import ioContext from '../../common/io-context'
import {get, post, baseApi} from '../../common/util'

const api = {
  getWorkspace: get(`${baseApi}/oneProject/getWorkspace`), // 查询工作控件 获取项目当前环境
} 

ioContext.create('getWorkspace', api) 

export default ioContext.api.getWorkspace
