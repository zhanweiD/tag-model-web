import intl from 'react-intl-universal'
import {
  tagStatusMap,
  usedStatusMap,
  publishStatusMap,
  tagConfigMethodMap,
} from '../util'

const serach = ({ objectSelectList = [] }) => [
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
    label: intl
      .get('ide.src.page-manage.page-aim-source.source-detail.main.16o5qwy427p')
      .d('标签状态'),
    key: 'status',
    initialValue: '',
    control: {
      defaultAll: true,
      options: tagStatusMap,
    },

    component: 'select',
  },
  {
    label: intl
      .get('ide.src.page-config.workspace-config.main.4eyw4o6e3dr')
      .d('使用状态'),
    key: 'isUsed',
    initialValue: '',
    control: {
      defaultAll: true,
      options: usedStatusMap,
    },

    component: 'select',
  },

  {
    label: intl
      .get('ide.src.page-manage.page-common-tag.detail.main.2ziwjluj78c')
      .d('绑定方式'),
    key: 'configType',
    initialValue: '',
    control: {
      defaultAll: true,
      options: tagConfigMethodMap,
    },

    component: 'select',
  },

  {
    label: intl
      .get('ide.src.page-manage.page-aim-source.source-detail.main.63kvhqd3cw8')
      .d('标签名称'),
    key: 'keyword',
    control: {
      placeholder: intl
        .get(
          'ide.src.page-manage.page-tag-model.tag-model.tag-list.search.hkdxzb1n1yo'
        )
        .d('请输入标签名称关键字搜索'),
    },

    component: 'input',
  },
]

export default serach
