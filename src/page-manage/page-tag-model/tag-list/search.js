import {tagStatusMap, usedStatusMap, publishStatusMap, tagConfigMethodMap} from '../util'

const serach = ({objectSelectList = []}) => [
  // {
  //   label: '对象',
  //   key: 'objId',
  //   initialValue: '',
  //   control: {
  //     defaultAll: true,
  //     options: objectSelectList.slice(),
  //   },
  //   component: 'select',
  // }, 
  {
    label: '标签状态',
    key: 'status',
    initialValue: '',
    control: {
      defaultAll: true,
      options: tagStatusMap,
    },
    component: 'select',
  }, {
    label: '使用状态',
    key: 'isUsed',
    initialValue: '',
    control: {
      defaultAll: true,
      options: usedStatusMap,
    },
    component: 'select',
  },
  {
    label: '绑定方式',
    key: 'configType',
    initialValue: '',
    control: {
      defaultAll: true,
      options: tagConfigMethodMap,
    },
    component: 'select',
  }, 
  {
    label: '标签名称',
    key: 'keyword',
    control: {
      placeholder: '请输入标签名称关键字搜索',
    },
    component: 'input',
  },
]
export default serach
