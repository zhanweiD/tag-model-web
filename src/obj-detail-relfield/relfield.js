import {Component, Fragment} from 'react'
import {observer, inject} from 'mobx-react'
import {action, observable, toJS} from 'mobx'
import {Drawer, Select, Table, Tooltip, Popconfirm, Input} from 'antd'
import store from './store-relfield'
import ModalTagEdit from '../tag-configuration/modal-tag-edit'

const {Option} = Select
const {Search} = Input

@inject('bigStore')
@observer
class DrawerRelfield extends Component {
  @observable updateKey = false
  // 标签配置
  @observable tagModalVisible = false
  @observable editingTagIndex = -1

  constructor(props) {
    super(props)
    store.id = this.props.store.id

    this.tableCol = [
      {
        title: '字段名称',
        key: 'dataFieldName',
        dataIndex: 'dataFieldName',
      }, {
        title: '是否主键',
        key: 'isMajorKey',
        dataIndex: 'isMajorKey',
        render: text => <span>{text ? '是' : '否'}</span>,
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
        title: '标签名称',
        key: 'name',
        dataIndex: 'name',
      }, {
        title: '操作',
        render: (text, record, index) => (
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
                arr.push(<a className="mr8" onClick={() => this.showEditModal(index, record)}>标签配置</a>)
              } else {
                arr.push(
                  <Tooltip title="使用中，不可配置">
                    <span className="mr8 disabled">标签配置</span>
                  </Tooltip>
                )
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


  // 展开编辑弹框
  @action.bound showEditModal(index, record) {
    this.tagModalVisible = true
    this.editingTagIndex = index
    store.getCanMoveTree(this.props.bigStore.id)
  }

  // 关闭编辑弹框
  @action.bound closeEditModal() {
    this.tagModalVisible = false
  }

  // 编辑标签确定事件
  @action.bound handleTagEditConfirm(values, cb) {
    const index = this.editingTagIndex

    // 先不直接修改原列表数据，创建个副本拿去请求校验接口
    const tagListCopy = [...toJS(store.list)]

    // values的副本
    const valuesCopy = {}

    // 将undefined的值改成空字符串
    Object.keys(values).forEach(key => {
      valuesCopy[key] = values[key] === undefined ? '' : values[key]
    })

    // 要更新parentId字段（对应当前所属类目的id）
    const {pathIds} = valuesCopy
    valuesCopy.pathIds = pathIds || [] // 貌似不能传空字符串
    valuesCopy.parentId = pathIds[pathIds.length - 1] || store.defaultCateId // 没有就取默认类目id

    // 替换掉编辑后的标签
    // （这里已知标签编辑弹框的表单fieldName和标签对象的字段一一对应，所以可以直接覆盖）
    tagListCopy[index] = {...tagListCopy[index], ...valuesCopy}

    console.log('secondTableList.length', store.list.length, 'tagListCopy', tagListCopy)

    store.saveTags(tagListCopy, () => {
      cb && cb()
      this.props.bigStore.categoryStore.getCategoryList()
      this.closeEditModal()
    })
  }

  @action loop(data) {
    return data.map(item => {
      item.label = item.name
      item.value = item.id
      if (item.children && item.children.length) this.loop(item.children)
      return item
    })
  }

  render() {
    const {store: {modalVisible}} = this.props
    const {tagModalVisible, editingTagIndex} = this

    const modalProps = {
      title: '已关联字段列表',
      visible: modalVisible.viewRelField,
      maskClosable: false,
      width: 1020,
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
          {
            tagModalVisible && (
              <ModalTagEdit
                tagDetail={toJS(store.list[editingTagIndex] || {})} // 传进去时toJS一下
                visible={tagModalVisible}
                onCancel={this.closeEditModal}
                onOk={this.handleTagEditConfirm}
                cateList={this.loop(toJS(store.moveTreeData))}
              />
            )
          }
        </div>
      </Drawer>
    )
  }
}

export default DrawerRelfield
