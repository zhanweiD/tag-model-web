const serach = () => [
  {
    label: '对象',
    key: 'cUserId',
    initialValue: '',
    control: {
      defaultAll: true,
      options: [],
    },
    component: 'select',
  }, {
    label: '计划状态',
    key: 'cUserId',
    initialValue: '',
    control: {
      defaultAll: true,
      options: [],
    },
    component: 'select',
  }, {
    label: '计划名称',
    key: 'name',
    control: {
      placeholder: '请输入计划名称关键字',
    },
    component: 'input',
  },
]
export default serach
