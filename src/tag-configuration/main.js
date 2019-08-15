import React from 'react'
import PropTypes from 'prop-types'
import {
  Drawer, Table, Steps, Tooltip, Button,
} from 'antd'
import {observer} from 'mobx-react'
import Frame from '../frame'
import StepOne from './step-one'
import StepTwo from './step-two'
import StepThree from './step-three'

import store from './store'

const {Step} = Steps

// 标签配置（字段->标签）
@observer
export default class TagConfiguration extends React.Component {
  state = {
    currentStep: 0,
  }

  componentDidMount() {
    store.getInitialList()
  }

  render() {
    const {currentStep} = this.state

    const steps = [
      {
        title: '选择字段',
      },
      {
        title: '填写配置信息',
      },
      {
        title: '创建成功',
      },
    ]

    const Content = [StepOne, StepTwo, StepThree][currentStep]

    return (
      <Frame>
        <Drawer
          title="配置标签"
          visible
          width="80%"
        >
          {/* 步骤条 */}
          <Steps current={currentStep} style={{padding: '0 100px', marginBottom: '32px'}}>
            {
              steps.map(item => (
                <Step key={item.title} title={item.title} />
              ))
            }
          </Steps>

          {/* 内容区域 */}
          <div style={{height: 'calc(100vh - 55px - 48px - 64px - 53px)'}}>
            <Content store={store} />
          </div>

          {/* 底部步骤控制按钮 */}
          {/* TODO: 每页下的按钮都不一样，干脆分别做 */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            {currentStep === 0 && (
              <Button className="mr8">
                取消
              </Button>
            )}
            {currentStep > 0 && (
              <Button className="mr8" onClick={() => this.prevStep()}>
                上一步
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button 
                type="primary" 
                // disabled={!store.secondTableList.length}
                onClick={() => this.nextStep()}
              >
                下一步
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button type="primary">
                确定
              </Button>
            )}
          </div>
        </Drawer>
      </Frame>
    )
  }

  // 下一步
  nextStep() {
    const {currentStep} = this.state
    this.setState({
      currentStep: currentStep + 1,
    })
  }

  // 上一步
  prevStep() {
    const {currentStep} = this.state
    this.setState({
      currentStep: currentStep - 1,
    })
  }
}
