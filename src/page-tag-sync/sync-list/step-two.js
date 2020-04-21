import {Component} from 'react'
import {observer} from 'mobx-react'
import {Button} from 'antd'
import {observable, action} from 'mobx'
import Tree from './step-two-tree'
import List from './step-two-list'

@observer
export default class StepTwo extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  @action.bound nextStep() {
    this.store.nextStep()
  }

  @action.bound rightToTable() {

  }

  render() {
    const {
      show,
    } = this.props
    return (
      <div style={{display: show ? 'block' : 'none'}}>
        <div className="config-sync-tag">
          <Tree store={this.store} />
          <div className="select-tag-btn">
            <Button
              type="primary"
              icon="right"
              size="small"
              style={{display: 'block'}}
              className="mb4"
              // disabled={!this.selectNodes.length}
              onClick={this.rightToTable}
            />
          </div>
          <List store={this.store} />
        </div>
        <div className="bottom-button">
          <Button style={{marginRight: 8}} onClick={() => this.store.lastStep()}>上一步</Button>
          <Button
            type="primary"
            style={{marginRight: 8}}
            onClick={this.nextStep}
          >
            下一步
          </Button>
          <Button
            type="primary"
            style={{marginRight: 8}}
            onClick={this.nextStep}
          >
            确定
          </Button>
        </div>
      </div>
    )
  }
}
