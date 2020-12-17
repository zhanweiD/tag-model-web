/**
 * 审批管理
 */
import {Component, useEffect} from 'react'
import {Menu} from 'antd'

import OnerFrame from '@dtwave/oner-frame'
import {codeInProduct} from '../../common/util'
import MyRequests from './my-requests'
import PendingApproval from './pending-approval'
import Approved from './approved'

const ContentMap = {
  'my-requests': MyRequests,
  'pending-approval': PendingApproval,
  approved: Approved, 
}

class Approval extends Component {
  onMenuClick = e => {
    const {history} = this.props
    history.push(`/common/approval/${e.key}`)
  }

  getMenuCode = () => {
    const menu = []

    if (codeInProduct('tag_common:apply[r]')) {
      menu.push({
        name: '我的申请',
        value: 'my-requests',
      })
    } 

    if (codeInProduct('tag_common:approving[r]')) {
      menu.push({
        name: '待我审批',
        value: 'pending-approval',
      })
    } 

    if (codeInProduct('tag_common:approved[r]')) {
      menu.push({
        name: '我已审批',
        value: 'approved',
      })
    }

    return menu
  }

  render() {
    const {match} = this.props
    const type = (match.params && match.params.type) || 'my-requests' // 默认页面 我的申请
    const Content = ContentMap[type]

    const myMenuMap = this.getMenuCode()

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
        <div className="approval-content box-border">
          <Content {...this.props} />
        </div>
      </div>
    )
  }
}

export default props => {
  const ctx = OnerFrame.useFrame()
  // const projectId = ctx.useProjectId()

  useEffect(() => {
    ctx.useProject(true, null, {visible: false})
  }, [])

  return (
    <Approval {...props} />
  )
}
