// 审批管理 - 我已审批

module.exports = {
  success: true,
  message: null,
  code: '0',
  currentPage: 1,
  content: {
    totalCount: 100,
    pages: 2,
    pageSize: 10,
    data: [
      {
        id: 53453245435435, // 申请id
        type: 0, // 申请类型 0 授权使用 1 上架 2 下架
        projectName: '项目名',
        content: '申请内容',
        userName: '申请人',
        cTime: 21321321321,
        appyInterval: '2019/09/09-2021/08/01', //  申请时长,
        status: 0, // 0 审批中 1 审批通过 2 审批未通过
      },
      {
        id: 53453245435435,
        type: 0, // 申请类型 0 授权使用 1 上架 2 下架
        projectName: '项目名',
        content: '申请内容',
        userName: '申请人',
        cTime: 21321321321,
        appyInterval: '永久', //  申请时长
        status: 0, // 0 审批中 1 审批通过 2 审批未通过
      },
    ],
  },
}
