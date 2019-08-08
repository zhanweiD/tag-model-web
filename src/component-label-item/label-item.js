import {Component} from 'react'
import PropTypes from 'prop-types'

class LabelItem extends Component {

  render() {
    let style = {}
    if (this.props.labelPadding) {
      style = {'padding-right': `${this.props.labelPadding}px`}
    } else {
      style = {width: `${this.props.labelWidth}px`}
    }

    return (
      <div className="label-item">
        <div className="label-item-label" style={style}>{this.props.label}:</div>
        <div className="label-item-value">{this.props.value}</div>
        {
          this.props.action &&
          <button className="button-style ml24" onClick={this.props.action}> 编辑 </button>
        }
      </div>
    )
  }
}

LabelItem.propTypes = {
  labelWidth: PropTypes.number.isRequired,
  labelPadding: PropTypes.number.isRequired,
}

LabelItem.defaultProps = {
  labelWidth: 130,
  labelPadding: 0,
}

export default LabelItem
