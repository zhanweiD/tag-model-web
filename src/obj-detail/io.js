import ioContext from '../common/io-context'
import {tagApi} from '../common/util'

ioContext.create('objDetail', {
  getObjectDetail: {
    url: `${tagApi}/be_tag/tag/pool/obj_detail`,
  },
})

export default ioContext.api.objDetail
