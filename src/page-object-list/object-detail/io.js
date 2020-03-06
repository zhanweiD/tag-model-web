import ioContext from '../../common/io-context'
import {objectApi, get, post} from '../../common/util'

const api = {
  //* ------------------------------ 对象详情 ------------------------------*//
  getObjDetail: get(`${objectApi}/object_basic`), // 对象基础信息
  getObjCard: get(`${objectApi}/object_card`), // 对象详情指标卡
  changeObjStatus: post(`${objectApi}/update_object_status`), // 修改对象发布状态
  getObjView: get(`${objectApi}/object_view`), // 对象视图
  getBusinessModel: get(`${objectApi}/business_model`), // 逻辑模型
} 

ioContext.create('objectDetail', api) 

export default ioContext.api.objectDetail
