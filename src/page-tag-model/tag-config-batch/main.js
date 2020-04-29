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

import Store from './store'

const {Step} = Steps

@inject('bigStore')
@observer
export default class BatchConfig extends Component {
  constructor(props) {
    super(props)
    this.bigStore = props.bigStore
  }

  componentWillMount() {
    const {projectId} = this.props
    this.store = new Store({
      projectId,
    })
  }

  componentWillReceiveProps(next) {
    const {visible} = this.props
    if (visible !== next.visible && next.visible) {
      this.store.objId = next.objectSelectList && next.objectSelectList.length && next.objectSelectList[0].value
      this.store.getConfigTagList()
    }
  }
  
  @action.bound closeDrawer() {
    this.store.currentStep = 0
    this.store.confirmLoading = false
    this.store.objId = ''
    this.store.boundMethodId = 0
    this.store.isShowPublished = false
    this.store.selectTagList.clear()
    this.store.rowKeys.clear()
    this.store.selectedRowKeys.clear()
    this.bigStore.batchConfigVisible = false
  }

  @action.bound onUpdate() {
    this.closeDrawer()
    this.bigStore.getList({
      current: 1,
    })
  }

  render() {
    const {currentStep} = this.store
    const {visible, objectSelectList} = this.props

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
            store={this.store}
            show={currentStep === 0} 
            closeDrawer={this.closeDrawer}
            objectSelectList={objectSelectList}
          />
          <StepTwo 
            store={this.store}
            show={currentStep === 1} 
            closeDrawer={this.closeDrawer}
            onUpdate={this.onUpdate}
          />
        </div>
      </Drawer>
    )
  }
}
