import React from 'react'
import PropTypes from 'prop-types'
import {Icon, Tooltip} from 'antd'

export default class QuestionTooltip extends React.Component {
  static propTypes = {
    tip: PropTypes.node.isRequired, // 提示文字，也可以是ReactNode，必传
  }

  render() {
    const {tip} = this.props
    return (
      <Tooltip placement="top" title={tip}>
        <Icon type="question-circle" className="ml4" />
      </Tooltip>
    )
  }
}
