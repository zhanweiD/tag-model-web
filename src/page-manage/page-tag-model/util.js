import intl from 'react-intl-universal'
import { Badge } from 'antd'
import treeUnfold from '../../icon/tree-unfold.svg'
import treeFold from '../../icon/tree-fold.svg'

export const getIconNodeSrc = e => (e ? treeUnfold : treeFold)

// 对象类目带有对象数量提示
export const TreeNodeTitle = ({ node }) => (
  <span>{node.parentId ? node.name : `${node.name} (${node.count || 0})`}</span>
)

export const judgeEditType = (data, editType) =>
  editType === 'edit' ? data : undefined

export const objDetailTabMap = [
  {
    name: intl
      .get('ide.src.page-manage.page-object-model.detail.rnj5knhzw8')
      .d('对象视图'),
    value: 'view',
  },

  {
    name: intl
      .get('ide.src.page-manage.page-aim-source.source-list.main.bh6e3tzii5')
      .d('数据表'),
    value: 'table',
  },
  {
    name: intl.get('ide.src.common.navList.5ywghq8b76s').d('标签列表'),
    value: 'list',
  },
  {
    name: intl
      .get('ide.src.page-manage.page-aim-source.source-detail.main.yjl6a0fdf2l')
      .d('字段列表'),
    value: 'field',
  },
]

export const objRelTabMap = [
  {
    name: intl
      .get('ide.src.page-manage.page-object-model.detail.rnj5knhzw8')
      .d('对象视图'),
    value: 'view',
  },

  {
    name: intl
      .get('ide.src.page-manage.page-aim-source.source-list.main.bh6e3tzii5')
      .d('数据表'),
    value: 'table',
  },
]

// 使用状态
export const usedStatusMap = status => {
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

// 配置状态
export const configStatusMap = status => {
  let color
  let text
  switch (status) {
    case 0:
      color = '#d9d9d9'
      text = intl
        .get(
          'ide.src.page-manage.page-tag-model.data-sheet.config-field-step-one.k6tc0vxgvc'
        )
        .d('待配置')
      break
    case 1:
      color = '#108ee9'
      text = intl
        .get(
          'ide.src.page-manage.page-tag-model.data-sheet.config-field-step-one.08rkfw56dlng'
        )
        .d('已配置')
      break
    default:
      color = '#d9d9d9'
      text = intl
        .get(
          'ide.src.page-manage.page-tag-model.data-sheet.config-field-step-one.k6tc0vxgvc'
        )
        .d('待配置')
      break
  }

  return <Badge color={color} text={text} />
}

// 关联状态
export const relStatusMap = status => {
  let color
  let text
  switch (status) {
    case 0:
      color = '#d9d9d9'
      text = intl
        .get('ide.src.page-manage.page-tag-model.util.sfkcb1tsp7')
        .d('未关联')
      break
    case 1:
      color = '#108ee9'
      text = intl
        .get('ide.src.page-manage.page-tag-model.util.zu3bnu97jtf')
        .d('已关联')
      break
    default:
      color = '#d9d9d9'
      text = intl
        .get('ide.src.page-manage.page-tag-model.util.sfkcb1tsp7')
        .d('未关联')
      break
  }

  return <Badge color={color} text={text} />
}

// 标签状态
export const tagStatusMap = status => {
  let color
  let text
  switch (status) {
    case 0:
      color = '#d9d9d9'
      text = intl
        .get(
          'ide.src.page-manage.page-tag-model.data-sheet.config-field-step-one.k6tc0vxgvc'
        )
        .d('待配置')
      break
    case 1:
      color = '#d9d9d9'
      text = intl
        .get('ide.src.page-manage.page-object-model.detail.3fpa4r1400q')
        .d('待发布')
      break
    case 2:
      color = '#108ee9'
      text = intl
        .get('ide.src.page-manage.page-object-model.detail.mayalaiwna')
        .d('已发布')
      break
    default:
      color = '#d9d9d9'
      text = intl
        .get(
          'ide.src.page-manage.page-tag-model.data-sheet.config-field-step-one.k6tc0vxgvc'
        )
        .d('待配置')
      break
  }

  return <Badge color={color} text={text} />
}

// 对象类型映射
export const objTypeMap = {
  0: intl
    .get('ide.src.page-manage.page-object-model.object-list.util.b78dpbz8x4u')
    .d('简单关系'),
  1: intl
    .get('ide.src.page-manage.page-object-model.object-list.util.gc2qgcsh5xa')
    .d('复杂关系'),
  2: intl.get('ide.src.common.dict.yy6bfwytt9').d('实体'),
}
