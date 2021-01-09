import React from 'react'
import {observer} from 'mobx-react'
import {CheckCircleFilled} from '@ant-design/icons'
import {Spin} from 'antd'

// 标签配置 - 创建成功
@observer
export default class StepThree extends React.Component {
  render() {
    const {store} = this.props
    const {successResult} = store

    const successResultTableName = successResult.dataTableName
    const successResultStorageName = successResult.dataStorageName
    const successResultStorageTypeName = successResult.storageTypeName
    const successResultField = successResult.configuredField
    const successResultAssociatedField = successResult.associatedField

    return (
      <div className="FBV FBJC FBAC" style={{height: '100%', marginTop: '96px'}}>
        <div className="mb24">
          <CheckCircleFilled style={{color: '#52C41A', fontSize: 72}} />
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
              {`数据表名称： ${successResultTableName || '-'}`}
            </div>
            <div>
              {`数据源： ${successResultStorageName || '-'}`}
            </div>
            <div>
              {`数据源类型： ${successResultStorageTypeName || '-'}`}
            </div>
            <div>
              {`已配置/关联： ${successResultField || '-'} / ${successResultAssociatedField || '-'}`}
            </div>
          </Spin>
        </div>
      </div>
    )
  }
}
