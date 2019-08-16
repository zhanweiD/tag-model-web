import {Component} from 'react'
import {Icon, message, Modal} from 'antd'

export const pathPrefix = window.__onerConfig.pathPrefix || ''
// const {apiV} = window.__keeper

// 标签管理的API路径前缀
export const tagApi = `${pathPrefix}/api/v1`

// 标签、对象英文名校验正则
export const enNameReg = /^[a-zA-Z][a-zA-Z0-9_]{0,29}$/

export function asyncComponent(getComponent) {
  return class AsyncComponent extends Component {
    static Component = null
    state = {Component: AsyncComponent.Component}

    componentWillMount() {
      if (!this.state.Component) {
        getComponent().then(Component => {
          AsyncComponent.Component = Component
          this.setState({Component})
        })
      }
    }

    render() {
      const {Component} = this.state
      if (Component) {
        return <Component {...this.props} />
      }
      return null
    }
  }
}

// 统一成功提示
export function successTip(content) {
  message.success(content)
}

// 统一失败提示
export function errorTip(title, content) {
  const l = arguments.length
  if (l === 0) {
    title = '系统异常'
  } else if (l === 1) {
    content = title
    title = ''
  }
  Modal.error({
    title,
    content,
  })
}

// 统一信息提示
export function infoTip(content) {
  message.info(content)
}

// 统一警告提示
export function warningTip(content) {
  message.warning(content)
}


// export function getNickName(userId, userList = window.userList || []) {
//   if (!userId || userList.length === 0) {
//     return '未知'
//   }
//   let userIdArr = []
//   const userNameArr = []
//   if (typeof (userId) === 'object') {
//     userIdArr = userId
//   } else if (typeof (userId) === 'number') {
//     userIdArr = [userId]
//   } else if (typeof (userId) === 'string' && userId.indexOf(',') > -1) {
//     userIdArr = userId.split(',')
//   } else {
//     userIdArr = [userId]
//   }
//   userIdArr.map(id => {
//     const user = userList.filter(item => {
//       if (typeof (id) === 'string') {
//         id = parseInt(id, 10)
//       }
//       return item.userId === id
//     })
//     if (user.length > 0) {
//       userNameArr.push(user[0].nickName)
//     } else {
//       // 用户列表中找不到此userId
//       // userNameArr.push(id)
//       userNameArr.push('未知')
//     }
//     return id
//   })

//   return userNameArr.join(',')
// }

// 将后端打平的数据结构处理成树组件需要的数据结构
export function listToTree(data) {
  const newData = _.cloneDeep(data)

  newData.forEach(item => {
    const children = newData.filter(sitem => sitem.parentId === item.id)
    if (children.length && !item.children) item.children = children
  })

  return newData.filter(item => item.parentId === 0)
}

export const dateFormat = 'YYYY-MM-DD'

// 告警规则图表 数据处理
export function calcSize(size, defaultUnit = 'B', isToFixed = true) {
  const map = {
    b: 1,
    kb: 2 ** 10,
    mb: 2 ** 20,
    gb: 2 ** 30,
    tb: 2 ** 40,
  }

  // 后端给的是单位是B
  size = parseInt(size, 10)

  // 添加正负数判断
  // let isNegative = false
  if (size < 0) {
    // isNegative = true
    size = Math.abs(size)
  }

  if (size === 0) {
    return '0 B'
  } if (size < map.mb && size >= map.kb) {
    defaultUnit = 'KB'
  } else if (size < map.gb && size >= map.mb) {
    defaultUnit = 'MB'
  } else if (size < map.tb && size >= map.gb) {
    defaultUnit = 'GB'
  } else if (size >= map.tb) {
    defaultUnit = 'TB'
  }

  size = myToFixed(size, map[defaultUnit.toLowerCase()], isToFixed)
  return `${size} ${defaultUnit}`
}


export function getTrendIcon(str) {
  // 上升
  if (str === 1) return <Icon type="rise" theme="outlined" />
  // 持平
  if (str === 0) return <Icon type="stock" theme="outlined" />
  // 下降
  if (str === 2) return <Icon type="fall" theme="outlined" />

  return null
}

export function Time({timestamp, placeholder}) {
  return (
    <span>
      {timestamp ? (moment(+timestamp).format('YYYY-MM-DD HH:mm:ss')) : (placeholder ? '--' : '')}
    </span>
  )
}

/**
 * @Author mahua
 * @Date   2019-6-10
 * 
 * @export
 * @param {*} type 类型 周／月
 * @param {*} str  转换字符串 eg: 1,2,3,
 */
const weekList = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
export function formatTimeInterval(type, str) {
  if (!str || !type) {
    return null
  }

  const arr = str.split(',')
  let result = ''

  if (type === 'week') {
    result = arr.map(item => weekList[item - 1]).join(', ')
  } else if (type === 'month') {
    result = arr.map(item => `${item}号`).join(', ')
  } else {
    result = ''
  }

  return result
}



// 2019年08月08日15
export function isJsonFormat(str) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

// 判断某个值是不是空
export function isEmptyValue(value) {
  return value === undefined || value === null || value === ''
}

// 将值转成数字，不能转则返回 undefined
export function toNumberOrUndefined(value) {
  if (!isEmptyValue(value)) {
    value = parseFloat(value)
    value = Number.isNaN(value) ? undefined : value
  } else {
    value = undefined
  }
  return value
}

/**
 * @description 获取到今天之前的一个时间范围（参考time-range组件）
 * @author 三千
 * @date 2019-08-13
 * @param {*} {long = 7, unit = 'day', includeToday = false, format = 'YYYY-MM-DD'}
 * @param_explain unit - moment的时间单位，long - 多少个unit时间
 */
export function getTimeRangeToToday({
  long = 7, unit = 'day', includeToday = false, format = 'YYYY-MM-DD',
}) {
  let start
  let end

  const getDate = v => moment().subtract(v, unit).format(format)

  if (includeToday) { // 包括今天
    start = getDate(long - 1)
    end = getDate(0)
  } else { // 不包括今天
    start = getDate(long)
    end = getDate(1)
  }

  return [start, end]
}

// 数据类型映射 (window.njkData下没有了，不可靠啊...)
export const DATA_TYPES = [
  {
    key: 2,
    value: '整数型',
  },
  {
    key: 3,
    value: '小数型',
  },
  {
    key: 4,
    value: '文本型',
  },
  {
    key: 5,
    value: '日期型',
  },
]

// 根据数据类型的数字code 获取对应的文本
export function getDataTypeByCode(code) {
  switch (+code) {
    case 1:
      return '离散型'
    case 2:
      return '整数型'
    case 3:
      return '小数型'
    case 4:
      return '文本型'
    case 5:
      return '日期型'
    default:
      return `未知类型, code: ${code}`
  }
}
