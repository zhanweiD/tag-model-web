
/*
 * @description 面包屑设置
*/

const pathPrefix = '/asset_tag/index.html#'
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
    text: '加工方案',
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
}

module.exports = navListMap
