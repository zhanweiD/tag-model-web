// 审批管理 - 我的申请详情

module.exports = {
  success: true,
  message: null,
  code: '0',
  content: {
    projectName: '项目名字',
    applyUserName: '申请者',
    content: '申请内容',
    cTime: 32313421421, // 申请时间
    forever: 0, // 申请时长是否永久0否1是	
    applyDescr: '申请理由',
    approvalDescr: '审批描述',
    reviewUserName: '审核人名字',
    mTime: 32313421421, // 审核操作时间
    status: 2, // 申请状态 0 审核中 1 审核通过 2 审核失败 3 撤销
    type: 0,
  },
}
