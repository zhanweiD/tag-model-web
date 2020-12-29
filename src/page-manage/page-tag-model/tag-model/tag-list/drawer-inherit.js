import {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {observable, action, toJS} from 'mobx'
import {RightOutlined} from '@ant-design/icons'
import {
  Drawer, Button,
} from 'antd'

import InheritTree from './drawer-inherit-tree'
import InheritList from './drawer-inherit-list'

@inject('bigStore')
@observer
export default class DrawerInherit extends Component {
  @action.bound closeDrawer() {
    const {bigStore} = this.props

    bigStore.drawerInheritVis = false
    bigStore.checkedKeys = []
    bigStore.tagDetaiList = []
    bigStore.selectTagList = []
  }

  @action.bound toRight() {
    const {bigStore} = this.props

    bigStore.getTagsList()
  }

  @action.bound onOk() {
    const {bigStore} = this.props

    bigStore.inheritTags(() => {
      this.closeDrawer()
      bigStore.getList({currentPage: 1})
    })
  }

  render() {
    const {bigStore} = this.props
    const {checkedKeys, drawerInheritVis, inheritLoading} = bigStore
    const drawerConfig = {
      title: '选择标签',
      visible: drawerInheritVis,
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
        <div style={{overflow: 'hidden'}}>
          {/* 实体: 4, 关系: 3 */}
          {/* <Radio.Group onChange={this.changeType} value={+this.selTypeCode} style={{marginBottom: 8}}>
            {
              tabs.map(({name, value}) => <Radio.Button value={value}>{name}</Radio.Button>)
            }
          </Radio.Group> */}

          <div className="FBH select-object">
            <InheritTree />
            <div className="select-object-btn">
              <Button
                type="primary"
                icon={<RightOutlined />}
                size="small"
                style={{display: 'block'}}
                disabled={checkedKeys.length === 0}
                className="mb4"
                onClick={this.toRight}
              />
            </div>

            <InheritList />


            <div
              style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: '100%',
                borderTop: '1px solid #e9e9e9',
                padding: '10px 24px',
                background: '#fff',
                textAlign: 'right',
              }}
            >
              <Button onClick={this.closeDrawer} className="mr8">取消</Button>
              <Button
                type="primary"
                // disabled={!checkedKeys.length}
                onClick={this.onOk}
                loading={inheritLoading}
              >
                确定
              </Button>
            </div>
          </div>
        </div>
      </Drawer>
    )
  }
}
