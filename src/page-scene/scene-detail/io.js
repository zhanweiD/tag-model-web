import ioContext from '../../common/io-context'
import {
  sceneApi, get, post, baseApi,
} from '../../common/util'

const api = {
  getDetail: get(`${sceneApi}/detail`), // 场景详情
  editScene: get(`${sceneApi}/edit`), // 场景编辑
  checkName: get(`${sceneApi}/check_name`), // 名称校验

  getTagDetail: get(`${sceneApi}/treeObj/cat/tag/detail`), // 标签详情
  getApiTrend: get(`${sceneApi}/treeObj/cat/tag/apiCount`), // API调用数趋势
  getTagTrend: get(`${sceneApi}/treeObj/cat/tag/invoke`), // 标签调用次数趋势

  //* ------------------------------ 目的数据源 ------------------------------*//
  getDBSource: get(`${sceneApi}/dbSourceList`), // 数据源数据
  getDbTableList: get(`${sceneApi}/dbSourceTableList`), // 数据表数据
  getDBSourceList: get(`${sceneApi}/beingDBSourceList`), // 添加目的数据源 - 列表
  saveStorage: post(`${sceneApi}/saveStorage`), // 添加数据源 - 保存
  getSourceList: get(`${sceneApi}/alreadyDBSourceList`), // 目的数据源 - 列表
  dbSourceDel: post(`${sceneApi}/dbSourceDel`), // 目的数据源 - 列表删除
  isObjExist: get(`${baseApi}/tag/pool/obj_exist`), // 判断标签池是否有对象

  // 权限code
  getAuthCode: get(`${baseApi}/project/getFunctionCodes`),
}

ioContext.create('sceneDetail', api)

export default ioContext.api.sceneDetail
