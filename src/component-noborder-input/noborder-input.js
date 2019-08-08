import {Component} from 'react'
import PropTypes from 'prop-types'

class NoBorderInput extends Component {
  handleOnChange = e => {
    const {onChange} = this.props

    if (onChange) {
      onChange(e.target.value)
    }
  }

  render() {
    return (
      <div className="noborder-input" style={{width: '100%'}}>
        <input type="text" required style={{width: '100%'}} onChange={this.handleOnChange} id="searchKey" />
        <label>请输入名称搜索</label>
      </div>
    )
  }
}

NoBorderInput.propTypes = {
  // width: PropTypes.number.isRequired,
}

NoBorderInput.defaultProps = {
  // width: 200,
}

export default NoBorderInput
