
/*
 * @description 面包屑设置
*/

const pathPrefix = '/tag-model/index.html#'
// 标签中心
const tagCenter = {
  tagCenter: {
    url: `${pathPrefix}/overview`,
    text: '标签中心',
  },
}

// 总览
const overview = {
  overview: {
    text: '总览',
  },
}

// 标签集市
const market = {
  market: {
    text: '集市',
  },
}

// 对象管理
const object = {
  object: {
    url: `${pathPrefix}/object-list`,
    text: '对象管理',
  },
  objectList: {
    url: `${pathPrefix}/object-list`,
    text: '对象列表',
  },
  objectDetail: {
    text: '对象详情',
  },
  objectModel: {
    text: '对象模型',
  },
}

// 标签管理
const tagManagement = {
  tagManagement: {
    url: `${pathPrefix}/tag-warehouse`,
    text: '标签管理',
  },
  objectConfig: {
    text: '对象配置',
  },
  tagWarehouse: {
    text: '标签仓库',
  },
  tagModel: {
    url: `${pathPrefix}/tag-model`,
    text: '标签模型',
  },
  tagDetail: {
    text: '标签详情',
  },
}

// 标签加工
const tagSchema = {
  tagSchema: {
    url: `${pathPrefix}/tag-schema`,
    text: '标签加工',
  },
  schemaList: {
    url: `${pathPrefix}/tag-schema`,
    text: 'TQL加工方案',
  },
  schemaDetail: {
    text: '加工方案详情',
  },
}

const application = {
  application: {
    url: `${pathPrefix}/scene`,
    text: '标签应用',
  }, 
  scene: {
    url: `${pathPrefix}/scene`,
    text: '场景管理',
  }, 
  sceneDetail: {
    text: '场景详情',
  },
  sceneTags: {
    text: '标签列表',
  },
}

const sync = {
  tagSync: {
    url: `${pathPrefix}/tag-sync`,
    text: '标签同步',
  }, 
  syncPlan: {
    url: `${pathPrefix}/tag-sync`,
    text: '同步计划',
  }, 
  syncDetail: {
    text: '同步详情',
  },
  syncResult: {
    url: `${pathPrefix}/tag-sync/result`,
    text: '同步结果',
  },
  aimSource: {
    url: `${pathPrefix}/aim-source`,
    text: '目的源管理',
  }, 
  aimSourceDetail: {
    text: '目的源详情',
  },
}

const common = {
  common: {
    url: `${pathPrefix}/project`,
    text: '公共模块',
  },
}

// 项目列表
const project = {
  project: {
    url: `${pathPrefix}/project`,
    text: '项目列表',
  },
  projectConfig: {
    text: '项目配置',
  },
}

// 审批管理
const approval = {
  approval: {
    url: `${pathPrefix}/approval`,
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

// 可视化
const visual = {
  visual: {
    url: `${pathPrefix}/visual`,
    text: '可视化方案',
  }, 
  visualConfig: {
    text: '方案配置',
  }, 
  visualDetail: {
    text: '方案详情',
  },
  visualTagList: {
    text: '衍生标签列表',
  },
}


const navListMap = { 
  ...tagCenter,
  ...overview,
  ...market,
  ...object,
  ...project,
  ...tagManagement,
  ...approval,
  ...application,
  ...tagSchema,
  ...common,
  ...sync,
  ...visual,
}

module.exports = navListMap
