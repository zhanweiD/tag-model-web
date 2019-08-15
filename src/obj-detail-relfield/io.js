import ioContext from '../common/io-context'
import {tagApi} from '../common/util'

ioContext.create('relfield', {
  getList: {
    url: `${tagApi}/be_tag/tag/pool/rel_db_field`,
    mock: true,
    mockUrl: 'page-hello/getContent',
  },
  delObjFieldRel: {
    method: 'POST',
    url: `${tagApi}/be_tag/tag/pool/del_obj_field_rel`,
    mock: true,
    mockUrl: 'page-hello/getContent',
  },
})

export default ioContext.api.relfield
