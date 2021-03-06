import ioContext from '../../../common/io-context'
import {baseApi, tagModalApi, get, post, objectApi} from '../../../common/util'

const api = {
  getFieldList: post(`${baseApi}/tagConfig/tagConfField`), // 字段列表
  getCateList: get(`${baseApi}/cate/cate_tree`), // 标签可移动的标签类目树
  checkTagList: post(`${baseApi}/tagConfig/check_tag_config`), // 校验标签列表
  saveTags: post(`${baseApi}/tag/pool/create_batch_tag`), // 批量创建标签
  getStorageDetail: get(`${baseApi}/tagConfig/storage_detail`), // 创建成功结果
  checkName: post(`${tagModalApi}/name_check`), // 重名校验
  checkKeyWord: get(`${objectApi}/list_keyword`),
  getTagTypeList: get(`${baseApi}/tag/tag_type`), // 根据字段类型获取标签类型
}

ioContext.create('tagConfiguration', api) 

export default ioContext.api.tagConfiguration
