import {Component, Fragment} from 'react'
import {
  Drawer, Steps, Button,
} from 'antd'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import Frame from '../frame'
import StepOne from './step-one'
import StepTwo from './step-two'
import StepThree from './step-three'

import store from './store'

const {Step} = Steps

// 标签配置（字段->标签）
@observer
export default class TagConfiguration extends Component {
  state = {
    currentStep: 0,
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
          onClose={this.close}
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
            {/* 第一步 */}
            {currentStep === 0 && (
              <Fragment>
                <Button 
                  className="mr8"
                  onClick={this.close}
                >
                  取消
                </Button>
                <Button 
                  type="primary" 
                  disabled={!store.secondTableList.length}
                  onClick={this.toStepTwo}
                >
                  下一步
                </Button>
              </Fragment>
            )}
            {/* 第二步 */}
            {currentStep === 1 && (
              <Fragment>
                <Button 
                  className="mr8"
                  onClick={this.backToStepOne}
                >
                  上一步
                </Button>
                <Button 
                  type="primary" 
                  disabled={
                    // 错误条数为0
                    store.secondTableList.filter(item => !item.isTrue).length 
                    // 或者标签个数也为0（可能全被删了）
                    || !store.secondTableList.length
                  }
                  onClick={this.confirmStepTwo}
                >
                  确定
                </Button>
              </Fragment>
            )}
            {/* 第三步 */}
            {currentStep === 2 && (
              <Button 
                type="primary"
                // TODO: 逻辑待修改
                onClick={() => {
                  this.setState({currentStep: 0})
                  this.close()
                }}
              >
                确定
              </Button>
            )}
          </div>
        </Drawer>
      </Frame>
    )
  }

  // 第一步点击取消或者右上角关闭
  close = () => {
    console.log('关闭抽屉')
  }
  
  // 从第一步到第二步
  @action.bound toStepTwo() {
    store.checkTagList(() => {
      this.setState({
        currentStep: 1,
      })
    })
  }

  // 从第二步回到第一步
  @action.bound backToStepOne() {
    this.setState({
      currentStep: 0,
    })
    store.getInitialList()
  }

  // 从第二步“确定”，决定是不是要进入第三步
  @action.bound confirmStepTwo() {
    store.saveTags(() => {
      // 加载结果数据
      store.getStorageDetail()

      this.setState({
        currentStep: 2,
      })
    }, () => {
      console.log('保存失败')
      // 保存失败的话，可能是这期间某些接口不能创建了，重新调用校验接口来更新数据
      store.checkTagList()
    })
  }
}
