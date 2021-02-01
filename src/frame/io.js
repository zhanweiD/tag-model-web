import ioContext from '../common/io-context'
import {
  post,
} from '../common/util'

const api = {
  getProjects: post('/api/project/current/project/simple/list'),
} 

ioContext.create('tagFrame', api) 

export default ioContext.api.tagFrame
