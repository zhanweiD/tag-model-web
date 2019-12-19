// module.exports = {
//   dateFormat: 'YYYY-MM-DD',
//   isExitMsg: '名称已经存在',
//   cycleSelectMap: {
//     day: '每天',
//     week: '每周',
//     month: '每月',
//   },
//   navListMap: {
//     assetMgt: {
//       url: '/',
//       text: '数据资产管理',
//     },
//     tagMgt: {
//       text: '标签管理',
//       url: '/map',
//     },
//     tagPool: {
//       text: '标签池',
//       url: '/pool#/',
//     },
//   },
// }


export const IS_EXIT_MSG = '名称已经存在'

export const DATE_FORMAT = 'YYYY-MM-DD'

// 审批管理 - 申请类型
export const APPLY_TYPE = [{
  name: '授权使用',
  value: 0,
}, {
  name: '上下架',
  value: 1,
}]

// 审批管理 - 申请状态
export const APPLY_STATUS = [{
  name: '审核中',
  value: 0,
}, {
  name: '审核通过',
  value: 1,
}, {
  name: '审核失败',
  value: 2,
}, {
  name: '已撤销',
  value: 3,
}]
