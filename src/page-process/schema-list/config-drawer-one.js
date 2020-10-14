import {Component} from 'react'
import {Tabs, Button} from 'antd'
import {action} from 'mobx'
import {observer, inject} from 'mobx-react'
import ConfigTable from './config-table'
import ConfigForm from './config-form'

@inject('store')
@observer
export default class ConfigDrawerOne extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
    this.listStore = props.listStore
  }

  @action closeDrawer = () => {
    this.listStore.getList()
    this.store.configDrawerVisible = false
    this.store.recordObj = {}
  }

  @action nextStep = () => {
    this.store.nextList()
    this.store.currentStep = 1
  }

  render() {
    const {currentStep, isConfig, disNext} = this.store
    return (
      <div className="config-one" style={{display: currentStep ? 'none' : 'block'}}>
        <div className="config-fb">
          <ConfigTable /> 
          <ConfigForm />
        </div>
        <div className="bottom-button">
          <Button style={{marginRight: 8}} onClick={() => this.closeDrawer()}>
            取消
          </Button>
          <Button
            type="primary"
            style={{marginRight: 8}}
            disabled={disNext}
            onClick={this.nextStep}
          >
            下一步
          </Button>
        </div>
      </div>
    )
  }
}
