import intl from 'react-intl-universal'
import { Component } from 'react'
import { observer } from 'mobx-react'
import { observable, action, toJS } from 'mobx'
import { Input } from 'antd'
import _ from 'lodash'

@observer
class Page extends Component {
  @observable paramItem = {
    key: this.props.value ? this.props.value.key : '',
    value: this.props.value ? this.props.value.value : '',
  }

  render() {
    return (
      <div className="param-item FBH">
        <Input
          style={{ width: 85 }}
          size="small"
          value={this.paramItem.key}
          placeholder={intl
            .get('ide.src.page-process.schema-list.param-item.84c43ughhyw')
            .d('输入参数名')}
          onChange={e => this.onChange(e, 'key')}
          disabled={this.props.disabled}
        />

        <span className="param-hen">－</span>
        <Input
          style={{ width: 85 }}
          size="small"
          value={this.paramItem.value}
          placeholder={intl
            .get('ide.src.page-process.schema-list.param-item.z0ydh2qw4j')
            .d('输入参数值')}
          onChange={e => this.onChange(e, 'value')}
          disabled={this.props.disabled}
        />
      </div>
    )
  }

  @action onChange = (e, id) => {
    const value = _.trim(e.target.value)
    if (id === 'key') {
      this.paramItem.key = value
    } else {
      this.paramItem.value = value
    }
    this.props.form.setFieldsValue({
      [`${this.props.id}`]: toJS(this.paramItem),
    })
    this.props.form.validateFields([`${this.props.id}`], { force: true })
    this.props.paramsChange(value)
  }
}
export default Page
