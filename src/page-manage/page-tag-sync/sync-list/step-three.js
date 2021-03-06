import intl from 'react-intl-universal'
import {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {action} from 'mobx'
import {Button, Tag, Popconfirm} from 'antd'
import NemoBaseInfo from '@dtwave/nemo-base-info'

@inject('bigStore')
@observer
class StepThree extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
    this.bigStore = props.bigStore
  }

  @action.bound submit() {
    const {previewData, tableData} = this.store
    const {closeDrawer} = this.props
    const t = this

    const mainTagMappingKeys = tableData
      .filter(d => d.isMajor)
      .map(s => ({
        tagId: s.aId,
        columnName: s.columnName || s.enName,
        columnType: s.columnType,
      }))

    const source = tableData
      .filter(d => !d.isMajor)
      .map(s => ({
        tagId: s.aId,
        columnName: s.columnName || s.enName,
        columnType: s.columnType,
      }))

    const params = {
      name: previewData.name,
      objId: previewData.objId && previewData.objId.key,
      descr: previewData.descr,
      dataDbType: previewData.dataDbType && previewData.dataDbType.key,
      dataStorageId: previewData.dataStorageId && previewData.dataStorageId.key,
      isDefineTable: previewData.isDefineTable ? 1 : 0,
      source,
      mainTagMappingKeys,
    }

    if (previewData.isDefineTable) {
      params.tableName = previewData.tableName
    }

    this.store.addSync(params, () => {
      closeDrawer()
      t.bigStore.getList({currentPage: 1})
    })
  }

  render() {
    const {show} = this.props
    const {previewData, tableData, confirmLoading} = this.store

    const {
      name,
      objId = {},
      descr,
      dataDbType = {},
      dataStorageId = {},
      tableName,
    } = previewData

    return (
      <div style={{display: show ? 'block' : 'none'}}>
        <div className="preview-box">
          <div className="info-title ">
            {intl
              .get(
                'ide.src.page-manage.page-tag-sync.sync-list.step-three.zuis6z8dlya'
              )
              .d('????????????')}
          </div>
          <NemoBaseInfo
            dataSource={[
              {
                title: intl
                  .get(
                    'ide.src.page-manage.page-tag-sync.sync-list.step-three.o5xmbmtg9qr'
                  )
                  .d('????????????'),
                value: name,
              },
              {
                title: intl
                  .get(
                    'ide.src.page-manage.page-aim-source.source-detail.main.64wlzv1scpk'
                  )
                  .d('????????????'),
                value: objId.label,
              },
              {
                title: intl
                  .get(
                    'ide.src.page-manage.page-aim-source.source-list.drawer.5u6m68xs7v6'
                  )
                  .d('????????????'),
                value: descr,
              },
            ]}
            className="mb24"
          />

          <div className="info-title ">
            {intl
              .get(
                'ide.src.page-manage.page-tag-sync.sync-list.step-three.kopjxtrup1'
              )
              .d('???????????????')}
          </div>
          <NemoBaseInfo
            dataSource={
              tableName
                ? [
                  {
                    title: intl
                      .get(
                        'ide.src.page-config.workspace-config.main.1b0l5lpgghm'
                      )
                      .d('???????????????'),
                    value: dataDbType.label,
                  },
                  {
                    title: intl
                      .get(
                        'ide.src.business-component.tag-relate.dag-box.9mzk7452ggp'
                      )
                      .d('?????????'),
                    value: dataStorageId.label,
                  },
                  {
                    title: intl
                      .get(
                        'ide.src.page-manage.page-tag-sync.sync-detail.config-info.85dk1zuhe9h'
                      )
                      .d('???'),
                    value: `tbjh_${tableName || objId.key}`,
                  },
                ]
                : [
                  {
                    title: intl
                      .get(
                        'ide.src.page-config.workspace-config.main.1b0l5lpgghm'
                      )
                      .d('???????????????'),
                    value: dataDbType.label,
                  },
                  {
                    title: intl
                      .get(
                        'ide.src.business-component.tag-relate.dag-box.9mzk7452ggp'
                      )
                      .d('?????????'),
                    value: dataStorageId.label,
                  },
                ]
            }
            className="mb24"
          />

          <div className="info-title ">
            {intl
              .get(
                'ide.src.page-manage.page-object-model.object-list.object-detail.modal-relate-table.m5inicr74ce'
              )
              .d('???????????????')}
          </div>
          <NemoBaseInfo
            dataSource={tableData
              .filter(d => d.isMajor)
              .map(d => ({
                title: d.name,
                value: d.columnName,
              }))}
            className="mb24"
          />

          <div className="info-title ">
            {intl
              .get(
                'ide.src.page-manage.page-tag-sync.sync-detail.config-info.fgii8tqth9f'
              )
              .d('??????????????????')}
          </div>
          <div className="FBH mb24">
            <div style={{color: ' rgba(0, 0, 0, 0.45)'}}>
              <span>
                {intl
                  .get(
                    'ide.src.page-manage.page-tag-sync.sync-detail.config-info.mzpcc18sdb'
                  )
                  .d('?????????????????????')}
              </span>
              {tableData.length}
            </div>
            <div>{previewData.tagTotalCount}</div>
          </div>
          <div className="FBH mb24">
            <div style={{color: ' rgba(0, 0, 0, 0.45)', width: '60px'}}>
              {intl
                .get(
                  'ide.src.page-manage.page-tag-sync.sync-detail.config-info.7n32w7krh6d'
                )
                .d('???????????????')}
            </div>
            <div>
              {tableData.map(d => (
                <Tag>{d.name}</Tag>
              ))}
            </div>
          </div>
        </div>

        <div className="bottom-button">
          <Popconfirm
            title={intl
              .get(
                'ide.src.page-manage.page-tag-sync.sync-list.step-three.kygcc96f09k'
              )
              .d('?????????????????????????????????????')}
            placement="topRight"
            onConfirm={this.submit}
            // onCancel={cancel}
            okText={intl
              .get(
                'ide.src.page-manage.page-tag-sync.sync-list.step-three.6sqnqzjhm2q'
              )
              .d('??????')}
            cancelText={intl
              .get('ide.src.page-config.workspace-config.modal.xp905zufzth')
              .d('??????')}
          >
            <Button
              type="primary"
              // onClick={this.submit}
              loading={confirmLoading}
            >
              {intl
                .get(
                  'ide.src.page-manage.page-tag-sync.sync-list.step-three.gqb95qcjngv'
                )
                .d('??????')}
            </Button>
          </Popconfirm>
        </div>
      </div>
    )
  }
}
export default StepThree
