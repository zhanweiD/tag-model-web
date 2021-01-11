import intl from 'react-intl-universal'

const serach = ({ objTypeList, objCateList }) => [
  {
    label: intl
      .get('ide.src.page-manage.page-object-model.detail.qksgujny9q')
      .d('对象类型'),
    key: 'type',
    size: 'small',
    control: {
      mode: 'multiple',
      options: objTypeList,
    },

    component: 'select',
  },
  {
    label: intl
      .get('ide.src.page-manage.page-object-model.detail.ml3nv2hkkdo')
      .d('对象类目'),
    key: 'objCateId',
    size: 'small',
    control: {
      mode: 'multiple',
      options: objCateList,
    },

    component: 'select',
  },
  {
    label: intl
      .get(
        'ide.src.page-manage.page-object-model.object-list.object-list.main.9c8ou0oxjir'
      )
      .d('对象名称'),
    key: 'keyword',
    component: 'input',
  },
]

export default serach
