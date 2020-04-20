/**
 * @description 标签模型 - 批量绑定
 */
import {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {action} from 'mobx'
import {
  Drawer, Steps,
} from 'antd'
import StepOne from './step-one'
import StepTwo from './step-two'

import store from './store'

const {Step} = Steps

@inject('bigStore')
@observer
export default class BatchConfig extends Component {
  constructor(props) {
    super(props)
    this.bigStore = props.bigStore
    store.projectId = props.bigStore.projectId
  }
  
  @action.bound closeDrawer() {
    this.bigStore.batchConfigVisible = false
  }


  render() {
    const {batchConfigVisible: visible} = this.bigStore
    const {currentStep} = store

    const drawerConfig = {
      title: '标签配置',
      visible,
      width: 1120,
      maskClosable: false,
      destroyOnClose: true,
      onClose: this.closeDrawer,
    }

    return (
      <Drawer
        {...drawerConfig}
      >
        <div className="tag-config-batch">
          <Steps current={currentStep} size="small" className="tag-config-step">
            <Step title="选择标签" />
            <Step title="绑定字段" />
          </Steps>
          <StepOne 
            store={store}
            show={currentStep === 0} 
            closeDrawer={this.closeDrawer}
          />
          {/* <DrawerTagConfig
            projectId={projectId}
            visible={drawerTagConfigVisible}
            info={drawerTagConfigInfo}
            onClose={closeTagConfig}
            onUpdate={updateTagConfig}
            type={drawerTagConfigType}
          /> */}
          <StepTwo 
            store={store}
            show={currentStep === 1} 
            closeDrawer={this.closeDrawer}
          />
        </div>
      </Drawer>
    )
  }
}
