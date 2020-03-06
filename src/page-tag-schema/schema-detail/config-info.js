/**
 * @description 配置信息
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {Table} from 'antd'
import NemoBaseInfo from '@dtwave/nemo-base-info'

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
  }, {
    title: '是否新建',
    dataIndex: 'name',
  }]

  componentWillMount() {
    this.store.getConfigInfo()
  }

  render() {
    const {tql, majorTagList, tagConfigList} = this.store
    const majorTagInfo = majorTagList.map(d => ({
      title: 11,
      value: d.mainTagName,
    }))

    return (
      <div className="config-info">
        <div className="info-title">逻辑配置</div>
        <NemoBaseInfo
          dataSource={[{
            title: 'TQL',
            value: tql,
          }]} 
          className="ml32 mb24"
        />
        <div className="info-title">主标签配置</div>
        <NemoBaseInfo 
          dataSource={majorTagInfo} 
          className="ml32 mb24"
        />
        <div className="info-title">调度配置</div>
        <NemoBaseInfo 
          dataSource={[{
            title: '调度类型',
            value: '',
          }, {
            title: '调度周期',
            value: '',
          }, {
            title: '调度时间',
            value: '',
          }]} 
          className="ml32 mb24"
        />
        <div className="info-title">标签配置</div>
        <Table columns={this.columns} dataSource={tagConfigList} />
      </div>
    )
  }
}
