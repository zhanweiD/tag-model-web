import React from 'react'
import PropTypes from 'prop-types'
import {Empty, Button} from 'antd'
import emptyIcon from '../icon/noData.svg'
import {pathPrefix} from '../common/util'

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
          visibility: visible ? 'visible' : 'hidden',
          marginTop: -70, // 需要往上移点
        }}
      >
        <Empty
          image={emptyIcon}
          imageStyle={{
            height: 140,
          }}
          description={(
            <div className="fs12 mt12 black85 opacity65">
              没有任何标签，请在标签池中添加对象 -&gt; 添加标签
            </div>
          )}
        >
          <Button type="primary"><a href={`${pathPrefix}/pool`}>去添加标签</a></Button>
        </Empty>
      </div>
    )
  }
}