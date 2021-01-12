import intl from 'react-intl-universal'
import { toJS } from 'mobx'
import { schemeTypeMap, schemeStatusMap } from '../util'

const serach = ({ objList }) => [
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
      options: toJS(objList),
    },

    component: 'select',
  },
  {
    label: intl
      .get('ide.src.page-process.schema-detail.main.tua55dlv62t')
      .d('方案类型'),
    key: 'type',
    initialValue: '',
    control: {
      defaultAll: true,
      options: schemeTypeMap,
    },

    component: 'select',
  },
  {
    label: intl
      .get('ide.src.page-process.schema-list.main.q0jida1yspd')
      .d('方案状态'),
    key: 'status',
    initialValue: '',
    control: {
      defaultAll: true,
      options: schemeStatusMap,
    },

    component: 'select',
  },
  {
    label: intl
      .get('ide.src.page-manage.page-tag-sync.sync-list.step-three.o5xmbmtg9qr')
      .d('方案名称'),
    key: 'keyword',
    component: 'input',
  },
]

export default serach
