import ioContext from '../../common/io-context'
import {approvalApi, get, post} from '../../common/util'

const isMock = false
const api = {
  getList: get(`${approvalApi}/myApprovaled`, {
    mock: isMock,
    mockUrl: 'page-approval/approved',
  }), // 我已审批列表
  getApplicant: post(`${approvalApi}/applicant`), // 申请人下拉列表
} 

ioContext.create('approved', api) 

export default ioContext.api.approved
