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
    label: '创建时间',
    key: 'time',
    component: 'rangePicker',
  }, 
  {
    label: '目的源名称',
    key: 'name',
    control: {
      placeholder: '请输入目的源名称关键字',
    },
    component: 'input',
  },
]
export default serach
