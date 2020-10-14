const serach = ({
  objList,
}) => [
  {
    label: '对象',
    key: 'objId',
    initialValue: '',
    control: {
      defaultAll: true,
      options: objList,
    },
    component: 'select',
  }, {
    label: '目的源名称',
    key: 'keyword',
    control: {
      placeholder: '请输入目的源名称关键字',
    },
    component: 'input',
  },
]
export default serach
