import ioContext from '../../common/io-context'
import {approvalApi, get, post} from '../../common/util'

const isMock = false
const api = {
  getList: get(`${approvalApi}/myApply`), // 我的申请列表
  getProject: post(`${approvalApi}/applyProject`), // 所属项目下拉列表（我的申请）
  backout: get(`${approvalApi}/myApplyUndo`), // 我的申请撤销
  getDetail: get(`${approvalApi}/myApplyDetails`, {
    mock: isMock,
    mockUrl: 'page-approval/application-detail',
  }), // 我的申请详情
} 

ioContext.create('myRequests', api) 

export default ioContext.api.myRequests
