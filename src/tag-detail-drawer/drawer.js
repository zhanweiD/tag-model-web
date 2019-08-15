import {Component} from 'react'
import {observer} from 'mobx-react'
import {Drawer, Spin, Button} from 'antd'
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

  showDrawer = () => {
    this.setState({
      visiable: true,
    })
  }

  onClose = () => {
    this.setState({
      visiable: false,
    })
  }


  componentWillMount() {
    this.store = new Store()
    const {
      id,
    } = this.props
    if (id) {
      this.getAllData(id)
    }
  }

  getAllData = async id => {
    try {
      await this.store.getResultData(id)
      await this.store.getFieldData(id)
      await this.store.getTagData(id)

      this.setState({
        loading: false,
      })
    } catch (e) {

    }
  }

  submit = () => {
    const {
      id,
    } = this.props

    const {
      submitting,
    } = this.state

    if (submitting) {
      return
    }

    this.setState({
      submitting: true,
    }, () => {
      this.store.saveResult(this.value, id).then(res => {
        this.setState({
          submitting: false,
        })
      })
    })
  }

  componentWillReceiveProps(nextProps) {
    const {
      id,
    } = nextProps

    if (id) {
      this.getAllData(id)
    }
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
          closable={false}
          onClose={this.onClose}
          visible={visiable}
          width={1200}
        >
          <Spin spinning={loading}>
            {
              !loading
              && (
                <Mapping
                  source={source}
                  target={target}
                  sourceRowKey={record => record.tagId || record.id}
                  targetRowKey={record => `${record.dataStorageId}${record.dataTableName}${record.dataFieldName}`}
                  sourceSearchKey={record => record.name}
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
                      width: 100,
                    },
                    {
                      title: '中文名',
                      dataIndex: 'name',
                      width: 100,
                    },
                    {
                      title: '数据类型',
                      dataIndex: 'valueTypeName',
                      width: 100,
                    },
                  ]}
                  result={result}
                  resultSourceColumns={[
                    {
                      title: '标签中文名',
                      dataIndex: 'tagName',
                      width: 35,
                    },
                  ]}
                  resultTargetColumns={[
                    {
                      title: '字段英文名',
                      dataIndex: 'dataFieldName',
                      width: 35,
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
                      width: 100,
                    },
                    {
                      title: '数据类型',
                      dataIndex: 'tagValueTypeName',
                      width: 100,
                    },
                  ]}
                  resultTargetFullColumns={[
                    {
                      title: '英文名',
                      dataIndex: 'dataFieldName',
                      width: 100,
                    },
                    {
                      title: '字段类型',
                      dataIndex: 'dataFieldType',
                      width: 100,
                    },
                    {
                      title: '数据表',
                      dataIndex: 'dataTableName',
                      width: 100,
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
                      id,
                      dataStorageId,
                      dataDbName,
                      dataDbType,
                      dataTableName,
                      dataFieldName,
                      dataFieldType,
                    }
                  ) => {
                    return {
                      tagId,
                      id,
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
                    }
                  }}
                  nameMappingField={['enName', 'dataFieldName']}
                  onChange={value => this.value = value}
                  sourceTitle="标签列表"
                  targetTitle="字段列表"
                  beforeMapping={() => new Promise(((resolve, reject) => {
                    resolve()
                  }))}
                />
              )
            }
            <Button type="primary" onClick={this.submit} loading={submitting} style={{float: 'right', marginTop: '32px'}}>确认</Button>
          </Spin>
        </Drawer>
      </div>
    )
  }
}
