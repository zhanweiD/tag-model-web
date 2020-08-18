/**
 * @description 创建加工方案
 */
import {Component} from 'react'
import {observer, inject, Provider} from 'mobx-react'
import {action} from 'mobx'
import {Drawer, Steps, Modal} from 'antd'
import ConfigDrawerOne from './config-drawer-one'
import ConfigDrawerTwo from './config-drawer-two'

import './config-drawer.styl'

const {Step} = Steps

@inject('rootStore')
@observer
export default class DrawerConfig extends Component {
  constructor(props) {
    super(props)
    const {configStore, codeStore} = props.rootStore

    this.store = configStore
    this.codeStore = codeStore
    this.store.projectId = props.projectId
    this.store.resetData()
    this.store.checkKeyWord()
  }

  @action closeDrawer = () => {
    this.store.configDrawerVisible = false
  }

  render() {
    const {
      configDrawerVisible, 
      currentStep, 
    } = this.store

    const {
      projectId,
    } = this.props

    const drawerConfig = {
      width: 1120,
      title: '标签配置',
      maskClosable: false,
      destroyOnClose: true,
      visible: configDrawerVisible,
      onClose: this.closeDrawer,
    }

    return (
      <Drawer {...drawerConfig}>
        <div className="processe-config config-drawer">
          <Steps current={currentStep} className="processe-config-step">
            <Step title="标签配置" />
            <Step title="结果预览" />
          </Steps>
          <Provider store={this.store}>
            <div className="processe-content">
              <ConfigDrawerOne 
                show={currentStep === 0} 
                // wrappedComponentRef={form => this.store.oneForm = form ? form.props.form : form}
              />
              <ConfigDrawerTwo 
                show={currentStep === 1} 
                projectId={projectId}
              />
            </div>
          </Provider>
        </div>        
      </Drawer>     
    )
  }
}
