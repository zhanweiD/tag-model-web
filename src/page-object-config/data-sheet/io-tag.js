import ioContext from '../../common/io-context'
import {baseApi, get, post} from '../../common/util'

const api = {
  getFieldList: post(`${baseApi}/tag/pool/tag_conf_field`), // 字段列表
  getCateList: get(`${baseApi}/cate/cate_tree`), // 标签可移动的标签类目树
  checkTagList: post(`${baseApi}/tag/pool/check_tag_config`), // 校验标签列表
  saveTags: post(`${baseApi}/tag/pool/create_batch_tag`), // 批量创建标签
  getStorageDetail: get(`${baseApi}/tag/pool/storage_detail`), // 创建成功结果
}

ioContext.create('tagConfiguration', api) 

export default ioContext.api.tagConfiguration
