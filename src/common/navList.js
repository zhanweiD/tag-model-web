import intl from 'react-intl-universal'

/*
 * @description 面包屑设置
 */

const pathPrefix = '/tag-model/index.html#'
// 标签中心
const tagCenter = {
  tagCenter: {
    url: `${pathPrefix}/overview`,
    text: intl.get('ide.src.common.navList.rf1adwfz5e').d('标签中心'),
  },
}

// 总览
const overview = {
  overview: {
    text: intl.get('ide.src.common.navList.ftbdjpmt406').d('总览'),
  },
}

// 标签集市
const market = {
  market: {
    text: intl.get('ide.src.common.navList.2yybv92rzpp').d('集市'),
  },
}

// 对象管理
const object = {
  object: {
    url: `${pathPrefix}/object-list`,
    text: intl.get('ide.src.common.navList.au81mrbmeqo').d('对象管理'),
  },

  objectList: {
    url: `${pathPrefix}/object-list`,
    text: intl.get('ide.src.common.navList.c2lnohs0y4n').d('对象列表'),
  },

  objectDetail: {
    text: intl.get('ide.src.common.navList.tskbk1cdaw').d('对象详情'),
  },

  objectModel: {
    text: intl.get('ide.src.common.navList.oerfqubqsve').d('对象模型'),
  },
}

// 标签管理
const tagManagement = {
  tagManagement: {
    url: `${pathPrefix}/tag-warehouse`,
    text: intl.get('ide.src.common.navList.yj7vyhgzmw8').d('标签管理'),
  },

  objectConfig: {
    text: intl.get('ide.src.common.navList.1u4wc7wzm02').d('对象配置'),
  },

  tagWarehouse: {
    text: intl.get('ide.src.common.navList.8mxknj3zxe').d('标签仓库'),
  },

  tagModel: {
    url: `${pathPrefix}/tag-model`,
    text: intl.get('ide.src.common.navList.bmnnu96l68r').d('标签模型'),
  },

  tagDetail: {
    text: intl.get('ide.src.common.navList.sxgp2b02lvc').d('标签详情'),
  },
}

// 标签加工
const tagSchema = {
  tagSchema: {
    url: `${pathPrefix}/tag-schema`,
    text: intl.get('ide.src.common.navList.9asijq2ikmn').d('标签加工'),
  },

  schemaList: {
    url: `${pathPrefix}/tag-schema`,
    text: intl.get('ide.src.common.navList.stsyfv7j7wk').d('TQL加工方案'),
  },

  schemaDetail: {
    text: intl.get('ide.src.common.navList.tbcpwwe2gcf').d('加工方案详情'),
  },
}

const application = {
  application: {
    url: `${pathPrefix}/scene`,
    text: intl.get('ide.src.common.navList.ytx92v611jp').d('标签应用'),
  },

  scene: {
    url: `${pathPrefix}/scene`,
    text: intl.get('ide.src.common.navList.x8t1yry6bqg').d('场景管理'),
  },

  sceneDetail: {
    text: intl.get('ide.src.common.navList.2xlwze2zjd8').d('场景详情'),
  },

  sceneTags: {
    text: intl.get('ide.src.common.navList.5ywghq8b76s').d('标签列表'),
  },
}

const sync = {
  tagSync: {
    url: `${pathPrefix}/tag-sync`,
    text: intl.get('ide.src.common.navList.mg5ofl3blh').d('标签同步'),
  },

  syncPlan: {
    url: `${pathPrefix}/tag-sync`,
    text: intl.get('ide.src.common.navList.5pko0l7i7qx').d('同步计划'),
  },

  syncDetail: {
    text: intl.get('ide.src.common.navList.6z5wxn0hlbe').d('同步详情'),
  },

  syncResult: {
    url: `${pathPrefix}/tag-sync/result`,
    text: intl.get('ide.src.common.navList.popzae466x').d('同步结果'),
  },

  aimSource: {
    url: `${pathPrefix}/aim-source`,
    text: intl.get('ide.src.common.navList.f777ubhv3uk').d('目的源管理'),
  },

  aimSourceDetail: {
    text: intl.get('ide.src.common.navList.szfh0z4atrb').d('目的源详情'),
  },
}

const common = {
  common: {
    url: `${pathPrefix}/project`,
    text: intl.get('ide.src.common.navList.fvd0xuxo22s').d('公共模块'),
  },
}

// 项目列表
const project = {
  project: {
    url: `${pathPrefix}/project`,
    text: intl.get('ide.src.common.navList.uu6h9e6gaqq').d('项目列表'),
  },

  projectConfig: {
    text: intl.get('ide.src.common.navList.papz1oc75mi').d('项目配置'),
  },
}

// 审批管理
const approval = {
  approval: {
    url: `${pathPrefix}/approval`,
    text: intl.get('ide.src.common.navList.0ujwqvq35vi').d('审批管理'),
  },

  myRequests: {
    text: intl.get('ide.src.common.navList.k354hf8mkg').d('我的申请'),
  },

  pendingApproval: {
    text: intl.get('ide.src.common.navList.qocqf1s16e').d('待我审批'),
  },

  approved: {
    text: intl.get('ide.src.common.navList.khg0gyovpy7').d('我已审批'),
  },
}

// 可视化
const visual = {
  visual: {
    url: `${pathPrefix}/visual`,
    text: intl.get('ide.src.common.navList.z7iaipxmhrk').d('可视化方案'),
  },

  visualConfig: {
    text: intl.get('ide.src.common.navList.vlaex0afh6e').d('方案配置'),
  },

  visualDetail: {
    text: intl.get('ide.src.common.navList.61na6elu3os').d('方案详情'),
  },

  visualTagList: {
    text: intl.get('ide.src.common.navList.15k7i49v1if').d('衍生标签列表'),
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
