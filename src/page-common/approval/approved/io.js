import ioContext from '../../../common/io-context'
import {approvalApi, get, post} from '../../../common/util'

const api = {
  getList: get(`${approvalApi}/myApprovaled`), // 我已审批列表
  getApplicant: post(`${approvalApi}/applicant`), // 申请人下拉列表
  getProject: post(`${approvalApi}/approvalProject`), // 所属项目下拉列表（待我/我已审批）
  getDetail: get(`${approvalApi}/myApplyDetails`), // 我的申请详情
} 

ioContext.create('approved', api) 

export default ioContext.api.approved
