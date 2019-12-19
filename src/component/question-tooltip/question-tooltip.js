import React from 'react'
import PropTypes from 'prop-types'
import {Icon, Tooltip} from 'antd'

export default class QuestionTooltip extends React.Component {
  static defaultProps = {
    tip: null,
    placement: 'top',
  }

  static propTypes = {
    tip: PropTypes.node, // 提示文字，也可以是ReactNode，必传
    placement: PropTypes.string,
  }

  render() {
    const {placement, tip} = this.props
    return (
      <Tooltip placement={placement} title={tip}>
        <Icon type="question-circle" className="ml4 mt4" />
      </Tooltip>
    )
  }
}
