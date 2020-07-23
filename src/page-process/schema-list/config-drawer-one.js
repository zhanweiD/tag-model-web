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
  }

  @action closeDrawer = () => {
    this.store.configDrawerVisible = false
    this.store.recordObj = {}
  }

  @action nextStep = () => {
    // this.store.getConfigList()
    this.store.getPreviewList()
    this.store.currentStep = 1
  }

  render() {
    const {currentStep, isConfig} = this.store
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
            // disabled={!isConfig}
            onClick={this.nextStep}
          >
            下一步
          </Button>
        </div>
      </div>
    )
  }
}
