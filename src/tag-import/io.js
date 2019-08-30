import ioContext from '../common/io-context'
import {tagApi} from '../common/util'

ioContext.create('tagImport', {
  importTag: {
    url: `${tagApi}/be_tag/tag/do_import`,
    method: 'POST',
  },
  
  getObjs: {
    url: `${tagApi}/be_tag/tag/import/obj/drop_down_box`,
  },
})

export default ioContext.api.tagImport
