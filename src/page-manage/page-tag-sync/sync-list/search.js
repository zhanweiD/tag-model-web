import intl from 'react-intl-universal'
import { syncStatus } from '../util'

const serach = ({ objList }) => [
  {
    label: intl
      .get('ide.src.page-manage.page-tag-sync.sync-list.main.882htd8mhmo')
      .d('计划名称'),
    key: 'name',
    control: {
      placeholder: intl
        .get('ide.src.page-manage.page-sync-result.search.7qjykzh2stv')
        .d('请输入计划名称关键字'),
    },

    component: 'input',
  },
  {
    label: intl
      .get(
        'ide.src.page-manage.page-aim-source.source-detail.modal.hdb36gt6rzf'
      )
      .d('对象'),
    key: 'objId',
    initialValue: '',
    control: {
      defaultAll: true,
      options: objList,
    },

    component: 'select',
  },
  {
    label: intl
      .get('ide.src.page-manage.page-tag-sync.sync-list.main.k2rwrgspl4o')
      .d('计划状态'),
    key: 'status',
    initialValue: '',
    control: {
      defaultAll: true,
      options: syncStatus,
    },

    component: 'select',
  },
]

export default serach
