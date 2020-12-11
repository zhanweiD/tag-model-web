import ioContext from '../common/io-context'
import {
  post,
} from '../common/util'

const api = {
  getProjects: post('/api/project/1_0_0/project/simple/list'),
} 

ioContext.create('tagFrame', api) 

export default ioContext.api.tagFrame
