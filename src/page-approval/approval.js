import {Component} from 'react'
import {Menu} from 'antd'

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
  'approved': Approved, 
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

    return (
      <div className="page-approval">
        <Menu
          style={{width: 180, height: '100%'}}
          defaultSelectedKeys={['my-requests']}
          mode="inline"
          onClick={this.onMenuClick}
        >
          {
            menuMap.map(({name, value}) => <Menu.Item key={value}>{name}</Menu.Item>)
          }
        </Menu>
        <div className="approval-content">
          <Content {...this.props} />
        </div>
      </div>
    )
  }
}
