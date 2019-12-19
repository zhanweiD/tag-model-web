import ioContext from '../../common/io-context'
import {approvalApi, get, post} from '../../common/util'

const api = {
  getList: get(`${approvalApi}/myApply`), // 我的申请列表
  getApplicant: post(`${approvalApi}/applicant`), // 申请人下拉列表
  getProject: post(`${approvalApi}/approvalProject`), // 所属项目下拉列表（待我/我已审批）
  getDetail: get(`${approvalApi}/myApplyDetails`), // 我的申请详情
  goApproval: post(`${approvalApi}/myApprovalDo`),
} 

ioContext.create('pendingApproval', api) 

export default ioContext.api.pendingApproval
