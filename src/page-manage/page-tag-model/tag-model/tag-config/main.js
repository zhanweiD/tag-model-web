import intl from 'react-intl-universal'
import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Drawer, Button, Tabs, message} from 'antd'
import {ErrorEater} from '@dtwave/uikit'
import Mapping from '@dtwave/oner-mapping'
import {Loading} from '../../../../component'

import Store from './store'

const {TabPane} = Tabs

@observer
class DrawerTagConfig extends Component {
  value = []
  state = {
    submitting: false,
  }

  block = false
  id = ''

  onClose = () => {
    const {onClose} = this.props
    onClose()
  }

  componentWillMount() {
    const {projectId} = this.props
    this.store = new Store({
      projectId,
    })
  }

  componentWillReceiveProps(nextProps) {
    const {
      // info,
      visible,
    } = this.props

    if (!_.isEqual(visible !== nextProps.visible) && nextProps.visible) {
      this.store.objId = nextProps.info.objId
      this.store.tagIds = [+nextProps.info.id]
      this.store.configType = nextProps.info.configType

      if (+nextProps.info.configType === 1) {
        this.store.getSchemeList()
      } else {
        this.store.getTableList()
      }

      this.setState({
        loading: true,
      })

      this.getAllData()
    }
  }

  getAllData = async () => {
    try {
      await this.store.getResultData()
      await this.store.getFieldData()
      await this.store.getTagData()

      this.value = this.store.result
      // this.store.resultValue = this.store.result

      this.setState({
        loading: false,
      })
    } catch (error) {
      ErrorEater(error, 'custom title', e => console.log(e))

      this.setState({
        loading: false,
      })
    }
  }

  @action changeValue = v => {
    this.value = v
    // this.store.resultValue = v
  }

  submit = () => {
    if (this.block) {
      return
    }
    this.block = true

    this.setState(
      {
        submitting: true,
      },
      () => {
        this.store.saveResult(this.value).then(() => {
          this.setState({
            submitting: false,
          })

          setTimeout(() => {
            this.block = false
            const {onUpdate} = this.props
            if (onUpdate) {
              onUpdate()
            }
          }, 200)
        })
      }
    )
  }

