import React from 'react'
import PropTypes from 'prop-types'
import {Empty, Button} from 'antd'
import emptyIcon from '../icon/empty.svg'

// 无标签的状态
export default class NoTag extends React.Component {
  static propTypes = {
    visible: PropTypes.bool, // 是否可见，初始化时展示为空白
  }

  render() {
    const {visible} = this.props

    return (
      <div 
        style={{
          visibility: visible ? 'hidden' : 'visible',
        }}
      >
        <Empty
          image={emptyIcon}
          imageStyle={{
            height: 140,
          }}
          description={(
            <span className="fs12" style={{color: 'rgba(0, 0, 0, 0.65)'}}>
              没有任何标签，请在标签池中添加对象 -> 添加标签
            </span>
          )}
        >
          <Button type="primary"><a href="/pool">去添加标签</a></Button>
        </Empty>
      </div>
    )
  }
}
