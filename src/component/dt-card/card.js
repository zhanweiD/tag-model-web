import {Component, Fragment} from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {Icon} from 'antd'

export default class Card extends Component {
  static propTypes = {
    title: PropTypes.string, // 卡片标题
    link: PropTypes.string, // 卡片跳转链接
    tag: PropTypes.arrayOf(PropTypes.object), // 状态t标签
    labelList: PropTypes.arrayOf(PropTypes.object), // 基本信息；eg：创建者、创建时间
    descr: PropTypes.string, // 描述
    countList: PropTypes.arrayOf(PropTypes.object), // 指标数量信息
    actions: PropTypes.arrayOf(PropTypes.object), // 卡片操作组, 卡片底部
    className: PropTypes.string,
    preCls: PropTypes.string, // 样式属性前缀
    hasDescr: PropTypes.bool, // 描述存在判断标识;默认存在描述
    infoLineCount: PropTypes.number, // 基本信息每行个数
  }

  static defaultProps = {
    title: '', // string
    link: '', // string
    tag: [], // Array<ReactNode> eg: tag: [ <Tag color="blue">{未使用}</Tag>]
    labelList: [], // Array<{label: string, value: string}>
    descr: '', // string
    countList: [], // Array<{label: string, value: number}>
    actions: [], // Array<ReactNode>
    className: '', // string
    preCls: 'dt-tag-card', // string; 防撞车专用;oner-uikit 已有card组件;.styl 文件中定义同样变量;更改需同步o
    hasDescr: true, // 用于区别“无描述”与“描述无内容”
    infoLineCount: 2, // 基本信息每行个数
  }

  // 渲染卡片基本信息 eg：创建者、创建时间
  getInfoDom() {
    const {preCls, labelList, infoLineCount} = this.props

    if (!labelList || !Array.isArray(labelList) || !labelList.length) return null

    const arr = []
    const len = labelList.length 

    const domItem = list => (
      <div className={`${preCls}-info`}>
        {
          list.map(({label = '', value = ''}) => (
            <span className={`${preCls}-info-item card-omit`} title={`${label}${label ? '：' : null}${value}`}>
              {
                label 
                  ? `${label}：`
                  : null
              }
              {value}
            </span>
          ))
        }
      </div>
    )
    
    // 卡片基本信息项 少于或等于2项; 减少不必要的循环遍历
    if (len <= 2) {
      return domItem(labelList)
    } 
    
    // 卡片基本信息项 大于2项
    for (let i = 0; i < len; i += 1) {
      const int = parseInt(i / infoLineCount, 10) // 取整
      const remain = i % infoLineCount // 模

      if (remain === 0) {
        arr[int] = [labelList[i]]
        
        // 尾项容错
        if (labelList[i + 1]) arr[int].push(labelList[i + 1])
      }
    }

    const dom = arr.map(item => domItem(item))

    return dom
  }

  // 渲染卡片操作组
  getAction(actions = []) {
    const {preCls} = this.props

    const actionList = actions && Array.isArray(actions) && actions.length ? (
      <ul className={`${preCls}-actions`}>
        {
          actions.reverse().map((action, index) => (
            <Fragment>
              {/* eslint-disable-next-line react/no-array-index-key */}
              <li key={`action-${index}`}>
                {action}
                {
                  index ? <span className={`${preCls}-actions-line`} /> : null
                } 
              </li>
            </Fragment>
          ))}
      </ul>
    ) : null

    return actionList
  }
 
  render() {
    const {
      title = '', 
      link = '', 
      tag = [], 
      descr = '', 
      countList = [], 
      actions,
      className,
      preCls,
      hasDescr,
      labelList,
      infoLineCount,
      ...restProps
    } = this.props

    // 渲染卡片标题 + tag + 右箭头(rightArrow) 简而言之第一行
    const headDom = (
      <div className={`${preCls}-head`}>
        {/* Title */}
        {
          link 
            ? <a title={title} className={`${preCls}-head-title card-omit hover-style `} href={link}>{title}</a>
            : <span title={title} className={`${preCls}-head-title card-omit hover-style `}>{title}</span>
        }

        {/* Tag */}
        {
          tag && tag.length ? tag.map(item => item) : null
        }

        {/* rightArrow */}
        {
          link ? <Icon type="right" className="hover-style" /> : null
        }    
      </div>
    )

    // 渲染卡片基本信息
    const InfoDom = this.getInfoDom()

    // 渲染卡片描述信息
    const DescrDom = hasDescr ? (
      <div className={`${preCls}-descr card-omit`}>
        <span>描述：</span>
        <span title={descr}>{descr || '--'}</span>
      </div>
    ) : null

    // 渲染卡片指标信息
    const CountDom = countList && Array.isArray(countList) && countList.length ? (
      <div className={`${preCls}-topic`}>
        {
          countList.map(({label = '', value = ''}, index) => (
            <Fragment>
              <div>
                <span className="card-omit">{label}</span>
                <div className={`${preCls}-topic-count`}>{value}</div>
              </div>
              {
                index !== (countList.length - 1) ? <div className={`${preCls}-topic-line`} /> : null
              }
            </Fragment>            
          ))
        }
      </div>
    ) : null

    // 渲染卡片操作组
    const actionDom = this.getAction(actions)

    return (
      <div className={classnames(preCls, className)} {...restProps}>
        <div
          className={`${preCls}-wrap`}
          onClick={() => {
            window.location.href = link
          }}
        >
          {headDom}
          {InfoDom}
          {DescrDom}
          {CountDom}
        </div>
        {actionDom}
      </div>
    )
  }
}
