import intl from 'react-intl-universal'
import { Badge } from 'antd'
// 使用状态
export const usedStatusMap = [
  {
    name: intl.get('ide.src.component.tag.tag.ogvpoe5m3bg').d('未使用'),
    value: 0,
  },
  {
    name: intl
      .get('ide.src.page-config.workspace-config.main.ztbqzsc34bb')
      .d('使用中'),
    value: 1,
  },
]

export const usedStatusBadgeMap = status => {
  let color
  let text
  switch (status) {
    case 0:
      color = '#d9d9d9'
      text = intl.get('ide.src.component.tag.tag.ogvpoe5m3bg').d('未使用')
      break
    case 1:
      color = '#108ee9'
      text = intl
        .get('ide.src.page-config.workspace-config.main.ztbqzsc34bb')
        .d('使用中')
      break
    default:
      color = '#d9d9d9'
      text = intl.get('ide.src.component.tag.tag.ogvpoe5m3bg').d('未使用')
      break
  }

  return <Badge color={color} text={text} />
}

// 标签状态
export const tagStatusMap = [
  {
    name: intl
      .get('ide.src.page-manage.page-tag-model.tag-model.util.6vguv9zkjx')
      .d('待绑定'),
    value: 0,
  },
  {
    name: intl
      .get('ide.src.page-manage.page-object-model.detail.3fpa4r1400q')
      .d('待发布'),
    value: 1,
  },
  {
    name: intl
      .get('ide.src.page-manage.page-object-model.detail.mayalaiwna')
      .d('已发布'),
    value: 2,
  },
]

export const tagStatusBadgeMap = status => {
  let color
  let text
  switch (status) {
    case 0:
      color = '#d9d9d9'
      text = intl
        .get('ide.src.page-manage.page-tag-model.tag-model.util.6vguv9zkjx')
        .d('待绑定')
      break
    case 1:
      color = '#FEBB00'
      text = intl
        .get('ide.src.page-manage.page-object-model.detail.3fpa4r1400q')
        .d('待发布')
      break
    case 2:
      color = '#52C41A'
      text = intl
        .get('ide.src.page-manage.page-object-model.detail.mayalaiwna')
        .d('已发布')
      break
    default:
      color = '#d9d9d9'
      text = intl
        .get('ide.src.page-manage.page-tag-model.tag-model.util.6vguv9zkjx')
        .d('待绑定')
      break
  }

  return <Badge color={color} text={text} />
}

// 公开状态
export const publishStatusMap = [
  {
    name: intl
      .get('ide.src.page-manage.page-tag-model.tag-model.util.ehdjmjcod79')
      .d('下架'),
    value: 0,
  },
  {
    name: intl
      .get('ide.src.page-manage.page-tag-model.tag-model.util.ery4goj9mco')
      .d('上架'),
    value: 1,
  },
  {
    name: intl
      .get('ide.src.page-manage.page-tag-model.tag-model.util.1a990qgw6rz')
      .d('下架审批中'),
    value: 2,
  },
  {
    name: intl
      .get('ide.src.page-manage.page-tag-model.tag-model.util.2e6uh3pfdxv')
      .d('上架审批中'),
    value: 3,
  },
]

export const publishStatusBadgeMap = status => {
  let color
  let text
  switch (status) {
    case 0:
      color = '#d9d9d9'
      text = intl
        .get('ide.src.page-manage.page-tag-model.tag-model.util.ehdjmjcod79')
        .d('下架')
      break
    case 1:
      color = '#108ee9'
      text = intl
        .get('ide.src.page-manage.page-tag-model.tag-model.util.ery4goj9mco')
        .d('上架')
      break
    case 2:
      color = '#0078FF '
      text = intl
        .get('ide.src.page-manage.page-tag-model.tag-model.util.1a990qgw6rz')
        .d('下架审批中')
      break
    case 3:
      color = '#0078FF '
      text = intl
        .get('ide.src.page-manage.page-tag-model.tag-model.util.2e6uh3pfdxv')
        .d('上架审批中')
      break
    default:
      color = '#d9d9d9'
      text = intl
        .get('ide.src.page-manage.page-tag-model.tag-model.util.ehdjmjcod79')
        .d('下架')
      break
  }

  return <Badge color={color} text={text} />
}

// 标签配置方式 基础标签&统计
export const tagConfigMethodMap = [
  {
    name: intl
      .get('ide.src.page-manage.page-common-tag.detail.main.vwwmvcib39m')
      .d('基础标签'),
    value: 0,
  },
  {
    name: intl
      .get('ide.src.page-manage.page-common-tag.detail.main.mfs279f7xcc')
      .d('衍生标签'),
    value: 1,
  },
]

// 标签配置方式 基础标签&衍生标签
export const tagConfigMethodTableMap = {
  0: intl
    .get('ide.src.page-manage.page-common-tag.detail.main.vwwmvcib39m')
    .d('基础标签'),
  1: intl
    .get('ide.src.page-manage.page-common-tag.detail.main.mfs279f7xcc')
    .d('衍生标签'),
}

// 名称类型映射: 1 中文名 2 英文名
export const nameTypeMap = {
  name: 1,
  enName: 2,
}
