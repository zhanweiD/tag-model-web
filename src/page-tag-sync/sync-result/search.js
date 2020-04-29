const serach = () => [
  {
    label: '数据源',
    key: 'storageId',
    initialValue: '',
    control: {
      defaultAll: true,
      options: [],
    },
    component: 'select',
  }, {
    label: '对象名称',
    key: 'objId',
    initialValue: '',
    control: {
      defaultAll: true,
      options: [],
    },
    component: 'select',
  }, {
    label: '使用状态',
    key: 'lastStatus',
    initialValue: '',
    control: {
      defaultAll: true,
      options: [],
    },
    component: 'select',
  }, {
    label: '同步计划',
    key: 'transferSchemeName',
    control: {
      placeholder: '请输入计划名称关键字',
    },
    component: 'input',
  }, {
    label: '标签名称',
    key: 'tagName',
    control: {
      placeholder: '请输入标签名称关键字',
    },
    component: 'input',
  },
]
export default serach
