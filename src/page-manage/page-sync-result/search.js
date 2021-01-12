import intl from 'react-intl-universal'
const serach = ({ objList = [], storageList = [] }) => [
  {
    label: intl
      .get('ide.src.page-config.workspace-config.main.1b0l5lpgghm')
      .d('数据源类型'),
    key: 'storageType',
    initialValue: '',
    control: {
      defaultAll: true,
      options: [
        { name: 'MySQL', value: 1 },
        { name: 'Greenplum', value: 10 },
        { name: 'PostgreSQL', value: 11 },
        { name: 'Oracle', value: 2 },
      ],
    },

    component: 'select',
  },
  {
    label: intl
      .get('ide.src.business-component.tag-relate.dag-box.9mzk7452ggp')
      .d('数据源'),
    key: 'storageId',
    initialValue: '',
    control: {
      defaultAll: true,
      options: storageList,
    },

    component: 'select',
  },
  {
    label: intl
      .get(
        'ide.src.page-manage.page-object-model.object-list.object-list.main.9c8ou0oxjir'
      )
      .d('对象名称'),
    key: 'objId',
    initialValue: '',
    control: {
      defaultAll: true,
      options: objList,
    },

    component: 'select',
  },

  // {
  //   label: '使用状态',
  //   key: 'tagUsed',
  //   initialValue: '',
  //   control: {
  //     defaultAll: true,
  //     options: [{name: '使用中', value: 1}, {name: '未使用', value: 0}],
  //   },
  //   component: 'select',
  // },
  {
    label: intl.get('ide.src.common.navList.5pko0l7i7qx').d('同步计划'),
    key: 'transferSchemeName',
    control: {
      placeholder: intl
        .get('ide.src.page-manage.page-sync-result.search.7qjykzh2stv')
        .d('请输入计划名称关键字'),
    },

    component: 'input',
  },
  {
    label: intl
      .get('ide.src.page-manage.page-aim-source.source-detail.main.63kvhqd3cw8')
      .d('标签名称'),
    key: 'tagName',
    control: {
      placeholder: intl
        .get(
          'ide.src.page-manage.page-object-model.object-list.object-detail.tag-list.ncn8t6qj01d'
        )
        .d('请输入标签名称关键字'),
    },

    component: 'input',
  },
]

export default serach
