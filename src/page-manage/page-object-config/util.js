import {Badge} from 'antd'
import treeUnfold from '../../icon/tree-unfold.svg'
import treeFold from '../../icon/tree-fold.svg'

export const getIconNodeSrc = e => (e ? treeUnfold : treeFold)

// 对象类目带有对象数量提示
export const TreeNodeTitle = ({node}) => (
  <span>
    {
      node.parentId ? node.name : `${node.name} (${node.count || 0})`
    }
  </span>
)

export const judgeEditType = (data, editType) => (editType === 'edit' ? data : undefined)

export const objDetailTabMap = [{
  name: '对象视图',
  value: 'view',
},
{
  name: '业务视图',
  value: 'business',
}, {
  name: '数据表',
  value: 'table',
}, {
  name: '字段列表',
  value: 'field',
}]

export const objRelTabMap = [{
  name: '对象视图',
  value: 'view',
}, {
  name: '业务视图',
  value: 'business',
}, {
  name: '数据表',
  value: 'table',
}]

// 使用状态
export const usedStatusMap = status => {
  let color 
  let text
  switch (status) {
    case 0: color = '#d9d9d9'; text = '未使用'; break
    case 1: color = '#108ee9'; text = '使用中'; break
    default: color = '#d9d9d9'; text = '未使用'; break
  }

  return <Badge color={color} text={text} />
}

// 配置状态
export const configStatusMap = status => {
  let color 
  let text
  switch (status) {
    case 0: color = '#d9d9d9'; text = '待配置'; break
    case 1: color = '#108ee9'; text = '已配置'; break
    default: color = '#d9d9d9'; text = '待配置'; break
  }

  return <Badge color={color} text={text} />
}

// 关联状态
export const relStatusMap = status => {
  let color 
  let text
  switch (status) {
    case 0: color = '#d9d9d9'; text = '未关联'; break
    case 1: color = '#108ee9'; text = '已关联'; break
    default: color = '#d9d9d9'; text = '未关联'; break
  }

  return <Badge color={color} text={text} />
}


// 标签状态
export const tagStatusMap = status => {
  let color 
  let text
  switch (status) {
    case 0: color = '#d9d9d9'; text = '待配置'; break
    case 1: color = '#d9d9d9'; text = '待发布'; break
    case 2: color = '#108ee9'; text = '已发布'; break
    default: color = '#d9d9d9'; text = '待配置'; break
  }

  return <Badge color={color} text={text} />
}

// 对象类型映射
export const objTypeMap = {
  0: '简单关系',
  1: '复杂关系',
  2: '实体',
}
