/* eslint-disable */
import {Component} from 'react'
import { message } from 'antd';
import {ErrorEater} from '@dtwave/uikit'

//*--------------- 方法类 (返回方法) ---------------*//
/**
 * @description 接口路径处理
 */
const {pathPrefix} = window.__keeper

// 接口前缀

export const baseApi = pathPrefix // 标签中心
export const overviewApi = `${pathPrefix}/overview`// 总览
export const projectApi = `${pathPrefix}/project` // 项目列表
export const approvalApi = `${pathPrefix}/apply` // 审批管理

export const tagClassApi = `${pathPrefix}/cate` // 标签类目
export const projectSpaceApi = `${pathPrefix}/project` // 项目空间
export const marketApi = `${pathPrefix}/tagMarket` // 标签集市

export const tagModalApi = `${pathPrefix}/tag` // 标签模型
export const sceneApi = `${pathPrefix}/occasion` // 场景管理

// 4.9.0
export const objectApi = `${pathPrefix}/object` // 对象管理
export const derivativeApi = `${pathPrefix}/derivative` // 衍生标签
export const tagWarehouseApi = `${pathPrefix}/map` // 标签仓库

export const syncApi =  `${pathPrefix}/transfer` // 标签同步
export const targetSourceApi =  `${pathPrefix}/targetSource` // 目的数据源

const createRequestFn = method => (url, config) => ({
  url,
  method,
  ...config,
})

// 生成get请求方法的配置对象
export const get = createRequestFn('GET')

// 生成post请求方法的配置对象
export const post = createRequestFn('POST')

/**
 * @description 转化成@antd Select-Options格式
 * @param0 list 
 * @param1 labelName 返回数据label 字段名
 * @param2 valueName 返回数据value 字段名
 */
export const changeToOptions = (list=[]) => (labelName, valueName) => list.map((obj={}) => ({ name: obj && obj[labelName], value: obj && obj[valueName] }))
export const changeToOptionsWithDisabled = (list=[]) => (labelName, valueName, disabledKey) => list.map((obj={}) => ({ name: obj && obj[labelName], value: obj && obj[valueName], disabled: obj && Number(obj[disabledKey])}))
/**
 * @description 遍历数组根据"id"值查找对应的"name"
 * @param {*} list 数组
 * @param {*} id 
 * @param {*} idName 数组对象中对应键值对中的key命名；默认name
 * @param {*} labelName 数组对象中对应键值对中的value命名;默认value
 */
export const keyToName = (list, id, idName = 'value', labelName = 'name') => {
  if(!list.length) return null
  const r = _.filter(list, (obj) => obj[idName] === id)[0] || {}
  return r[labelName]
}

/**
 * @description 深拷贝
 * @param {*} obj 
 */
export const deepCopy = obj => {
  if (typeof obj !== 'object') return obj
  const objClone = Array.isArray(obj) ? [] : {}
  // eslint-disable-next-line no-restricted-syntax
  for (const key of Object.keys(obj)) {
    // 判断ojb子元素是否为对象，如果是，递归复制
    if (obj[key] && typeof obj[key] === 'object') {
      objClone[key] = deepCopy(obj[key])
    } else {
      // 如果不是，简单复制
      objClone[key] = obj[key]
    }
  }
  return objClone
}

/**
 * @description 一纬数组合并去重
 * @param {*} arr1, arr2 
 */
export const combineArray = (arr1, arr2) => {
  let arr = arr1.concat(arr2)
  return Array.from(new Set(arr))
}

/**
 * @description 统一成功提示
 * @param content
 */
export function successTip(content) {
  message.success(content)
}

/**
 * @description 操作失败提示
 * @param content
 */
export function failureTip (content) {
  message.error(content)
}
/**
 * @description 接口异常提示
 * @param title
 */
export function errorTip(title) {
  ErrorEater(
    'default',
    title,
    e => console.log(e),
  )
}

/**
 * @description 将对象中的value值进行trim()转换
 * @param {*} values @typedef object
 */
export function trimFormValues(values) {
  Object.keys(values).map(k => {
    if (typeof values[k] === 'string') {
      values[k] = values[k].trim()
    }
  })
  return values
}

export function isJsonFormat(str) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

/**
 * @description 将后端打平的数据结构处理成树组件需要的数据结构
 * @param {*} data 类目树数据
 */
export function listToTree(data) {
  const newData = _.cloneDeep(data)

  newData.forEach(item => {
    const children = newData.filter(sitem => sitem.parentId === item.id)
    if (children.length && !item.children) item.children = children
  })

  return newData.filter(item => item.parentId === 0)
}

// 标签、对象英文名校验正则
export const enNameReg = /^[a-zA-Z][a-zA-Z0-9_]{0,31}$/

/**
 * @description 根据数据类型code 返回 数据类型name; 常用数据类型 整数型/小数型/文本型/日期型
 * @param {*} code 
 */


export const getDataTypeName = (code) => {
  const dataType = window.njkData.dict.dataType || []
  const filterItem = dataType.filter(d => +d.key === +code)[0] || {}
  return filterItem.value
}


export const codeInProduct = code => {
  // const functionCodes = window.productFunctionCode || []
  // return functionCodes.indexOf(code) > -1
  return true
}

//*------------------------------ 组件类 (返回组件) ------------------------------*//
/**
 * @description 异步加载组件
 * @param {*} getComponent 
 */
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

/**
 * @description 时间格式化
 * @param {*} timestamp 时间 
 */
export function Time({timestamp, placeholder}) {
  return (
    <span>
      {timestamp ? (moment(+timestamp).format('YYYY-MM-DD HH:mm:ss')) : (placeholder ? '--' : '')}
    </span>
  )
}

/**
 * @description 名称正则校验
 * @description 允许中文、英文、数字、下划线，不允许“数栖”或“下划线”开头，结尾不做限制
 * @author 麻花
 * @param max 名称长度最大值; 默认20
 */

export function getNamePattern(max = 32) {
  return [{
    transform: value => value && value.trim(),
  }, {
    max, 
    message: `名称不能超过${max}个字符`,
  }, {
    pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '名称格式不正确，允许输入中文/英文/数字/下划线',
  }, {
    pattern: /^(?!_)/, message: '名称不允许下划线开头',
  }, {
    pattern: /^(?!数栖)/, message: '名称不允许数栖开头',
  }];
}

export function calcSize(size, defaultUnit = 'B', isToFixed = true) {
  const map = {
    b: 1,
    kb: 2 ** 10,
    mb: 2 ** 20,
    gb: 2 ** 30,
    tb: 
    2 ** 40,
  }
}

/**
 * @description 重命名校验防抖
 * @author 凡书
 * @param fn 重命名校验函数 
 * @param delay 间隔时间
 */

let timer = null 
export function debounce(fn, delay = 200) {
  clearTimeout(timer)
  timer = setTimeout(fn, delay)
}