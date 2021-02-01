import intl from 'react-intl-universal'
import { Component, Fragment } from 'react'
import { observer } from 'mobx-react'
import NemoBaseInfo from '@dtwave/nemo-base-info'
import { Tag, Spin } from 'antd'
import { scheduleTypeObj } from '../util'

@observer
class ConfigInfo extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  render() {
    const { configInfo, configInfoLoading } = this.store

    return (
      <Spin spinning={configInfoLoading}>
        <div className="config-info">
          <div className="info-title">
            {intl
              .get(
                'ide.src.page-manage.page-tag-sync.sync-detail.config-info.59dxyj6ypgi'
              )
              .d('配置目的表')}
          </div>
          <NemoBaseInfo
            dataSource={[
              {
                title: intl
                  .get(
                    'ide.src.page-manage.page-tag-sync.sync-detail.config-info.85dk1zuhe9h'
                  )
                  .d('表'),
                value: configInfo.tableName,
              },
            ]}
            className="mb24"
          />

          <div className="info-title">
            {intl
              .get(
                'ide.src.page-manage.page-object-model.object-list.object-detail.modal-relate-table.m5inicr74ce'
              )
              .d('主标签配置')}
          </div>
          <NemoBaseInfo
            dataSource={
              configInfo.mainTagMappingKeys &&
              configInfo.mainTagMappingKeys.map(d => ({
                title: d.objName,
                value: d.columnName,
              }))
            }
            className="mb24"
          />

          <div className="info-title">
            {intl
              .get(
                'ide.src.page-manage.page-tag-sync.sync-detail.config-info.fgii8tqth9f'
              )
              .d('配置同步标签')}
          </div>
          <div className="FBH mb24">
            <div style={{ color: ' rgba(0, 0, 0, 0.45)' }}>
              {intl
                .get(
                  'ide.src.page-manage.page-tag-sync.sync-detail.config-info.mzpcc18sdb'
                )
                .d('同步标签总数：')}
            </div>
            <div>{configInfo.tagTotalCount}</div>
          </div>
          <div className="FBH mb24">
            <div style={{ color: ' rgba(0, 0, 0, 0.45)' }}>
              {intl
                .get(
                  'ide.src.page-manage.page-tag-sync.sync-detail.config-info.7n32w7krh6d'
                )
                .d('同步标签：')}
            </div>
            <div>
              {configInfo.tagNameList &&
                configInfo.tagNameList.map(d => <Tag>{d}</Tag>)}
            </div>
          </div>
          {configInfo.scheduleType ? (
            <Fragment>
              <div className="info-title">
                {intl
                  .get(
                    'ide.src.page-manage.page-tag-sync.sync-detail.config-info.iejk9zbmj4'
                  )
                  .d('调度配置')}
              </div>
              <NemoBaseInfo
                dataSource={
                  configInfo.scheduleType === 1
                    ? [
                        {
                          title: intl
                            .get(
                              'ide.src.page-manage.page-tag-sync.sync-detail.config-info.y6c22kjlsuj'
                            )
                            .d('调度类型'),
                          value: scheduleTypeObj[configInfo.scheduleType],
                        },
                        {
                          title: intl
                            .get(
                              'ide.src.page-manage.page-tag-sync.sync-detail.config-info.he3cdw5lqaj'
                            )
                            .d('调度周期'),
                          value: configInfo.period,
                        },
                        {
                          title: intl
                            .get(
                              'ide.src.page-manage.page-tag-sync.sync-detail.config-info.3rzdvudbw2h'
                            )
                            .d('调度时间'),
                          value: configInfo.periodTime,
                        },
                      ]
                    : [
                        {
                          title: intl
                            .get(
                              'ide.src.page-manage.page-tag-sync.sync-detail.config-info.y6c22kjlsuj'
                            )
                            .d('调度类型'),
                          value: scheduleTypeObj[configInfo.scheduleType],
                        },
                      ]
                }
                className="ml24 mb24"
              />
            </Fragment>
          ) : null}
        </div>
      </Spin>
    )
  }
}
export default ConfigInfo
