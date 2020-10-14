import {Component, Fragment} from 'react'
import {observer} from 'mobx-react'
import NemoBaseInfo from '@dtwave/nemo-base-info'
import {Tag, Spin} from 'antd'
import {scheduleTypeObj} from '../util'

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
          <div className="info-title">配置目的表</div>
          <NemoBaseInfo 
            dataSource={[{
              title: '表',
              value: configInfo.tableName,
            }]}
            className="mb24"
          />
          <div className="info-title">主标签配置</div>
          <NemoBaseInfo 
            dataSource={configInfo.mainTagMappingKeys && configInfo.mainTagMappingKeys.map(d => ({
              title: d.objName,
              value: d.columnName,
            }))}
            className="mb24"
          />
          <div className="info-title">配置同步标签</div>
          <div className="FBH mb24">
            <div style={{color: ' rgba(0, 0, 0, 0.45)'}}>同步标签总数：</div>
            <div>{configInfo.tagTotalCount}</div>
          </div>
          <div className="FBH mb24">
            <div style={{color: ' rgba(0, 0, 0, 0.45)'}}>同步标签：</div>
            <div>{configInfo.tagNameList && configInfo.tagNameList.map(d => <Tag>{d}</Tag>)}</div>
          </div>
          {
            configInfo.scheduleType ? (
              <Fragment>
                <div className="info-title">调度配置</div>
                <NemoBaseInfo 
                  dataSource={configInfo.scheduleType === 1 ? [{
                    title: '调度类型',
                    value: scheduleTypeObj[configInfo.scheduleType],
                  }, {
                    title: '调度周期',
                    value: configInfo.period,
                  }, {
                    title: '调度时间',
                    value: configInfo.periodTime,
                  }] : [{
                    title: '调度类型',
                    value: scheduleTypeObj[configInfo.scheduleType],
                  }]} 
                  className="ml24 mb24"
                />
              </Fragment>
            ) : null
          }
        </div>
      </Spin> 
    )
  }
}
