import {Component, Fragment} from 'react'
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import {Drawer, Select, Table, Tooltip, Popconfirm, Input} from 'antd'
import store from './store-relfield'

const {Option} = Select
const {Search} = Input

@observer
class DrawerRelfield extends Component {
  @observable updateKey = false

  constructor(props) {
    super(props)
    store.id = this.props.store.id

    this.tableCol = [
      {
        title: '字段名称',
        key: 'dataFieldName',
        dataIndex: 'dataFieldName',
      }, {
        title: '数据源',
        key: 'dataDbName',
        dataIndex: 'dataDbName',
      }, {
        title: '数据源类型',
        key: 'storageTypeName',
        dataIndex: 'storageTypeName',
      }, {
        title: '数据表名称',
        key: 'dataTableName',
        dataIndex: 'dataTableName',
      }, {
        title: '配置状态',
        key: 'isConfigured',
        dataIndex: 'isConfigured',
        render: text => <span>{text ? '已配置' : '待配置'}</span>,
      }, {
        title: '使用状态',
        key: 'isUsed',
        dataIndex: 'isUsed',
        render: text => <span>{text ? '使用中' : '未使用'}</span>,
      }, {
        title: '标签中文',
        key: 'name',
        dataIndex: 'name',
      }, {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            {(() => {
              const arr = []
              if (!record.isUsed) {
                arr.push(
                  <Popconfirm
                    title="你确定要移除该字段吗？"
                    onConfirm={() => store.delObjFieldRel(record)}
                  ><a className="mr8">移除</a></Popconfirm>
                )
              } else {
                arr.push(<Tooltip title="使用中，不可移除"><span className="mr8 disabled">移除</span></Tooltip>)
              }

              if (!record.isUsed) {
                arr.push(<a className="mr8" onClick={() => {}}>标签配置</a>)
              } else {
                arr.push(<Tooltip title="使用中，不可配置"><span className="mr8 disabled">标签配置</span></Tooltip>)
              }

              return arr
            })()}
          </Fragment>
        ),
      },
    ]
  }

  componentWillReceiveProps(nextProps) {
    if (this.updateKey !== nextProps.updateKey) {
      this.updateKey = nextProps.updateKey
      store.id = nextProps.store.id
      store.isConfigured = ''
      store.keyword = ''
      store.getList()
    }
  }

  @action.bound handleOnCancel() {
    const {store: {modalVisible}} = this.props
    modalVisible.viewRelField = false

    this.updateKey = false
    store.list.clear()
  }

  @action handleSearch(e, type) {
    store[type] = e
    store.pagination.currentPage = 1
    store.getList()
  }

  @action handleChangeKeyword(e) {
    const {value} = e.target
    if (!value) {
      this.handleSearch(value, 'keyword')
    }
  }

  render() {
    const {store: {modalVisible}} = this.props

    const modalProps = {
      title: '已关联字段列表',
      visible: modalVisible.viewRelField,
      maskClosable: false,
      width: 820,
      destroyOnClose: true,
      onClose: this.handleOnCancel,
    }

    return (
      <Drawer {...modalProps}>
        <div>
          <div className="mb16">
            <span className="pl">配置状态: </span>
            <Select
              defaultValue=""
              style={{width: 120}}
              className="mr8"
              onChange={e => this.handleSearch(e, 'isConfigured')}
            >
              <Option value="">全部</Option>
              {
                window.njkData.dict.configureStatus.map(item => (
                  <Option key={item.key} value={item.key}>{item.value}</Option>
                ))
              }
            </Select>
            <Search
              ref={el => this.keywordEl = el}
              placeholder="请输入字段名称"
              onChange={e => this.handleChangeKeyword(e)}
              onSearch={e => this.handleSearch(e, 'keyword')}
              style={{width: 200}}
            />
          </div>
          <Table
            onChange={store.handleChange}
            columns={this.tableCol}
            loading={store.tableLoading}
            dataSource={store.list.slice()}
            pagination={{
              pageSize: store.pagination.pageSize,
              current: store.pagination.currentPage,
              total: store.pagination.count,
              showTotal: () => `合计${store.pagination.count}条记录`,
            }}
          />
        </div>
      </Drawer>
    )
  }
}

export default DrawerRelfield
