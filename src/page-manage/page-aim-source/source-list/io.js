import ioContext from '../../../common/io-context'
import {baseApi, targetSourceApi, get, post} from '../../../common/util'

const api = {
  getList: get(`${targetSourceApi}/list`), // 数据源列表
  delList: get(`${targetSourceApi}/del`), // 删除数据源列表
  getObjList: get(`${targetSourceApi}/objs`), // 目的数据源-对象下拉列表
  getStorageType: get(`${targetSourceApi}/dataStorageType`), // 下拉数据源类型列表
  // getStorageList: get(`${baseApi}/project/projectDataStorageListByStorageType`), // 下拉数据源列表 
  getStorageList: get(`${targetSourceApi}/dataStorageList`), // 下拉数据源列表
  getStorageTable: get(`${targetSourceApi}/dataStorageTables`), // 下拉数据表列表
  getFieldList: get(`${targetSourceApi}/fields`), // 下拉数据表下字段列表
  addStorage: post(`${targetSourceApi}/add`), // 添加目的数据源
  getRelObj: get(`${targetSourceApi}/relObjByObjId`), // 根据objId 查询关联对象（实体就是其自身）
  getStorageDetail: get(`${baseApi}/project/storageDetails`), // 数据源详情
  checkName: get(`${targetSourceApi}/checkName`), // 重名校验

  getDefaultStorage: get(`${baseApi}/projectStorage/getDefaultStorage`), // 是否单一数据源
} 

ioContext.create('sourceList', api) 

export default ioContext.api.sourceList
