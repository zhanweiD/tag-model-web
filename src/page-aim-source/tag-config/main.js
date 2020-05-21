import {Component} from 'react'
import {observer} from 'mobx-react'
import {toJS} from 'mobx'
import {Drawer, Button} from 'antd'
import {ErrorEater} from '@dtwave/uikit'
import Mapping from '@dtwave/oner-mapping'
import {Loading} from '../../component'

import Store from './store'

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
    this.store = new Store()
  }

  componentWillReceiveProps(nextProps) {
    const {
      visible,
    } = this.props

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

    const params = {
      id: this.store.sourceId,
      fieldTagMappings: this.value.map(d => ({
        id: d.id,
        tagId: d.tagId,
        fieldName: d.dataFieldName,
      })),
    }

    this.setState({
      submitting: true,
    }, () => {
      this.store.saveResult(params).then(res => {
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
    } = this.props

    const {
      loading,
      submitting,
    } = this.state

    const {
      source,
      target,
      result,
      objList,
    } = this.store

    return (
      <div className="tag-detail-drawer">
        <Drawer
          title="标签映射"
          placement="right"
          closable
          onClose={this.onClose}
          visible={visible}
          width={1120}
          maskClosable={false}
          destroyOnClose
        >
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
                  sourceRowKey={record => record.dataFieldName}
                  targetRowKey={record => record.tagId || record.id}
                  sourceSearchKey={record => record.dataFieldName}
                  targetSearchKey={record => record.name || record.tagName}
                  targetColumns={[
                    {
                      title: '唯一标识',
                      dataIndex: 'tagEnName',
                      width: 70,
                    },
                    {
                      title: '标签名称',
                      dataIndex: 'tagName',
                      width: 80,
                    },
                    {
                      title: '所属对象',
                      dataIndex: 'objName',
                      width: 80,
                    },
                    {
                      title: '数据类型',
                      dataIndex: 'tagType',
                      width: 70,
                    },
                  ]}
                  sourceColumns={[
                    {
                      title: '字段名',
                      dataIndex: 'dataFieldName',
                      width: 140,
                    },
                    {
                      title: '数据类型',
                      dataIndex: 'dataFieldType',
                      width: 150,
                    },
                  ]}
                  result={result}
                  resultSourceColumns={[
                    {
                      title: '字段标识',
                      dataIndex: 'dataFieldName',
                      width: 96,
                    },
                  ]}
                  resultTargetColumns={[
                    {
                      title: '标签名称',
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
                      title: '字段名',
                      dataIndex: 'dataFieldName',
                      width: 100,
                    },
                    {
                      title: '数据类型',
                      dataIndex: 'dataFieldType',
                      width: 80,
                    },
                  ]}
                  resultTargetFullColumns={[
                    {
                      title: '唯一标识',
                      dataIndex: 'tagEnName',
                      width: 69,
                    },
                    {
                      title: '标签名称',
                      dataIndex: 'tagName',
                      width: 69,
                    },
                    {
                      title: '所属对象',
                      dataIndex: 'objName',
                      width: 69,
                    },
                    {
                      title: '数据类型',
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
                    },
                    {
                      tagId,
                      tagName,
                      tagEnName,
                      objName,
                      tagType,
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
                  })}
                  nameMappingField={['dataFieldName', 'tagEnName']}
                  onChange={value => this.value = value}
                  sourceTitle="字段列表"
                  targetTitle="标签列表"
                  sourceTipTitle="字段："
                  targetTipTitle="标签："
                  sourceSearchPlaceholder="请输入名称搜索"
                  targetSearchPlaceholder="请输入名称搜索"
                  sourceDisableKey={record => record.tagStatus === 1}
                  targetDisableKey={record => record.tagStatus === 1}
                  disableKey={record => record.tagStatus === 1}
                  // disableMsg="使用中无法删除映射"
                  hasSearchSelect
                  searchSelectList={toJS(objList)}
                  searchSelectPlaceholder="请选择对象"
                  searchSelectKey="objName"
                  isShowMapping
                  canMapping
                  // beforeMapping={v => {
                  //   const mappingItem = v[0]
                  //   if (mappingItem.tagType !== mappingItem.dataFieldType) {   
                  //     message.error(`${mappingItem.dataFieldName}(字段)与${mappingItem.tagName}(标签)数据类型不匹配， 绑定失败`)
                  //     return new Promise(function (resolve, reject) {
                  //       reject([])
                  //     })
                  //   } 
                  //   return new Promise(function (resolve, reject) {
                  //     resolve([])
                  //   })
                  // }}
                  // beforeNameMapping={v => {
                  //   const originalResult = v.filter(d => d.isUsed || d.status === 2)
        
                  //   const successResult = v.filter(d => d.valueTypeName === d.dataFieldType)
        
                  //   const errorResult = v.filter(d => d.valueTypeName !== d.dataFieldType)
                  //   message.info(`${successResult.length}个标签映射成功，${errorResult.length}个标签映射失败`)
        
                  //   const mappingResult = originalResult.concat(successResult)
        
                  //   return new Promise(function (resolve, reject) {
                  //     resolve(mappingResult)
                  //   })
                  // }}
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
