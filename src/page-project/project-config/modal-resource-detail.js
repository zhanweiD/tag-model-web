import {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {Modal, Button, Collapse, Icon, Panel} from 'antd'
import {calcSize} from '../../common/util'

@observer
export default class ModalStotage extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  @action handleCancel = () => {
    this.store.visibleDetail = false
  }

  render() {
    const {
      visibleDetail, detail,
    } = this.store

    // 临时值
    const {
      resourceGroupInfoList,
      currentResourceDetail,
      nodeList,
      nodeStatusMap,
    } = detail

    const modalConfig = {
      title: detail.groupName,
      visible: visibleDetail,
      onCancel: this.handleCancel,
      onOk: this.submit,
      maskClosable: false,
      width: 525,
      destroyOnClose: true,
      footer: [<Button onClick={this.handleCancel}>关闭</Button>],
    }

    return (
      <Modal {...modalConfig}>
        <div className="info-row mb16">
          {resourceGroupInfoList.map(item => {
            const {label, key, render} = item
            const value = currentResourceDetail[key]

            return (
              <span className="mr32">
                {label}
                :
                {' '}
                {render ? render(value) : value}
              </span>
            )
          })}
        </div>
        <div className="info-row mb16">
          <div className="mb8">
            <span className="mr16">
              服务器数：
              {nodeList.length}
            </span>
            <a onClick={this.toggleNodeList}>查看详情</a>
          </div>
          <Collapse
            style={{display: this.nodeListVisible ? '' : 'none'}}
            bordered={false}
            defaultActiveKey={['1']}
            expandIcon={({isActive}) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          >
            {nodeList.map(node => {
              const {hostname, ip, mtime, nodeStatus, remainCpu, remainMemory, runSlot, totalCpu, totalMemory, totalSlot} = node

              const slotRatio = totalMemory ? (100 * (runSlot / totalSlot)).toFixed(2) : 0
              const memoryRatio = totalMemory ? (100 * (remainMemory / totalMemory)).toFixed(2) : 0
              const CPURatio = totalCpu ? (100 * (remainCpu / totalCpu)).toFixed(2) : 0

              return (
                <Panel
                  header={hostname}
                  key="1"
                  style={{
                    background: '#f5f5f5',
                    borderRadius: 4,
                    marginBottom: 24,
                    border: 0,
                    overflow: 'hidden',
                  }}
                >
                  <div className="node-info-row mb8">
                    <span className="mr16">
                      地址：
                      {ip}
                    </span>
                    <span className="mr16">
                      作业使用率：
                      {slotRatio}
                      %
                    </span>
                    <span className="mr16">
                      服务状态：
                      {nodeStatusMap[nodeStatus]}
                    </span>
                    <span className="mr16">
                      总作业数：
                      {totalSlot}
                    </span>
                    <span className="mr16">
                      运行作业数：
                      {runSlot}
                    </span>
                  </div>
                  <div className="node-info-row mb8">
                    <span className="mr16">
                      内存使用率：
                      {memoryRatio}
                      %
                                            (
                      {calcSize(remainMemory * 1024)}
                      /
                      {calcSize(totalMemory * 1024)}
                      )
                    </span>
                    <span className="mr16">
                      CPU使用率：
                      {CPURatio}
                      %
                                            (
                      {remainCpu}
                      核/
                      {totalCpu}
                      核)
                    </span>
                  </div>
                  <div className="node-info-row mb8">
                    <span className="mr16">
                      修改时间：
                      {mtime}
                    </span>
                  </div>
                </Panel>
              )
            })}
          </Collapse>
        </div>
      </Modal>
    )
  }
}
