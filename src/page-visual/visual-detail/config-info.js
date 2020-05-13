import {Component} from 'react'
import {observer} from 'mobx-react'
import NemoBaseInfo from '@dtwave/nemo-base-info'
import {Spin} from 'antd'

@observer
export default class ConfigInfo extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  render() {
    const {configInfo, configInfoLoading} = this.store

    return (
      <Spin spinning={configInfoLoading}>
        <div className="config-info">
          <div className="info-title">数据过滤规则</div>
          <NemoBaseInfo 
            dataSource={[{
              title: '表',
              value: configInfo.tableName,
            }]}
            className="ml24 mb24"
          />
          <div className="info-title">衍生标签</div>  
        </div>
      </Spin> 
    )
  }
}
