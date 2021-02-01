import intl from 'react-intl-universal'
/**
 * 目的源管理列表 - 字段配置页面
 */
import { Component } from 'react'
import { observer } from 'mobx-react'
import { Drawer, Button, message } from 'antd'
import { ErrorEater } from '@dtwave/uikit'
import Mapping from '@dtwave/oner-mapping'
import { Loading } from '../../../component'

import Store from './store'

@observer
class DrawerTagConfig extends Component {
  value = []
  state = {
    submitting: false,
  }

  block = false
  id = ''

  onClose = () => {
    const { onClose } = this.props
    onClose()
  }

  componentWillMount() {
    this.store = new Store()
    this.store.projectId = this.props.projectId
  }

  componentWillReceiveProps(nextProps) {
    const { visible } = this.props

    if (!_.isEqual(visible !== nextProps.visible) && nextProps.visible) {
      this.store.sourceId = nextProps.info.id

      this.setState({
        loading: true,
      })

      this.getAllData()
    }
  }

  getAllData = async () => {
    try {
      await this.store.getObjList()
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

    const params = {
      id: this.store.sourceId,
      fieldTagMappings: this.value.map(d => ({
        id: d.id,
        tagId: d.tagId,
        fieldName: d.dataFieldName,
      })),
    }

    this.setState(
      {
        submitting: true,
      },
      () => {
        this.store.saveResult(params).then(res => {
          this.setState({
            submitting: false,
          })

          setTimeout(() => {
            this.block = false
            const { onUpdate } = this.props
            if (onUpdate) {
              onUpdate()
            }
          }, 200)
        })
      }
    )
  }

  render() {
    const { visible } = this.props

    const { loading, submitting } = this.state

    const { source, target, result, objList } = this.store

    return (
      <div className="tag-detail-drawer">
        <Drawer
          title={intl
            .get(
              'ide.src.page-manage.page-aim-source.source-detail.main.6pm0gqavven'
            )
            .d('标签映射')}
          placement="right"
          closable
          onClose={this.onClose}
          visible={visible}
          width={1120}
          maskClosable={false}
          destroyOnClose
        >
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
              sourceRowKey={record => record.dataFieldName}
              targetRowKey={record => record.tagId || record.id}
              sourceSearchKey={record => record.dataFieldName}
              targetSearchKey={record => record.name || record.tagName}
              targetColumns={[
                {
                  title: intl
                    .get(
                      'ide.src.business-component.tag-relate.dag-box.xs30zaqk60p'
                    )
                    .d('标签标识'),
                  dataIndex: 'tagEnName',
                  width: 70,
                },

                {
                  title: intl
                    .get(
                      'ide.src.page-manage.page-aim-source.source-detail.main.63kvhqd3cw8'
                    )
                    .d('标签名称'),
                  dataIndex: 'tagName',
                  width: 80,
                },

                {
                  title: intl
                    .get(
                      'ide.src.page-manage.page-aim-source.tag-config.main.2vfpdytl49n'
                    )
                    .d('所属对象'),
                  dataIndex: 'objName',
                  width: 80,
                },

                {
                  title: intl
                    .get(
                      'ide.src.business-component.tag-relate.dag-box.zfaw0a4v7jh'
                    )
                    .d('数据类型'),
                  dataIndex: 'tagType',
                  width: 70,
                },
              ]}
              sourceColumns={[
                {
                  title: intl
                    .get(
                      'ide.src.page-manage.page-aim-source.tag-config.main.ew4yksxl3s'
                    )
                    .d('字段名'),
                  dataIndex: 'dataFieldName',
                  width: 140,
                },

                {
                  title: intl
                    .get(
                      'ide.src.business-component.tag-relate.dag-box.zfaw0a4v7jh'
                    )
                    .d('数据类型'),
                  dataIndex: 'dataFieldType',
                  width: 150,
                },
              ]}
              result={result}
              resultSourceColumns={[
                {
                  title: intl
                    .get(
                      'ide.src.page-manage.page-aim-source.tag-config.main.npdy40q0f2'
                    )
                    .d('字段标识'),
                  dataIndex: 'dataFieldName',
                  width: 96,
                },
              ]}
              resultTargetColumns={[
                {
                  title: intl
                    .get(
                      'ide.src.page-manage.page-aim-source.source-detail.main.63kvhqd3cw8'
                    )
                    .d('标签名称'),
                  dataIndex: 'tagName',
                  width: 69,
                },

                // {
                //   title: '所属对象',
                //   dataIndex: 'objName',
                //   width: 69,
                // },
              ]}
              resultSourceFullColumns={[
                {
                  title: intl
                    .get(
                      'ide.src.page-manage.page-aim-source.tag-config.main.ew4yksxl3s'
                    )
                    .d('字段名'),
                  dataIndex: 'dataFieldName',
                  width: 100,
                },

                {
                  title: intl
                    .get(
                      'ide.src.business-component.tag-relate.dag-box.zfaw0a4v7jh'
                    )
                    .d('数据类型'),
                  dataIndex: 'dataFieldType',
                  width: 80,
                },
              ]}
              resultTargetFullColumns={[
                {
                  title: intl
                    .get(
                      'ide.src.business-component.tag-relate.dag-box.xs30zaqk60p'
                    )
                    .d('标签标识'),
                  dataIndex: 'tagEnName',
                  width: 69,
                },

                {
                  title: intl
                    .get(
                      'ide.src.page-manage.page-aim-source.source-detail.main.63kvhqd3cw8'
                    )
                    .d('标签名称'),
                  dataIndex: 'tagName',
                  width: 69,
                },

                {
                  title: intl
                    .get(
                      'ide.src.page-manage.page-aim-source.tag-config.main.2vfpdytl49n'
                    )
                    .d('所属对象'),
                  dataIndex: 'objName',
                  width: 69,
                },

                {
                  title: intl
                    .get(
                      'ide.src.business-component.tag-relate.dag-box.zfaw0a4v7jh'
                    )
                    .d('数据类型'),
                  dataIndex: 'tagType',
                  width: 69,
                },
              ]}
              resultRowKey={record => record.dataFieldName}
              mappingField={(
                {
                  dataFieldName,
                  dataFieldType,
                  dataStorageId,
                  dataTableName,
                  matching: fieldMatching,
                },

                {
                  tagId,
                  tagName,
                  tagEnName,
                  objName,
                  tagType,
                  matching: tagMatching,
                }
              ) => ({
                dataFieldName,
                dataFieldType,
                dataStorageId,
                dataTableName,
                tagId,
                tagName,
                tagEnName,
                objName,
                tagType,
                fieldMatching,
                tagMatching,
              })}
              nameMappingField={['dataFieldName', 'tagEnName']}
              onChange={value => (this.value = value)}
              sourceTitle={intl
                .get(
                  'ide.src.page-manage.page-aim-source.source-detail.main.yjl6a0fdf2l'
                )
                .d('字段列表')}
              targetTitle={intl
                .get('ide.src.common.navList.5ywghq8b76s')
                .d('标签列表')}
              sourceTipTitle={intl
                .get(
                  'ide.src.page-manage.page-aim-source.tag-config.main.4vdaf0u39s9'
                )
                .d('字段：')}
              targetTipTitle={intl
                .get(
                  'ide.src.page-manage.page-aim-source.tag-config.main.rixtmuv1sg'
                )
                .d('标签：')}
              sourceSearchPlaceholder={intl
                .get(
                  'ide.src.component.noborder-input.noborder-input.xxeqxv2wh5'
                )
                .d('请输入名称搜索')}
              targetSearchPlaceholder={intl
                .get(
                  'ide.src.component.noborder-input.noborder-input.xxeqxv2wh5'
                )
                .d('请输入名称搜索')}
              sourceDisableKey={record => record.tagStatus === 1}
              targetDisableKey={record => record.tagStatus === 1}
              disableKey={record => record.tagStatus === 1}
              // disableMsg="使用中无法删除映射"
              // hasSearchSelect
              // searchSelectList={toJS(objList)}
              // searchSelectPlaceholder="请选择对象"
              // searchSelectKey="objName"
              isShowMapping
              canMapping
              beforeMapping={v => {
                const mappingItem = v[0]

                const { fieldMatching, tagMatching } = v[0]
                // 标签Matching 0 万能
                if (!tagMatching) {
                  return Promise.resolve([])
                }
                if (fieldMatching !== tagMatching) {
                  const mappingDataFieldName = mappingItem.dataFieldName
                  const mappingTagName = mappingItem.tagName
                  message.error(
                    intl
                      .get(
                        'ide.src.page-manage.page-aim-source.tag-config.main.5l9g09wegwb',
                        {
                          mappingDataFieldName: mappingDataFieldName,
                          mappingTagName: mappingTagName,
                        }
                      )
                      .d(
                        '{mappingDataFieldName}(字段)与{mappingTagName}(标签)数据类型不匹配， 绑定失败'
                      )
                  )
                  return Promise.reject()
                }

                return Promise.resolve([])
              }}
              // beforeNameMapping={v => {
              //   console.log(v)
              //   const originalResult = v.filter(d => d.isUsed || d.status === 2)

              //   const successResult = v.filter(d => d.dataFieldName === d.tagName)

              //   const errorResult = v.filter(d => d.dataFieldName !== d.tagName)
              //   message.info(`${successResult.length}个标签映射成功，${errorResult.length}个标签映射失败`)

              //   const mappingResult = originalResult.concat(successResult)

              //   return new Promise(function (resolve, reject) {
              //     resolve(mappingResult)
              //   })
              // }}
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
                  .d('取消')}
              </Button>
              <Button
                type="primary"
                onClick={this.submit}
                loading={submitting}
                style={{ float: 'right' }}
              >
                {intl
                  .get('ide.src.page-config.workspace-config.modal.osxrfhrriz')
                  .d('确认')}
              </Button>
            </div>
          )}
        </Drawer>
      </div>
    )
  }
}
export default DrawerTagConfig
