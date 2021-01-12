import intl from 'react-intl-universal'
/**
 * @description 创建加工方案
 */
import { Component } from 'react'
import { observer, inject, Provider } from 'mobx-react'
import { action } from 'mobx'
import { Drawer, Steps, Modal } from 'antd'
import ConfigDrawerOne from './config-drawer-one'
import ConfigDrawerTwo from './config-drawer-two'

import './config-drawer.styl'

const { Step } = Steps

@inject('rootStore')
@observer
class DrawerConfig extends Component {
  constructor(props) {
    super(props)
    const { configStore, codeStore, listStore } = props.rootStore

    this.listStore = listStore
    this.store = configStore
    this.codeStore = codeStore
    this.store.projectId = props.projectId
    this.store.resetData()
    this.store.checkKeyWord()
  }

  @action closeDrawer = () => {
    this.listStore.getList()
    this.store.configDrawerVisible = false
  }

  render() {
    const { configDrawerVisible, currentStep } = this.store

    const { projectId } = this.props

    const drawerConfig = {
      width: 1120,
      title: intl
        .get(
          'ide.src.page-manage.page-tag-model.data-sheet.config-field.7i73j0om993'
        )
        .d('标签配置'),
      maskClosable: false,
      destroyOnClose: true,
      visible: configDrawerVisible,
      onClose: this.closeDrawer,
    }

    return (
      <Drawer {...drawerConfig}>
        <div className="processe-config config-drawer">
          <Steps current={currentStep} className="processe-config-step">
            <Step
              title={intl
                .get(
                  'ide.src.page-manage.page-tag-model.data-sheet.config-field.7i73j0om993'
                )
                .d('标签配置')}
            />
            <Step
              title={intl
                .get(
                  'ide.src.page-process.schema-list.config-drawer.jfbmkb7dj4o'
                )
                .d('结果预览')}
            />
          </Steps>
          <Provider store={this.store}>
            <div className="processe-content">
              <ConfigDrawerOne
                show={currentStep === 0}
                listStore={this.listStore}
                // wrappedComponentRef={form => this.store.oneForm = form ? form.props.form : form}
              />
              <ConfigDrawerTwo
                show={currentStep === 1}
                projectId={projectId}
                listStore={this.listStore}
              />
            </div>
          </Provider>
        </div>
      </Drawer>
    )
  }
}
export default DrawerConfig
