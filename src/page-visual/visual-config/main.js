import {Component} from 'react'
import {Steps} from 'antd'
import BaseInfo from './base-info'
import LogicConfig from './logic-config'
import UpdateConfig from './update-config'

import store from './store'

const {Step} = Steps

export default class VisualConfig extends Component {
  render() {
    const {currentStep} = store
    return (
      <div className="visual-config"> 
        <div className="header-wrap">
          <div className="header">
            {/* <div className="btn-back">返回</div> */}
            <Steps current={currentStep} className="header-step">
              <Step title="基础信息" />
              <Step title="逻辑配置" />
              <Step title="更新配置" />
            </Steps>
          </div>
        </div>
        <div className="content">
          <BaseInfo 
            store={store}
            show={currentStep === 0} 
          />
          <LogicConfig 
            store={store}
            show={currentStep === 1}
          />
          <UpdateConfig 
            store={store}
            show={currentStep === 2}
          />
        </div>  
      </div>
    )
  }
}