  render() {
    const {visible, type} = this.props

    const {loading, submitting} = this.state

    const {
      source,
      target,
      result,
      configType,
      tableList,
      schemeList,
    } = this.store
    return (
      <div className="tag-detail-drawer">
        <Drawer
          title={intl
            .get(
              'ide.src.page-manage.page-project-tag.detail.storage-list.8biidsm1yn4'
            )
            .d('????????????')}
          placement="right"
          closable
          onClose={this.onClose}
          visible={visible}
          width={1120}
          maskClosable={false}
          destroyOnClose
        >
          {type === 'more' ? (
            <Tabs onChange={null} type="card" size="small">
              <TabPane
                tab={intl
                  .get(
                    'ide.src.page-manage.page-tag-model.tag-model.tag-config.main.1a8izao82so'
                  )
                  .d('??????????????????')}
                key="1"
              />
              <TabPane
                tab={intl
                  .get(
                    'ide.src.page-manage.page-tag-model.tag-model.tag-config.main.j31zfb050go'
                  )
                  .d('??????????????????')}
                key="2"
              />
            </Tabs>
          ) : null}

          {loading ? (
            <Loading mode="block" height={200} />
          ) : (
            <Mapping
              style={{
                display: 'inline-block',
                width: '100%',
              }}
              source={source}
              target={target}
              sourceRowKey={record => record.tagId || record.id}
              targetRowKey={record => `${record.dataStorageId}${record.dataTableName}${record.dataFieldName}`
              }
              sourceSearchKey={record => record.name || record.tagName}
              targetSearchKey={record => record.dataFieldName}
              targetColumns={[
                {
                  title: intl
                    .get(
                      'ide.src.business-component.tag-relate.dag-box.co39wa8uxw5'
                    )
                    .d('????????????'),
                  dataIndex: 'dataFieldName',
                  width: 80,
                },

                {
                  title: intl
                    .get(
                      'ide.src.business-component.tag-relate.dag-box.zfaw0a4v7jh'
                    )
                    .d('????????????'),
                  dataIndex: 'dataFieldType',
                  width: 80,
                },

                {
                  title:
                    configType === 1
                      ? intl
                        .get(
                          'ide.src.page-manage.page-tag-model.tag-model.tag-config-batch.step-two.xcpjx1nr71n'
                        )
                        .d('????????????')
                      : intl
                        .get(
                          'ide.src.page-manage.page-aim-source.source-list.main.bh6e3tzii5'
                        )
                        .d('?????????'),
                  dataIndex: configType === 1 ? 'schemeName' : 'dataTableName',
                  width: 90,
                },
              ]}
              sourceColumns={[
                {
                  title: intl
                    .get(
                      'ide.src.business-component.tag-relate.dag-box.xs30zaqk60p'
                    )
                    .d('????????????'),
                  dataIndex: 'enName',
                  width: 90,
                },

                {
                  title: intl
                    .get(
                      'ide.src.page-manage.page-aim-source.source-detail.main.63kvhqd3cw8'
                    )
                    .d('????????????'),
                  dataIndex: 'name',
                  width: 90,
                },

                {
                  title: intl
                    .get(
                      'ide.src.business-component.tag-relate.dag-box.zfaw0a4v7jh'
                    )
                    .d('????????????'),
                  dataIndex: 'valueTypeName',
                  width: 100,
                },
              ]}
              result={result}
              resultSourceColumns={[
                {
                  title: intl
                    .get(
                      'ide.src.page-manage.page-aim-source.source-detail.main.63kvhqd3cw8'
                    )
                    .d('????????????'),
                  dataIndex: 'tagName',
                  width: 96,
                },
              ]}
              resultTargetColumns={[
                {
                  title: intl
                    .get(
                      'ide.src.page-manage.page-aim-source.tag-config.main.npdy40q0f2'
                    )
                    .d('????????????'),
                  dataIndex: 'dataFieldName',
                  width: 69,
                },
              ]}
              resultSourceFullColumns={[
                {
                  title: intl
                    .get(
                      'ide.src.page-manage.page-tag-model.tag-model.tag-config-batch.step-two.rezskwnjeyf'
                    )
                    .d('???????????????'),
                  dataIndex: 'tagEnName',
                  width: 100,
                },

                {
                  title: intl
                    .get(
                      'ide.src.page-manage.page-tag-model.tag-model.tag-config-batch.step-two.sqnqfvltw4j'
                    )
                    .d('???????????????'),
                  dataIndex: 'tagName',
                  width: 80,
                },

                {
                  title: intl
                    .get(
                      'ide.src.business-component.tag-relate.dag-box.zfaw0a4v7jh'
                    )
                    .d('????????????'),
                  dataIndex: 'tagValueTypeName',
                  width: 80,
                },
              ]}
              resultTargetFullColumns={[
                {
                  title: intl
                    .get(
                      'ide.src.business-component.tag-relate.dag-box.co39wa8uxw5'
                    )
                    .d('????????????'),
                  dataIndex: 'dataFieldName',
                  width: 60,
                },

                {
                  title: intl
                    .get(
                      'ide.src.business-component.tag-relate.dag-box.xr0hezmhuj'
                    )
                    .d('????????????'),
                  dataIndex: 'dataFieldType',
                  width: 60,
                },

                {
                  title:
                    configType === 1
                      ? intl
                        .get(
                          'ide.src.page-manage.page-tag-model.tag-model.tag-config-batch.step-two.xcpjx1nr71n'
                        )
                        .d('????????????')
                      : intl
                        .get(
                          'ide.src.page-manage.page-aim-source.source-list.main.bh6e3tzii5'
                        )
                        .d('?????????'),
                  dataIndex: configType === 1 ? 'schemeName' : 'dataTableName',
                  width: 130,
                },
              ]}
              resultRowKey={record => record.tagId}
              mappingField={(
                {
                  id: tagId,
                  name: tagName,
                  enName: tagEnName,
                  valueType: tagValueType,
                  valueTypeName: tagValueTypeName,
                },

                {
                  dataStorageId,
                  dataDbName,
                  dataDbType,
                  dataTableName,
                  dataFieldName,
                  isUsed,
                  schemeId,
                  dataFieldType,
                  tagType,
                }
              ) => ({
                tagId,
                tagName,
                tagEnName,
                tagValueType,
                tagValueTypeName,
                dataStorageId,
                dataDbName,
                dataDbType,
                dataTableName,
                dataFieldName,
                dataFieldType,
                isUsed,
                tagType,
                tagDerivativeSchemeId: schemeId,
              })}
              nameMappingField={['enName', 'dataFieldName']}
              onChange={this.changeValue}
              sourceTitle={intl
                .get('ide.src.common.navList.5ywghq8b76s')
                .d('????????????')}
              targetTitle={intl
                .get(
                  'ide.src.page-manage.page-aim-source.source-detail.main.yjl6a0fdf2l'
                )
                .d('????????????')}
              sourceTipTitle={intl
                .get(
                  'ide.src.page-manage.page-aim-source.tag-config.main.4vdaf0u39s9'
                )
                .d('?????????')}
              targetTipTitle={intl
                .get(
                  'ide.src.page-manage.page-aim-source.tag-config.main.rixtmuv1sg'
                )
                .d('?????????')}
              sourceSearchPlaceholder={intl
                .get(
                  'ide.src.component.noborder-input.noborder-input.xxeqxv2wh5'
                )
                .d('?????????????????????')}
              targetSearchPlaceholder={intl
                .get(
                  'ide.src.component.noborder-input.noborder-input.xxeqxv2wh5'
                )
                .d('?????????????????????')}
              sourceDisableKey={record => record.status === 2}
              targetDisableKey={record => record.status === 2}
              disableKey={record => record.isUsed === 1 || record.status === 2}
              disableMsg={record => (record.status === 2
                ? intl
                  .get(
                    'ide.src.page-manage.page-tag-model.tag-model.tag-config-batch.step-two.9clicvdx2d'
                  )
                  .d('?????????????????????????????????')
                : intl
                  .get(
                    'ide.src.page-manage.page-tag-model.tag-model.tag-config-batch.step-two.ob4m2pmgtto'
                  )
                  .d('???????????????????????????'))
              }
              // hasSearchSelect
              // searchSelectList={configType === 1 ? schemeList : tableList}
              // searchSelectPlaceholder={configType === 1 ? '?????????????????????' : '??????????????????'}
              // searchSelectKey={configType === 1 ? 'schemeName' : 'dataTableName'}
              isShowMapping
              canMapping
              beforeMapping={v => {
                const mappingItem = v[0]
                if (mappingItem.tagValueType !== mappingItem.tagType) {
                  const mapDataFieldName = mappingItem.dataFieldName
                  const mapTagName = mappingItem.tagName
                  message.error(
                    intl
                      .get(
                        'ide.src.page-manage.page-tag-model.tag-model.tag-config.main.5d1c5z9uagn',
                        {
                          mapTagName,
                          mapDataFieldName,
                        }
                      )
                      .d(
                        '{mapTagName}(??????)???{mapDataFieldName}(??????)???????????????????????? ????????????'
                      )
                  )
                  return new Promise(function (resolve, reject) {
                    reject([])
                  })
                }
                return new Promise(function (resolve, reject) {
                  resolve([])
                })
              }}
              beforeNameMapping={v => {
                const successResult = v.filter(
                  d => d.tagValueType === d.tagType || d.status === 2 || d.isUsed
                )
                const successLength = successResult.length
                const errorResult = v.filter(
                  d => d.tagValueType !== d.tagType && !d.isUsed && d.status !== 2
                )
                const errorLength = errorResult.length
                message.info(
                  intl
                    .get(
                      'ide.src.page-manage.page-tag-model.tag-model.tag-config-batch.step-two.1ecch5wk3kx',
                      {successLength, errorLength}
                    )
                    .d(
                      '{successLength}????????????????????????{errorLength}?????????????????????'
                    )
                )

                return new Promise(function (resolve, reject) {
                  resolve(successResult)
                })
              }}
            />
          )}

          {!loading && (
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                borderTop: '1px solid #e8e8e8',
                padding: '10px 16px',
                textAlign: 'right',
                left: 0,
                background: '#fff',
              }}
            >
              <Button onClick={this.onClose} className="mr8">
                {intl
                  .get('ide.src.page-config.workspace-config.modal.xp905zufzth')
                  .d('??????')}
              </Button>
              <Button
                type="primary"
                onClick={this.submit}
                loading={submitting}
                style={{float: 'right'}}
                disabled={!target.length && !result.length}
              >
                {intl
                  .get('ide.src.page-config.workspace-config.modal.osxrfhrriz')
                  .d('??????')}
              </Button>
            </div>
          )}
        </Drawer>
      </div>
    )
  }
}
export default DrawerTagConfig
