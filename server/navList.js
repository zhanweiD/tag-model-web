
/*
 * @description 面包屑设置
*/


// 标签中心
const tagCenter = {
  // 资产管理
  asset: {
    url: '/',
    text: '资产管理',
  },
  tagCenter: {
    url: '/overview',
    text: '标签中心',
  },
}

// 总览
const overview = {
  overview: {
    // url: '/overview',
    text: '总览',
  },
}

// 标签集市
const market = {
  market: {
    // url: '/marker',
    text: '标签集市',
  },
}

// 对象管理
const object = {
  object: {
    // url: '/object',
    text: '对象管理',
  },
}

// 项目列表
const project = {
  project: {
    url: '/project',
    text: '项目列表',
  },
  projectConfig: {
    text: '项目配置',
  },
}

// 项目空间
const space = {
  space: {
    url: '/object-config',
    text: '项目空间',
  },
  objectConfig: {
    url: '/object-config',
    text: '对象配置',
  },
  tagManagement: {
    url: '/tag-management',
    text: '标签模型',
  },
  tagDetail: {
    text: '标签详情',
  },
  scene: {
    url: '/scene',
    text: '场景管理',
  }, 
  sceneDetail: {
    // url: '/scene',
    text: '场景详情',
  },
  sceneTags: {
    // url: '/scene',
    text: '标签列表',
  },
  tagWarehouse: {
    url: '/tag-search',
    text: '标签仓库',
  },
}

// 审批管理
const approval = {
  approval: {
    url: '/approval',
    text: '审批管理',
  },
  myRequests: {
    text: '我的申请',
  },
  pendingApproval: {
    text: '待我审批',
  },
  approved: {
    text: '我已审批',
  },
}

const navListMap = { 
  ...tagCenter,
  ...overview,
  ...market,
  ...object,
  ...project,
  ...space,
  ...approval,
}

module.exports = navListMap
