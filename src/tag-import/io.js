import ioContext from '../common/io-context'
import {tagApi} from '../common/util'

ioContext.create('tagImport', {
  importTag: {
    url: `${tagApi}/be_tag/tag/do_import`,
    method: 'POST',
  },
  
  getTypeCodes: {
    url: `${tagApi}/be_tag/tag/import/obj_type/drop_down_box`,
  },

  getObjs: {
    url: `${tagApi}/be_tag/tag/import/obj/drop_down_box`,
  },
})

export default ioContext.api.tagImport