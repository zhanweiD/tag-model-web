import intl from 'react-intl-universal'
import {APPLY_TYPE, APPROVAL_STATUS} from '../common/comp-approval-status'

const serach = ({projectList = [], applicant = []}) => [
  {
    label: intl.get('ide.src.component.comp.search.w8q224fq9jt').d('申请类型'),
    key: 'type',
    initialValue: '',
    control: {
      options: APPLY_TYPE,
    },

    component: 'select',
  },
  {
    label: intl.get('ide.src.component.comp.search.h5l3m6s8dn7').d('所属项目'),
    key: 'projectId',
    initialValue: '',
    control: {
      defaultAll: true,
      options: projectList.length
        ? projectList
        : [
          {
            name: intl
              .get('ide.src.component.comp.search.e0mn12fihkg')
              .d('全部'),
            value: '',
          },
        ],
    },

    component: 'select',
  },
  {
    label: intl.get('ide.src.component.comp.search.bld1br247f').d('申请时间'),
    key: 'time',
    component: 'rangePicker',
  },
  {
    label: intl.get('ide.src.component.comp.search.bvm9ca9vbu').d('申请人'),
    key: 'applyUserId',
    initialValue: '',
    control: {
      defaultAll: true,
      options: applicant.length
        ? applicant
        : [
          {
            name: intl
              .get('ide.src.component.comp.search.e0mn12fihkg')
              .d('全部'),
            value: '',
          },
        ],
    },

    component: 'select',
  },
  {
    label: intl.get('ide.src.component.comp.search.plbscsdczmg').d('申请状态'),
    key: 'status',
    initialValue: '',
    control: {
      defaultAll: true,
      options: APPROVAL_STATUS,
    },

    component: 'select',
  },
  {
    label: intl.get('ide.src.component.comp.search.9dwmj8rn5ha').d('申请内容'),
    key: 'keyWord',
    component: 'input',
  },
]

export default serach
