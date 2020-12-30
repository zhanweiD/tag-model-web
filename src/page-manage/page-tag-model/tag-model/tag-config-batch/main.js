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

    this.objStore = props.objStore
  }

  componentWillMount() {
    const {projectId, objId} = this.props
    this.store = new Store({
      projectId,
    })
    this.store.objId = +objId
  }

  componentWillReceiveProps(next) {
    const {visible, objId} = this.props
    if (visible !== next.visible && next.visible) {
      if (next.objectSelectList.length) {
        // this.store.objId = next.objectSelectList[0].value
        this.store.getConfigTagList()
      }
    }
    this.store.objId = next.objId
    // if (next.objId !== +objId) {
    //   this.store.objId = next.objId
    // }
    // console.log(this.store.objId)
  }
  
  @action.bound closeDrawer() {
    this.store.currentStep = 0
    this.store.confirmLoading = false
    this.store.objId = ''
    this.store.boundMethodId = ''
    this.store.isShowPublished = false
    this.store.selectTagList.clear()
    this.store.rowKeys.clear()
    this.store.selectedRowKeys.clear()
    this.bigStore.batchConfigVisible = false
  }

  @action.bound onUpdate() {
    this.closeDrawer()
    this.objStore.getObjCard()
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
      closable: true,
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
          <Steps size="small" current={currentStep} className="tag-config-step">
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
