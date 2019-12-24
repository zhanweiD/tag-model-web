import {APPLY_TYPE, APPLY_STATUS} from '../common/comp-approval-status'

const serach = ({projectList = []}) => [
  {
    label: '申请类型',
    key: 'type',
    initialValue: '',
    control: {
      defaultAll: true,
      options: APPLY_TYPE,
    },
    component: 'select',
  }, {
    label: '所属项目',
    key: 'projectId',
    initialValue: '',
    control: {
      defaultAll: true,
      options: projectList,
    },
    component: 'select',
  }, {
    label: '申请时间',
    key: 'time',
    component: 'rangePicker',
  }, {
    label: '申请状态',
    key: 'status',
    initialValue: '',
    control: {
      defaultAll: true,
      options: APPLY_STATUS,
    },
    component: 'select',
  }, {
    label: '申请内容',
    key: 'keyWord',
    component: 'input',
  },
]
export default serach
