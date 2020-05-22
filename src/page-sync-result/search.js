const serach = ({objList, storageList}) => [
  {
    label: '数据源',
    key: 'storageId',
    initialValue: '',
    control: {
      defaultAll: true,
      options: storageList,
    },
    component: 'select',
  }, {
    label: '对象名称',
    key: 'objId',
    initialValue: '',
    control: {
      defaultAll: true,
      options: objList,
    },
    component: 'select',
  }, {
    label: '使用状态',
    key: 'tagUsed',
    initialValue: '',
    control: {
      defaultAll: true,
      options: [{name: '使用中', value: 1}, {name: '未使用', value: 0}],
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
