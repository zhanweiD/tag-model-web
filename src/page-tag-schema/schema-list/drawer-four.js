/**
 * @description 创建加工方案 - 预览保存
 */
import {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {action} from 'mobx'
import {Button} from 'antd'
import NemoBaseInfo from '@dtwave/nemo-base-info'

@inject('rootStore')
@observer
export default class DrawerFour extends Component {
  constructor(props) {
    super(props)
    this.store = props.rootStore.drawerStore
  }

  componentWillMount() {

  }

  render() {
    const {show} = this.props

    return (
      <div style={{display: show ? 'block' : 'none'}}>
        <div className="preview-box">
          <div className="form-title ">基本信息</div>
          <NemoBaseInfo 
            dataSource={[{
              title: '方案名称',
              value: '',
            }, {
              title: '方案类型',
              value: '',
            }, {
              title: '所属对象',
              value: '',
            }, {
              title: '方案描述',
              value: '',
            }]} 
            className="ml32 mb24"
          />
          <div className="form-title">逻辑配置</div>
          <NemoBaseInfo
            dataSource={[{
              title: 'TQL',
              value: '',
            }]} 
            className="ml32 mb24"
          />
          <div className="form-title">主标签配置</div>
          <NemoBaseInfo 
            dataSource={[{
              title: this.store.objName,
              value: '',
            }]} 
            className="ml32 mb24"
          />
          <div className="form-title">分区配置</div>
          <NemoBaseInfo 
            dataSource={[{
              title: '分区设置',
              value: '',
            }]} 
            className="ml32 mb24"
          />
          <div className="form-title">调度配置</div>
          <NemoBaseInfo 
            dataSource={[{
              title: '调度类型',
              value: '',
            }, {
              title: '调度周期',
              value: '',
            }]} 
            className="ml32 mb24"
          />
        </div>
       
       
        <div className="bottom-button">
          <Button style={{marginRight: 8}} onClick={() => this.store.lastStep()}>上一步</Button>
          <Button
            type="primary"
            style={{marginRight: 8}}
            onClick={this.store.nextStep}
          >
            提交
          </Button>
        </div>
      </div>
    )
  }
}
