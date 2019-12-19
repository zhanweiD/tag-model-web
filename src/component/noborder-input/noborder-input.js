import {Component} from 'react'

class NoBorderInput extends Component {
  handleOnChange = e => {
    const {onChange} = this.props

    if (onChange) {
      onChange(e.target.value)
    }
  }

  render() {
    const {placeholder} = this.props
    return (
      <div className="noborder-input" style={{width: '100%'}}>
        <input type="text" required style={{width: '100%'}} onChange={this.handleOnChange} id="searchKey" />
        <label htmlFor="searchKey">{placeholder || '请输入名称搜索'}</label>
      </div>
    )
  }
}

export default NoBorderInput
