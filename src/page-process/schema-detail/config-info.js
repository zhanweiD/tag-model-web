import intl from 'react-intl-universal'
/**
 * @description 配置信息
 */
import { Component } from 'react'
import { observer } from 'mobx-react'
import { Table } from 'antd'
import NemoBaseInfo from '@dtwave/nemo-base-info'
import { scheduleTypeObj } from '../util'

@observer
class ConfigInfo extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  columns = [
    {
      title: intl
        .get('ide.src.business-component.tag-relate.dag-box.bhzleo4vj5g')
        .d('字段'),
      dataIndex: 'dataFieldName',
    },
    {
      title: intl
        .get('ide.src.business-component.tag-relate.dag-box.xs30zaqk60p')
        .d('标签标识'),
      dataIndex: 'tagEnName',
    },
    {
      title: intl
        .get(
          'ide.src.page-manage.page-aim-source.source-detail.main.63kvhqd3cw8'
        )
        .d('标签名称'),
      dataIndex: 'tagName',
    },
  ]

  componentWillMount() {
    this.store.getConfigInfo()
  }

  render() {
    const {
      tql,
      mainTagObj,
      obj = [],
      tagConfigList = [],
      configDetail,
    } = this.store

    const majorTagInfo =
      obj &&
      obj.map(d => ({
        title: d.name,
        value: mainTagObj[d.id],
      }))

    return (
      <div className="config-info">
        <div className="info-title">
          {intl
            .get('ide.src.page-process.schema-detail.config-info.ca3eiune9je')
            .d('逻辑配置')}
        </div>
        <div className="FBH mb24">
          <div style={{ color: ' rgba(0, 0, 0, 0.45)' }}>TQL：</div>
          <div>{tql}</div>
        </div>
        <div className="info-title">
          {intl
            .get(
              'ide.src.page-manage.page-object-model.object-list.object-detail.modal-relate-table.m5inicr74ce'
            )
            .d('主标签配置')}
        </div>

        <NemoBaseInfo dataSource={majorTagInfo} className="mb24" />

        <div className="info-title">
          {intl
            .get(
              'ide.src.page-manage.page-tag-sync.sync-detail.config-info.iejk9zbmj4'
            )
            .d('调度配置')}
        </div>
        <NemoBaseInfo
          dataSource={
            configDetail.scheduleType === 1
              ? [
                  {
                    title: intl
                      .get(
                        'ide.src.page-manage.page-tag-sync.sync-detail.config-info.y6c22kjlsuj'
                      )
                      .d('调度类型'),
                    value: scheduleTypeObj[configDetail.scheduleType],
                  },
                  {
                    title: intl
                      .get(
                        'ide.src.page-manage.page-tag-sync.sync-detail.config-info.he3cdw5lqaj'
                      )
                      .d('调度周期'),
                    value: configDetail.period,
                  },
                  {
                    title: intl
                      .get(
                        'ide.src.page-manage.page-tag-sync.sync-detail.config-info.3rzdvudbw2h'
                      )
                      .d('调度时间'),
                    value: configDetail.periodTime,
                  },
                ]
              : [
                  {
                    title: intl
                      .get(
                        'ide.src.page-manage.page-tag-sync.sync-detail.config-info.y6c22kjlsuj'
                      )
                      .d('调度类型'),
                    value: scheduleTypeObj[configDetail.scheduleType],
                  },
                ]
          }
          className="mb24"
        />

        <div className="info-title">
          {intl
            .get(
              'ide.src.page-manage.page-tag-model.data-sheet.config-field.7i73j0om993'
            )
            .d('标签配置')}
        </div>
        <div className="mb8">
          {intl
            .get('ide.src.page-process.schema-detail.config-info.fhtygnt5bdf')
            .d('标签数/字段数：')}
          {configDetail.tagCount}/{configDetail.fieldCount}
        </div>
        <Table
          columns={this.columns}
          dataSource={tagConfigList}
          pagination={false}
        />
      </div>
    )
  }
}
export default ConfigInfo
