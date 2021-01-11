import intl from 'react-intl-universal'
/**
 * @description 创建加工方案 - 预览保存
 */
import { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { toJS, action } from 'mobx'
import { Button } from 'antd'
import NemoBaseInfo from '@dtwave/nemo-base-info'
import { scheduleTypeObj } from '../util'

@inject('rootStore')
@observer
class DrawerFour extends Component {
  constructor(props) {
    super(props)
    this.store = props.rootStore.drawerStore
    this.codeStore = props.rootStore.codeStore
  }

  @action.bound submitScheme() {
    const { usedTagIds } = this.codeStore
    const { schemeDetail } = this.store

    this.store.submitScheme({
      id: schemeDetail.id,
      usedTagIds,
    })
  }

  // 获取主标签
  getMajorTag = () => {
    const {
      schemeDetail: { mainTagMappingKeys, obj },
    } = this.store

    const majorObj = {}

    if (mainTagMappingKeys) {
      mainTagMappingKeys.forEach(d => {
        majorObj[d.objId] = d.columnName
      })
    }

    return obj.map(d => ({
      title: d.name,
      value: majorObj[d.id],
    }))
  }

  render() {
    const { show } = this.props
    const { schemeDetail, submitLoading } = this.store
    const {
      mainTagMappingKeys,
      objName,
      isPartitioned,
      partitionMappingKeys,
    } = schemeDetail

    const majorTag =
      mainTagMappingKeys && mainTagMappingKeys.length > 1
        ? this.getMajorTag()
        : [
            {
              title: objName,
              value:
                mainTagMappingKeys &&
                mainTagMappingKeys[0] &&
                mainTagMappingKeys[0].columnName,
            },
          ]

    return (
      <div style={{ display: show ? 'block' : 'none' }}>
        <div className="preview-box">
          <div className="form-title ">
            {intl
              .get(
                'ide.src.page-manage.page-tag-sync.sync-list.step-three.zuis6z8dlya'
              )
              .d('基本信息')}
          </div>
          <NemoBaseInfo
            dataSource={[
              {
                title: intl
                  .get(
                    'ide.src.page-manage.page-tag-sync.sync-list.step-three.o5xmbmtg9qr'
                  )
                  .d('方案名称'),
                value: schemeDetail.name,
              },
              {
                title: intl
                  .get('ide.src.page-process.schema-detail.main.tua55dlv62t')
                  .d('方案类型'),
                value: 'TQL',
              },
              {
                title: intl
                  .get(
                    'ide.src.page-manage.page-aim-source.tag-config.main.2vfpdytl49n'
                  )
                  .d('所属对象'),
                value: schemeDetail.objName,
              },
              {
                title: intl
                  .get(
                    'ide.src.page-manage.page-aim-source.source-list.drawer.5u6m68xs7v6'
                  )
                  .d('方案描述'),
                value: schemeDetail.descr,
              },
            ]}
            className="ml32 mb24"
          />

          <div className="form-title">
            {intl
              .get('ide.src.page-process.schema-detail.config-info.ca3eiune9je')
              .d('逻辑配置')}
          </div>
          <div className="FBH ml32 mb24">
            <div style={{ color: ' rgba(0, 0, 0, 0.45)' }}>TQL：</div>
            <div>{schemeDetail.source}</div>
          </div>
          {/* <NemoBaseInfo
             dataSource={[{
               title: 'TQL',
               value: schemeDetail.source,
             }]} 
             className="ml32 mb24"
            /> */}
          <div className="form-title">
            {intl
              .get(
                'ide.src.page-manage.page-object-model.object-list.object-detail.modal-relate-table.m5inicr74ce'
              )
              .d('主标签配置')}
          </div>
          <NemoBaseInfo dataSource={majorTag} className="ml32 mb24" />

          <div className="form-title">
            {intl
              .get('ide.src.page-process.schema-list.drawer-four.don8hj0zgrk')
              .d('分区配置')}
          </div>
          <NemoBaseInfo
            dataSource={
              isPartitioned
                ? [
                    {
                      title: intl
                        .get(
                          'ide.src.page-process.schema-list.drawer-four.lz4ovsfwwri'
                        )
                        .d('设置分区'),
                      value: isPartitioned
                        ? intl
                            .get(
                              'ide.src.component.form-component.03xp8ux32s3a'
                            )
                            .d('是')
                        : intl
                            .get('ide.src.component.form-component.h7p1pcijouf')
                            .d('否'),
                    },
                    {
                      title: intl
                        .get(
                          'ide.src.page-process.schema-list.drawer-four.uzh0eg21l3'
                        )
                        .d('分区字段名'),
                      value: partitionMappingKeys[0].partitionFieldName,
                    },
                    {
                      title: intl
                        .get(
                          'ide.src.page-process.schema-list.drawer-four.5f44gqqmc27'
                        )
                        .d('分区字段值'),
                      value: partitionMappingKeys[0].partitionFieldValue,
                    },
                  ]
                : [
                    {
                      title: intl
                        .get(
                          'ide.src.page-process.schema-list.drawer-four.lz4ovsfwwri'
                        )
                        .d('设置分区'),
                      value: isPartitioned
                        ? intl
                            .get(
                              'ide.src.component.form-component.03xp8ux32s3a'
                            )
                            .d('是')
                        : intl
                            .get('ide.src.component.form-component.h7p1pcijouf')
                            .d('否'),
                    },
                  ]
            }
            className="ml32 mb24"
          />

          <div className="form-title">
            {intl
              .get(
                'ide.src.page-manage.page-tag-sync.sync-detail.config-info.iejk9zbmj4'
              )
              .d('调度配置')}
          </div>
          <NemoBaseInfo
            dataSource={
              schemeDetail.scheduleType === 1
                ? [
                    {
                      title: intl
                        .get(
                          'ide.src.page-manage.page-tag-sync.sync-detail.config-info.y6c22kjlsuj'
                        )
                        .d('调度类型'),
                      value: scheduleTypeObj[schemeDetail.scheduleType],
                    },
                    {
                      title: intl
                        .get(
                          'ide.src.page-manage.page-tag-sync.sync-detail.config-info.he3cdw5lqaj'
                        )
                        .d('调度周期'),
                      value: schemeDetail.period,
                    },
                    {
                      title: intl
                        .get(
                          'ide.src.page-manage.page-tag-sync.sync-detail.config-info.3rzdvudbw2h'
                        )
                        .d('调度时间'),
                      value: schemeDetail.periodTime,
                    },
                  ]
                : [
                    {
                      title: intl
                        .get(
                          'ide.src.page-manage.page-tag-sync.sync-detail.config-info.y6c22kjlsuj'
                        )
                        .d('调度类型'),
                      value: scheduleTypeObj[schemeDetail.scheduleType],
                    },
                  ]
            }
            className="ml32 mb24"
          />
        </div>

        <div className="bottom-button">
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={this.submitScheme}
            loading={submitLoading}
          >
            {intl
              .get(
                'ide.src.page-manage.page-tag-sync.sync-list.step-three.gqb95qcjngv'
              )
              .d('提交')}
          </Button>
        </div>
      </div>
    )
  }
}
export default DrawerFour
