/**
 * @description 配置信息
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {Table} from 'antd'
import NemoBaseInfo from '@dtwave/nemo-base-info'
import {scheduleTypeObj} from '../util'

@observer
export default class ConfigInfo extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  columns = [{
    title: '字段',
    dataIndex: 'dataFieldName',
  }, {
    title: '唯一标识',
    dataIndex: 'tagEnName',
  }, {
    title: '标签名称',
    dataIndex: 'tagName',
  }]

  componentWillMount() {
    this.store.getConfigInfo()
  }

  render() {
    const {
      tql, mainTagObj, obj, tagConfigList, detail,
    } = this.store

    const majorTagInfo = obj && obj.map(d => ({
      title: d.name,
      value: mainTagObj[d.id],
    }))

    return (
      <div className="config-info">
        <div className="info-title">逻辑配置</div>
        {/* <NemoBaseInfo
          dataSource={[{
            title: 'TQL',
            value: tql,
          }]} 
          className="ml32 mb24"
        /> */}
        <div className="FBH ml32 mb24">
          <div style={{color: ' rgba(0, 0, 0, 0.45)'}}>TQL：</div>
          <div>{tql}</div>
        </div>
        <div className="info-title">主标签配置</div>
        <NemoBaseInfo 
          dataSource={majorTagInfo} 
          className="ml32 mb24"
        />
        <div className="info-title">调度配置</div>
        <NemoBaseInfo 
          dataSource={detail.scheduleType === 1 ? [{
            title: '调度类型',
            value: scheduleTypeObj[detail.scheduleType],
          }, {
            title: '调度周期',
            value: detail.period,
          }, {
            title: '调度时间',
            value: detail.periodTime,
          }] : [{
            title: '调度类型',
            value: scheduleTypeObj[detail.scheduleType],
          }]} 
          className="ml32 mb24"
        />
        <div className="info-title">标签配置</div>
        <Table columns={this.columns} dataSource={tagConfigList} />
      </div>
    )
  }
}
