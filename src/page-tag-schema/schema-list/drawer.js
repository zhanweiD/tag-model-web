/**
 * @description 创建加工方案
 */
import {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {action} from 'mobx'
import {Drawer, Steps, Modal} from 'antd'
import DrawerOne from './drawer-one'
import DrawerTwo from './drawer-two'
import DrawerThree from './drawer-three'
import DrawerFour from './drawer-four'

const {Step} = Steps

@inject('rootStore')
@observer
export default class DrawerConfig extends Component {
  constructor(props) {
    super(props)
    const {drawerStore} = props.rootStore

    this.store = drawerStore
    this.store.projectId = props.projectId
  }

  @action.bound closeDrawer() {
    const t = this

    Modal.confirm({
      title: '是否保存方案',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        t.store.oneForm.validateFieldsAndScroll(err => {
          if (err) {
            return
          } 
          t.store.saveSchema() // 保存
        })
      },
      onCancel: () => t.store.closeDrawer(),
    })
  }

  render() {
    const {
      drawerVisible, 
      drawerType, 
      currentStep, 
      // closeDrawer,
    } = this.store

    const {
      projectId,
    } = this.props

    const drawerConfig = {
      width: 1120,
      title: drawerType === 'edit' ? '编辑加工方案' : '添加加工方案',
      maskClosable: false,
      destroyOnClose: true,
      visible: drawerVisible,
      onClose: this.closeDrawer,
    }

    return (
      <Drawer {...drawerConfig}>
        <div className="processe-config">
          <Steps current={currentStep} size="small" className="processe-config-step">
            <Step title="基础信息" />
            <Step title="逻辑配置" />
            <Step title="任务配置" />
            <Step title="添加成功" />
          </Steps>
          <div className="processe-content">
            <DrawerOne 
              show={currentStep === 0} 
              wrappedComponentRef={form => this.store.oneForm = form ? form.props.form : form}
            />
            <DrawerTwo show={currentStep === 1} projectId={projectId} />
            <DrawerThree show={currentStep === 2} projectId={projectId} />
            <DrawerFour show={currentStep === 3} projectId={projectId} />
          </div>
        </div>
      </Drawer>     
    )
  }
}
