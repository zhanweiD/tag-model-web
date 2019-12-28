import React from 'react'
import PropTypes from 'prop-types'
import {Tooltip} from 'antd'

// 将长文本省略成...并提供tooltip的组件
export default class OmitTooltip extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired, // 要展示的值
    maxWidth: PropTypes.number, // 可见的最大宽
    emptyText: PropTypes.string, // 为空时展示的内容
    className: PropTypes.string,
  }

  static defaultProps = {
    maxWidth: 200,
    emptyText: '',
    className: '',
  }

  render() {
    const {
      text, maxWidth, emptyText, className,
    } = this.props

    return (
      <Tooltip placement="top" title={text}>
        <div className={`omit ${className}`} style={{maxWidth}}>{text || emptyText}</div>
      </Tooltip>
    )
  }
}
