import {APPLY_TYPE} from '../common/comp-approval-status'

const serach = ({projectList = [], applicant = []}) => [
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
    label: '申请人',
    key: 'applyUserId',
    initialValue: '',
    control: {
      defaultAll: true,
      options: applicant,
    },
    component: 'select',
  }, {
    label: '申请内容',
    key: 'keyWord',
    component: 'input',
  },
]
export default serach
