import ioContext from '../common/io-context'
import {tagApi} from '../common/util'

ioContext.create('poolRoot', {
  checkObjExist: {
    url: `${tagApi}/be_tag/tag/pool/obj_exist`,
    method: 'GET',
  },
})

export default ioContext.api.poolRoot
