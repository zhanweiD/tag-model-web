
const serach = ({objTypeList, objCateList}) => [
  {
    label: '对象类型',
    key: 'type',
    control: {
      defaultAll: true,
      options: objTypeList,
    },
    component: 'select',
  }, {
    label: '对象类目',
    key: 'objCateId',
    control: {
      defaultAll: true,
      options: objCateList,
    },
    component: 'select',
  }, {
    label: '申请内容',
    key: 'keyword',
    component: 'input',
  },
]
export default serach
