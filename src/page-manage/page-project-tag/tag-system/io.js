import ioContext from '../../../common/io-context'
import {tagModalApi, marketApi, approvalApi, projectApi, baseApi, get, post} from '../../../common/util'

const api = {
  // getList: get(`${approvalApi}/myApprovaled`), // 我已审批列表
  // getApplicant: post(`${approvalApi}/applicant`), // 申请人下拉列表

  getTagBaseDetail: get(`${tagModalApi}/tag_detail`), // 标签详情
  applyTag: post(`${marketApi}/tagApply`), // 标签申请
  getProjectDetail: get(`${projectApi}/details`), // 项目详情
  // getTreeData: get(`${baseApi}/tag/pool/tag_tree_system`), // 标签体系树
  getTreeData: get('http://192.168.90.129:3000/mock/119/tag/pool/tag_tree_system'), // 标签体系树
} 

ioContext.create('approved', api) 

export default ioContext.api.approved
