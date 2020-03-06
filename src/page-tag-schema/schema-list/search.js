import {toJS} from 'mobx'
import {schemeTypeMap, schemeStatusMap} from '../util'

const serach = ({objList}) => [
  {
    label: '对象',
    key: 'objId',
    initialValue: '',
    control: {
      defaultAll: true,
      options: toJS(objList),
    },
    component: 'select',
  }, {
    label: '方案类型',
    key: 'type',
    initialValue: '',
    control: {
      defaultAll: true,
      options: schemeTypeMap,
    },
    component: 'select',
  }, {
    label: '方案状态',
    key: 'status',
    initialValue: '',
    control: {
      defaultAll: true,
      options: schemeStatusMap,
    },
    component: 'select',
  }, {
    label: '方案名称',
    key: 'keyWord',
    component: 'input',
  },
]
export default serach
