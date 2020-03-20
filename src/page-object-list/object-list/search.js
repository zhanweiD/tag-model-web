
const serach = ({objTypeList, objCateList}) => [
  {
    label: '对象类型',
    key: 'type',
    control: {
      mode: 'multiple',
      options: objTypeList,
    },
    component: 'select',
  }, {
    label: '对象类目',
    key: 'objCateId',
    control: {
      mode: 'multiple',
      options: objCateList,
    },
    component: 'select',
  }, {
    label: '对象名称',
    key: 'keyword',
    component: 'input',
  },
]
export default serach