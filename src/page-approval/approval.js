import {Component} from 'react'
import {Menu} from 'antd'

import {codeInProduct} from '../common/util'
import MyRequests from './my-requests'
import PendingApproval from './pending-approval'
import Approved from './approved'

const menuMap = [{
  name: '我的申请',
  value: 'my-requests',
}, {
  name: '待我审批',
  value: 'pending-approval',
}, {
  name: '我已审批',
  value: 'approved',
}]

const ContentMap = {
  'my-requests': MyRequests,
  'pending-approval': PendingApproval,
  approved: Approved, 
}

export default class Approval extends Component {
  onMenuClick = e => {
    const {history} = this.props
    history.push(`/${e.key}`)
  }

  render() {
    const {match} = this.props
    const type = (match.params && match.params.type) || 'my-requests' // 默认页面 我的申请
    const Content = ContentMap[type]

    const myMenuMap = codeInProduct('asset_tag_apply_approval') ? menuMap : [{
      name: '我的申请',
      value: 'my-requests',
    }]

    return (
      <div className="page-approval">
        <Menu
          className="approval-menu"
          defaultSelectedKeys={[type]}
          mode="inline"
          onClick={this.onMenuClick}
        >
          {
            myMenuMap.map(({name, value}) => <Menu.Item key={value}>{name}</Menu.Item>)
          }
        </Menu>
        <div className="approval-content">
          <Content {...this.props} />
        </div>
      </div>
    )
  }
}
