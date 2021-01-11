import intl from 'react-intl-universal'
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
      options: objList,
    },

    component: 'select',
  },
  {
    label: intl
      .get('ide.src.page-manage.page-aim-source.source-list.drawer.u411cezuxlh')
      .d('目的源名称'),
    key: 'keyword',
    control: {
      placeholder: intl
        .get(
          'ide.src.page-manage.page-aim-source.source-list.search.6101doefae8'
        )
        .d('请输入目的源名称关键字'),
    },

    component: 'input',
  },
]

export default serach
