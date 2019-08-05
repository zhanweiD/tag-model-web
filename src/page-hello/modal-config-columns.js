import {Component} from 'react'
import {Modal, Checkbox} from 'antd'
import {observable, action, toJS} from 'mobx'
import {observer} from 'mobx-react'

const CheckboxGroup = Checkbox.Group

@observer
class ModalConfigColumns extends Component {
  @observable stdColumns = this.props.defSteColumns

  constructor(props) {
    super(props)
  }

  @action onChange(e) {
    this.stdColumns.replace(e)
  }

  @action handleOnCancel() {
    const {toggleConfColumns} = this.props
    toggleConfColumns()
  }

  @action handleOnOk() {
    const {changeStdColumns, toggleConfColumns} = this.props
    changeStdColumns(this.stdColumns.slice())
    toggleConfColumns()
  }

  render() {
    const {allColumnsTitle, visible} = this.props
    const options = allColumnsTitle.map(item => {
      return {
        label: item,
        value: item,
      }
    })

    const modalProps = {
      title: '配置列',
      visible,
      onCancel: () => this.handleOnCancel(),
      onOk: () => this.handleOnOk(),
      maskClosable: false,
      width: 525,
      destroyOnClose: true,
    }

    return (
      <Modal {...modalProps}>
        <CheckboxGroup
          options={options}
          defaultValue={this.stdColumns.slice()}
          onChange={e => this.onChange(e)}
        />
      </Modal>
    )
  }
}

export default ModalConfigColumns
