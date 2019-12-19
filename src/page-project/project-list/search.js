const serach = ({cUser = []}) => [
  {
    label: '所有者',
    key: 'cUserId',
    initialValue: '',
    control: {
      defaultAll: true,
      options: cUser,
    },
    component: 'select',
  }, {
    label: '创建时间',
    key: 'time',
    component: 'rangePicker',
  }, 
  {
    label: '项目名称',
    key: 'name',
    control: {
      placeholder: '请输入项目名称关键字搜索',
    },
    component: 'input',
  },
]
export default serach
