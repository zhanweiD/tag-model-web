import ioContext from '../common/io-context'
import {tagApi} from '../common/util'

ioContext.create('tagExport', {
  getTreeData: {
    url: `${tagApi}/be_tag/category/list_tree`,
  },

  getList: {
    url: `${tagApi}/be_tag/category/list_tree_tag`,
  },

  previewExport: {
    method: 'POST',
    url: `${tagApi}/be_tag/tag/preview_export`,
  },

  // exportTag: {
  //   url: `${tagApi}/be_tag/tag/export`,
  // },
})

export default ioContext.api.tagExport
