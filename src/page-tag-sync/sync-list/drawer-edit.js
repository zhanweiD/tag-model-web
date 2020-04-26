/**
 * @description 编辑同步计划
 */
import {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {action} from 'mobx'
import {
  Drawer,
} from 'antd'

// import store from './store-drawer'


@inject('bigStore')
@observer
export default class DrawerEditSync extends Component {
  constructor(props) {
    super(props)
    this.bigStore = props.bigStore
    // store.projectId = props.projectId
  }
  
  @action.bound closeDrawer() {
    // store.currentStep = 0
    // this.bigStore.visible = false
  }

  render() {
    const {visible} = this.bigStore
    // const {currentStep} = store

    const drawerConfig = {
      title: '编辑同步计划',
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
        <div className="edit-sync">
          edit
        </div>
      </Drawer>
    )
  }
}
