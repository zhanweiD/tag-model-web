import intl from 'react-intl-universal'
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
        <input
          type="text"
          style={{width: '100%', paddingLeft: '8px'}}
          onChange={this.handleOnChange}
          id="searchKey"
          placeholder={
            placeholder
            || intl
              .get('ide.src.component.noborder-input.noborder-input.xxeqxv2wh5')
              .d('请输入名称搜索')
          }
        />
      </div>
    )
  }
}

export default NoBorderInput
