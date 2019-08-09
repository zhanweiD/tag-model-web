
// 排序字段的映射，antd Table sorter字段 -> 后端接口要的字段
const ORDER_MAP = {
  ascend: 'ASC',
  descend: 'DESC',
}

export function getOrderAlias(name) {
  return ORDER_MAP[name]
}
