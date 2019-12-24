import React from 'react'
import {observer} from 'mobx-react'
import {Icon, Spin} from 'antd'

// 标签配置 - 创建成功
@observer
export default class StepThree extends React.Component {
  render() {
    const {store} = this.props
    const {successResult} = store

    return (
      <div className="FBV FBJC FBAC" style={{height: '100%'}}>
        <div className="mb24">
          <Icon type="check-circle" theme="filled" style={{color: '#52C41A', fontSize: 72}} />
        </div>
        <div className="fs24 mb48" style={{color: 'rgba(0,0,0,0.85)'}}>创建成功</div>
        <div 
          className="FBV FBJC FBAC fs12" 
          style={{
            width: 560, 
            height: 160, 
            background: 'rgba(245,245,245,0.50)',
            color: 'rgba(0, 0, 0, 0.65)',
            lineHeight: '27px',
          }}
        >
          <Spin spinning={store.loadings.result}>
            <div>
              {`数据表名称： ${successResult.dataTableName || '-'}`}
            </div>
            <div>
              {`数据源： ${successResult.dataStorageName || '-'}`}
            </div>
            <div>
              {`数据源类型： ${successResult.storageTypeName || '-'}`}
            </div>
            <div>
              {`已配置/关联： ${successResult.configuredField || '-'} / ${successResult.associatedField || '-'}`}
            </div>
          </Spin>
        </div>
      </div>
    )
  }
}
