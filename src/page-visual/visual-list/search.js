import {status} from '../util'

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
    label: '方案状态',
    key: 'status',
    initialValue: '',
    control: {
      defaultAll: true,
      options: status,
    },
    component: 'select',
  }, {
    label: '方案名称',
    key: 'keyword',
    control: {
      placeholder: '请输入方案名称关键字',
    },
    component: 'input', 
  },
]
export default serach
