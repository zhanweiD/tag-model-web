import {Component} from 'react'
import {observer} from 'mobx-react'
import {Drawer, Spin, Button} from 'antd'
import {ErrorEater} from '@dtwave/uikit'
import Mapping from '@dtwave/oner-mapping'

import Store from './store-drawer'

@observer
export default class TagDetailDrawer extends Component {
  value = []
  state = {
    visiable: false,
    loading: true,
    submitting: false,
  }

  block = false
  id = ''

  showDrawer = () => {
    this.setState({
      visiable: true,
    })

    const {
      id,
    } = this

    if (id) {
      this.getAllData(id)
    }
  }

  onClose = () => {
    this.setState({
      visiable: false,
    })
  }


  componentWillMount() {
    this.store = new Store()
    // const {
    //   id,
    // } = this.props
    // if (id) {
    //   this.getAllData(id)
    // }
  }

  getAllData = async id => {
    try {
      await this.store.getResultData(id)
      await this.store.getFieldData(id)
      await this.store.getTagData(id)

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
    }
  }

  submit = () => {
    const {
      id,
    } = this.props

    if (this.block) {
      return
    }

    this.block = true

    this.setState({
      submitting: true,
    }, () => {
      this.store.saveResult(this.value, id).then(res => {
        this.setState({
          submitting: false,
          visiable: false,
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

  componentWillReceiveProps(nextProps) {
    const {
      id,
    } = nextProps
    this.id = id
    //
    // if (id) {
    //   this.getAllData(id)
    // }
  }

  componentDidMount() {
  }

  render() {
    const {
      children,
    } = this.props

    const {
      visiable,
      loading,
      submitting,
    } = this.state

    const {
      source,
      target,
      result,
    } = this.store

    return (
      <div className="tag-detail-drawer">
        <div className="drawer-trigger" onClick={this.showDrawer} key="tag-detail-drawer">
          {children}
        </div>
        <Drawer
          title="绑定字段"
          placement="right"
          closable
          onClose={this.onClose}
          visible={visiable}
          width={1020}
          maskClosable={false}
        >
          <Spin spinning={loading}>
            {
              !loading
              && (
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
                      title: '英文名',
                      dataIndex: 'dataFieldName',
                    },
                    {
                      title: '字段类型',
                      dataIndex: 'dataFieldType',
                    },
                    {
                      title: '数据表',
                      dataIndex: 'dataTableName',
                    },
                  ]}
                  sourceColumns={[
                    {
                      title: '英文名',
                      dataIndex: 'enName',
                      width: 90,
                    },
                    {
                      title: '名称',
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
                      title: '字段英文名',
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
                  })}
                  nameMappingField={['enName', 'dataFieldName']}
                  onChange={value => this.value = value}
                  sourceTitle="标签列表"
                  targetTitle="字段列表"
                  sourceSearchPlaceholder="请输入名称搜索"
                  targetSearchPlaceholder="请输入英文名搜索"
                  disableKey={record => record.used === 1 || record.isUsed === 1}
                />
              )
            }
          </Spin>
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
