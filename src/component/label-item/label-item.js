import intl from 'react-intl-universal'
import {Component} from 'react'
import PropTypes from 'prop-types'

class LabelItem extends Component {
  static propTypes = {
    labelWidth: PropTypes.number,
    labelPadding: PropTypes.number,
  }

  static defaultProps = {
    labelWidth: 130,
    labelPadding: 0,
  }

  render() {
    const {labelPadding, labelWidth, label, value, action} = this.props
    let style = {}
    if (labelPadding) {
      style = {'padding-right': `${labelPadding}px`}
    } else {
      style = {width: `${labelWidth}px`}
    }

    return (
      <div className="label-item">
        <div className="label-item-label" style={style}>
          {label}
:
        </div>
        <div className="label-item-value">{value || '-'}</div>
        {action && (
          // eslint-disable-next-line react/button-has-type
          <button className="button-style ml24" onClick={action}>
            {intl
              .get('ide.src.component.label-item.label-item.slnqvyqvv7')
              .d('编辑')}
          </button>
        )}
      </div>
    )
  }
}

export default LabelItem
