import intl from 'react-intl-universal'
import {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {Button, message, Checkbox} from 'antd'
import {ErrorEater} from '@dtwave/uikit'
import Mapping from '@dtwave/oner-mapping'
import {Loading} from '../../../../component'

@observer
class StepTwo extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  value = []
  state = {
    submitting: false,
  }

  block = false
  id = ''

  componentWillReceiveProps(nextProps) {
    const {show} = this.props
    if (nextProps.show && show !== nextProps.show) {
      if (+this.store.boundMethodId === 1) {
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

  submit = () => {
    if (this.block) {
      return
    }

    this.block = true
    // const {
    //   onUpdate,
    // } = this.props
    // if (onUpdate) {
    //   onUpdate()
    // }
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

  @action.bound checked(e) {
    const {store} = this.props
    store.checkedPulish = e.target.checked
  }

  render() {
    const {show} = this.props

    const {loading, submitting} = this.state

    const {
      source,
      target,
      result,
      boundMethodId,
      schemeList,
      tableList,
    } = this.store

    return (
      <div style={{display: show ? 'block' : 'none'}}>
        {loading ? (
          <Loading mode="block" height={200} />
        ) : (
          <div>
            <div style={{textAlign: 'right'}}>
              <Checkbox
                checked={this.store.checkedPulish}
                onChange={this.checked}
              >
                {intl
                  .get(
                    'ide.src.page-manage.page-tag-model.tag-model.tag-config-batch.step-two.v3crt7yina'
                  )
                  .d('?????????????????????????????????')}
              </Checkbox>
            </div>
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
                    boundMethodId === 1
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
                  dataIndex:
                    boundMethodId === 1 ? 'schemeName' : 'dataTableName',
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
                  width: 90,
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
                      'ide.src.business-component.tag-relate.dag-box.xr0hezmhuj'
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
                    boundMethodId === 1
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
                  dataIndex:
                    boundMethodId === 1 ? 'schemeName' : 'dataTableName',
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
                  dataFieldType,
                  isUsed,
                  schemeId,
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
                tagType,
                isUsed,
                tagDerivativeSchemeId: schemeId,
              })}
              nameMappingField={['enName', 'dataFieldName']}
              onChange={value => {
                this.value = value
                this.store.pubTagList = value
              }}
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
              disableKey={record => record.used === 1 || record.isUsed === 1 || record.status === 2
              }
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
              // searchSelectList={boundMethodId === 1 ? schemeList : tableList}
              // searchSelectPlaceholder={boundMethodId === 1 ? '?????????????????????' : '??????????????????'}
              // searchSelectKey={boundMethodId === 1 ? 'schemeName' : 'dataTableName'}
              isShowMapping
              canMapping
              beforeMapping={v => {
                const mappingItem = v[0]
                if (mappingItem.tagValueType !== mappingItem.tagType) {
                  const mappingItemTagName = mappingItem.tagName
                  const mappingItemDataFieldName = mappingItem.dataFieldName
                  message.error(
                    intl
                      .get(
                        'ide.src.page-manage.page-tag-model.tag-model.tag-config-batch.step-two.txgvm1r43o',
                        {
                          mappingItemTagName,
                          mappingItemDataFieldName,
                        }
                      )
                      .d(
                        '{mappingItemTagName}(??????)???{mappingItemDataFieldName}(??????)???????????????????????? ????????????'
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
          </div>
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
            <Button onClick={() => this.store.lastStep()} className="mr8">
              {intl
                .get(
                  'ide.src.page-manage.page-tag-model.data-sheet.config-field.m6ae9pj50gh'
                )
                .d('?????????')}
            </Button>
            <Button
              type="primary"
              onClick={this.submit}
              loading={submitting}
              style={{float: 'right'}}
            >
              {intl
                .get('ide.src.page-config.workspace-config.modal.osxrfhrriz')
                .d('??????')}
            </Button>
          </div>
        )}
      </div>
    )
  }
}
export default StepTwo
