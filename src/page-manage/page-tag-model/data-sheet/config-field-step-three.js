import intl from 'react-intl-universal'
import React from 'react'
import {observer} from 'mobx-react'
import {CheckCircleFilled} from '@ant-design/icons'
import {Spin} from 'antd'

// 标签配置 - 创建成功
@observer
class StepThree extends React.Component {
  render() {
    const {store} = this.props
    const {successResult} = store

    const successResultTableName = successResult.dataTableName || '-'
    const successResultStorageName = successResult.dataStorageName || '-'
    const successResultStorageTypeName = successResult.storageTypeName || '-'
    const successResultField = successResult.configuredField || '-'
    const successResultAssociatedField = successResult.associatedField || '-'
    return (
      <div
        className="FBV FBJC FBAC"
        style={{height: '100%', marginTop: '96px'}}
      >
        <div className="mb24">
          <CheckCircleFilled style={{color: '#52C41A', fontSize: 72}} />
        </div>
        <div className="fs24 mb48" style={{color: 'rgba(0,0,0,0.85)'}}>
          {intl
            .get(
              'ide.src.page-manage.page-tag-model.data-sheet.config-field-step-three.7358fgalxex'
            )
            .d('创建成功')}
        </div>
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
              {intl
                .get(
                  'ide.src.page-manage.page-tag-model.data-sheet.config-field-step-three.ltwqy06gxgq',
                  {successResultTableName}
                )
                .d('数据表名称： {successResultTableName}')}
            </div>
            <div>
              {intl
                .get(
                  'ide.src.page-manage.page-tag-model.data-sheet.config-field-step-three.up3f8lg7258',
                  {successResultStorageName}
                )
                .d('数据源： {successResultStorageName}')}
            </div>
            <div>
              {intl
                .get(
                  'ide.src.page-manage.page-tag-model.data-sheet.config-field-step-three.0c2qpczzy638',
                  {successResultStorageTypeName}
                )
                .d('数据源类型： {successResultStorageTypeName}')}
            </div>
            <div>
              {intl
                .get(
                  'ide.src.page-manage.page-tag-model.data-sheet.config-field-step-three.xraz9z8uvg',
                  {
                    successResultField,
                    successResultAssociatedField,
                  }
                )
                .d(
                  '已配置/关联： {successResultField} / {successResultAssociatedField}'
                )}
            </div>
          </Spin>
        </div>
      </div>
    )
  }
}
export default StepThree
