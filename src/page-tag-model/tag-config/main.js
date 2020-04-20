import {Component} from 'react'
import {observer} from 'mobx-react'
import {Drawer, Button, Tabs, message} from 'antd'
import {ErrorEater} from '@dtwave/uikit'
import Mapping from '@dtwave/oner-mapping'
import {Loading} from '../../component'

import Store from './store'

const {TabPane} = Tabs

@observer
export default class DrawerTagConfig extends Component {
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
      ErrorEater(
        error,
        'custom title',
        e => console.log(e),
      )
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

    this.setState({
      submitting: true,
    }, () => {
      this.store.saveResult(this.value).then(() => {
        this.setState({
          submitting: false,
        })
        setTimeout(() => {
          this.block = false
          const {
            onUpdate,
          } = this.props
          if (onUpdate) {
            onUpdate()
          }
        }, 200)
      })
    })
  }

  render() {
    const {
      visible,
      type,
    } = this.props

    const {
      loading,
      submitting,
    } = this.state

    const {
      source,
      target,
      result,
      configType,
    } = this.store

    return (
      <div className="tag-detail-drawer">
        <Drawer
          title="绑定字段"
          placement="right"
          closable
          onClose={this.onClose}
          visible={visible}
          width={1120}
          maskClosable={false}
        >
          {
            type === 'more' ? (
              <Tabs onChange={null} type="card" size="small">  
                <TabPane tab="基础标签绑定" key="1" />
                <TabPane tab="衍生标签绑定" key="2" />
              </Tabs>
            ) : null
          }
         
          {
            loading
              ? <Loading mode="block" height={200} /> 
              : (
                <Mapping
                  style={{
                    display: 'inline-block',
                    width: '100%',
                  }}
                  source={source}
                  target={target}
                  sourceRowKey={record => record.tagId || record.id}
                  targetRowKey={record => `${record.dataStorageId}${record.dataTableName}${record.dataFieldName}`}
                  sourceSearchKey={record => record.name || record.tagName}
                  targetSearchKey={record => record.dataFieldName}
                  targetColumns={[
                    {
                      title: '字段名称',
                      dataIndex: 'dataFieldName',
                      width: 80,
                    },
                    {
                      title: '数据类型',
                      dataIndex: 'dataFieldType',
                      width: 80,
                    },
                    {
                      title: configType === 1 ? '加工方案' : '数据表',
                      dataIndex: configType === 1 ? 'schemeName' : 'dataTableName',
                      width: 90,
                    },
                  /*
                    {
                      title: '',
                      width: 10,
                      render: () => <span></span>,
                    },
                    */
                  ]}
                  sourceColumns={[
                    {
                      title: '唯一标识',
                      dataIndex: 'enName',
                      width: 90,
                    },
                    {
                      title: '标签名称',
                      dataIndex: 'name',
                      width: 90,
                    },
                    {
                      title: '数据类型',
                      dataIndex: 'valueTypeName',
                      width: 90,
                    },
                  ]}
                  result={result}
                  resultSourceColumns={[
                    {
                      title: '标签名称',
                      dataIndex: 'tagName',
                      width: 96,
                    },
                  ]}
                  resultTargetColumns={[
                    {
                      title: '字段标识',
                      dataIndex: 'dataFieldName',
                      width: 69,
                    },
                  ]}
                  resultSourceFullColumns={[
                    {
                      title: '标签英文名',
                      dataIndex: 'tagEnName',
                      width: 100,
                    },
                    {
                      title: '标签中文名',
                      dataIndex: 'tagName',
                      width: 80,
                    },
                    {
                      title: '数据类型',
                      dataIndex: 'tagValueTypeName',
                      width: 80,
                    },
                  ]}
                  resultTargetFullColumns={[
                    {
                      title: '英文名',
                      dataIndex: 'dataFieldName',
                      width: 60,
                    },
                    {
                      title: '字段类型',
                      dataIndex: 'dataFieldType',
                      width: 60,
                    },
                    {
                      title: '数据表',
                      dataIndex: 'dataTableName',
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
                    tagDerivativeSchemeId: schemeId,
                  })}
                  nameMappingField={['enName', 'dataFieldName']}
                  onChange={value => this.value = value}
                  sourceTitle="标签列表"
                  targetTitle="字段列表"
                  sourceTipTitle="字段："
                  targetTipTitle="标签："
                  sourceSearchPlaceholder="请输入名称搜索"
                  targetSearchPlaceholder="请输入名称搜索"
                  sourceDisableKey={record => record.status === 2}
                  targetDisableKey={record => record.status === 2}
                  disableKey={record => record.used === 1 || record.isUsed === 1 || record.status === 2}
                  disableMsg={record => (record.status === 2 ? '标签已发布无法删除映射' : '使用中无法删除映射')}
                  hasSearchSelect
                  searchSelectList={[{name: '123', value: 123}]}
                  searchSelectPlaceholder={configType === 1 ? '请选择加工方案' : '请选择数据表'}
                  searchSelectKey={configType === 1 ? 'schemeName' : 'dataTableName'}
                  isShowMapping
                  canMapping
                  beforeMapping={v => {
                    const mappingItem = v[0]
                    if (mappingItem.valueTypeName !== mappingItem.dataFieldType) {   
                      message.error(`${mappingItem.tagName}(标签)与${mappingItem.dataFieldName}(字段)数据类型不匹配， 绑定失败`)
                      return new Promise(function (resolve, reject) {
                        reject([])
                      })
                    } 
                    return new Promise(function (resolve, reject) {
                      resolve([])
                    })
                  }}
                  beforeNameMapping={v => {
                    const originalResult = v.filter(d => d.isUsed || d.status === 2)
        
                    const successResult = v.filter(d => d.valueTypeName === d.dataFieldType)
        
                    const errorResult = v.filter(d => d.valueTypeName !== d.dataFieldType)
                    message.info(`${successResult.length}个标签映射成功，${errorResult.length}个标签映射失败`)
        
                    const mappingResult = originalResult.concat(successResult)
        
                    return new Promise(function (resolve, reject) {
                      resolve(mappingResult)
                    })
                  }}
                />
              )
              
          }
          {
            !loading
            && (
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
                <Button onClick={this.onClose} className="mr8">取消</Button>
                <Button
                  type="primary"
                  onClick={this.submit}
                  loading={submitting}
                  style={{float: 'right'}}
                >
                  确认
                </Button>
              </div>
            )
          }
        </Drawer>
      </div>
    )
  }
}
