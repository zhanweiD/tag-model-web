import ioContext from '../common/io-context'
import {tagApi} from '../common/util'

ioContext.create('relfield', {
  getList: {
    url: `${tagApi}/be_tag/tag/pool/rel_field_list`,
  },

  delObjFieldRel: {
    method: 'POST',
    url: `${tagApi}/be_tag/tag/pool/remove_tag_field_rel`,
  },

  saveTags: {
    url: `${tagApi}/be_tag/tag/pool/create_batch_tag`,
    method: 'POST',
  },

  // 获取标签可移动的标签类目树
  getCanMoveTree: {
    url: `${tagApi}/be_tag/tag/pool/can_move_tree`,
  },
})

export default ioContext.api.relfield
