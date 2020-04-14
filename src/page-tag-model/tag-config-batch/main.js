/**
 * @description 标签模型 - 批量绑定
 */
import {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {action} from 'mobx'

import {
  Drawer, Button, Spin,
} from 'antd'

import store from './store'

@inject('bigStore')
@observer
export default class BatchConfig extends Component {
  constructor(props) {
    super(props)
    this.bigStore = props.bigStore
  }
  
  @action.bound closeDrawer() {
    this.bigStore.batchConfigVisible = false
  }


  render() {
    const {batchConfigVisible: visible} = this.bigStore
    const {confirmLoading} = store

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
        <div>
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e8e8e8',
              padding: '10px 16px',
              textAlign: 'right',
              left: 0,
              background: '#fff',
            }}
          >
            <Button onClick={this.closeDrawer} className="mr8">取消</Button>
            <Button
              type="primary"
              onClick={this.submit}
              loading={confirmLoading}
              style={{float: 'right'}}
            >
                  确认
            </Button>
          </div>
        </div>
      </Drawer>
    )
  }
}
