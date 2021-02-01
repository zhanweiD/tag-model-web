import intl from 'react-intl-universal'
import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { observable, action, toJS } from 'mobx'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Table, Input, Button, Tooltip } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { getNamePattern } from '../../../common/util'

const EditableContext = React.createContext()
const { Search } = Input

class EditableCell extends Component {
  renderCell = form => {
    const {
      editing,
      dataIndex,
      // title,
      record = {},
      // index,
      children,
      allColumnName,
      ...restProps
    } = this.props

    if (!form) {
      return <td>{children}</td>
    }

    if (dataIndex !== 'columnName') {
      return <td>{children}</td>
    }

    this.form = form

    const text = record.columnName || record.enName

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }} key={record.id}>
            {form.getFieldDecorator(record.id, {
              rules: [
                { transform: value => value && value.trim() },
                ...getNamePattern(),
                {
                  required: true,
                  message: intl
                    .get(
                      'ide.src.page-manage.page-tag-sync.sync-list.drawer-edit-list.zqbz4cv42d'
                    )
                    .d('输入不能为空'),
                },
                {
                  validator: (rule, param, callback) => {
                    if (
                      record.columnName &&
                      record.columnName.trim() === param
                    ) {
                      callback()
                    } else if (allColumnName.includes(param)) {
                      callback(
                        intl
                          .get(
                            'ide.src.page-manage.page-tag-sync.sync-list.drawer-edit-list.ayznvn4x7nj'
                          )
                          .d('目标字段名不能重复')
                      )
                    } else {
                      callback()
                    }
                  },
                },
              ],

              validateFirst: true,
              initialValue: text,
            })(<Input size="small" ref={node => (this.input = node)} />)}
          </Form.Item>
        ) : (
          <span>
            {text.length > 10 ? (
              <Tooltip placement="top" title={text}>{`${text.slice(
                0,
                10
              )}...`}</Tooltip>
            ) : (
              text
            )}
          </span>
        )}
      </td>
    )
  }

  render() {
    return (
      <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
    )
  }
}

// eslint-disable-next-line react/no-multi-comp
@Form.create()
@observer
class SyncTagList extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
    this.state = {
      editKey: '',
    }
  }

  @observable searchKey = undefined

  columns = [
    {
      title: intl
        .get(
          'ide.src.page-manage.page-aim-source.source-detail.main.63kvhqd3cw8'
        )
        .d('标签名称'),
      dataIndex: 'name',
      width: 150,
      render: text =>
        text.length > 8 ? (
          <Tooltip placement="top" title={text}>{`${text.slice(
            0,
            8
          )}...`}</Tooltip>
        ) : (
          text
        ),
    },
    {
      title: intl
        .get('ide.src.business-component.tag-relate.dag-box.xs30zaqk60p')
        .d('标签标识'),
      dataIndex: 'enName',
      width: 150,
      render: text =>
        text.length > 10 ? (
          <Tooltip placement="top" title={text}>{`${text.slice(
            0,
            10
          )}...`}</Tooltip>
        ) : (
          text
        ),
    },
    {
      title: intl
        .get('ide.src.business-component.tag-relate.dag-box.zfaw0a4v7jh')
        .d('数据类型'),
      width: 80,
      dataIndex: 'valueTypeName',
    },
    {
      title: intl
        .get(
          'ide.src.page-manage.page-tag-sync.sync-list.drawer-edit-list.n8qav2egadc'
        )
        .d('目标字段名'),
      dataIndex: 'columnName',
      editable: true,
    },
    {
      title: intl
        .get(
          'ide.src.page-manage.page-tag-sync.sync-list.drawer-edit-list.ulr4ztxvlyf'
        )
        .d('目标表字段数据类型'),
      dataIndex: 'columnType',
      width: 150,
    },
    {
      title: intl
        .get('ide.src.page-common.approval.approved.main.1tcpwa6mu1')
        .d('操作'),
      width: 100,
      dataIndex: 'action',
      render: (text, record) => {
        return (
          <div>
            {this.isEditing(record) ? (
              <EditableContext.Consumer>
                {form => (
                  <a
                    onClick={() => this.handleSave(form, record)}
                    style={{ marginRight: 8 }}
                  >
                    {intl
                      .get(
                        'ide.src.page-manage.page-tag-sync.sync-list.drawer-edit-list.i96ax7trodd'
                      )
                      .d('保存')}
                  </a>
                )}
              </EditableContext.Consumer>
            ) : (
              <a
                href
                disabled={this.state.editKey !== ''}
                onClick={() => this.edit(record)}
              >
                {intl
                  .get('ide.src.component.label-item.label-item.slnqvyqvv7')
                  .d('编辑')}
              </a>
            )}

            {/* <span className="table-action-line" /> */}
            {record.isMajor ? (
              <span className="disabled ml8">
                {intl
                  .get('ide.src.page-config.workspace-config.main.i53j7u2d9hs')
                  .d('移除')}
              </span>
            ) : (
              <a href onClick={() => this.remove(record)} className="ml8">
                {intl
                  .get('ide.src.page-config.workspace-config.main.i53j7u2d9hs')
                  .d('移除')}
              </a>
            )}
          </div>
        )
      },
    },
  ]

  @action.bound onChange(e) {
    const { value } = e.target
    this.searchKey = value
  }

  remove = d => {
    const { remove } = this.props

    if (d.id === this.state.editKey) {
      this.setState({
        editKey: '',
      })
    }

    remove(d)
  }

  removeAll = () => {
    const { removeAll } = this.props

    this.setState({
      editKey: '',
    })

    removeAll(Math.random())
  }

  @action.bound edit(data) {
    this.setState({
      editKey: data.id,
    })
  }

  getFilterData() {
    const { tableData } = this.store

    if (this.searchKey) {
      return tableData.filter(d => d.name.indexOf(this.searchKey) !== -1)
    }
    return tableData.slice()
  }

  @action.bound handleSave(form, record) {
    const { tableData } = this.store

    form.validateFields((error, values) => {
      if (error) {
        return
      }

      const data = { ...record, columnName: values[record.id] }

      const arr = toJS(tableData).map(d => {
        if (d.id === data.id) {
          return {
            ...d,
            columnName: data.columnName,
          }
        }
        return d
      })
      this.store.tableData.replace(arr)
      this.setState({
        editKey: '',
      })
    })
  }

  @action.bound isEditing = record => {
    return record.id === +this.state.editKey
  }

  componentWillUnmount() {
    this.store.tableData.clear()
  }

  render() {
    const { form } = this.props
    const { tableData } = this.store
    const allColumnName = tableData.map(d => d.columnName)

    const editableColumns = this.columns.map(col => {
      if (!col.editable) {
        return col
      }

      return {
        ...col,
        onCell: record => ({
          record,
          allColumnName,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
          editing: this.isEditing(record),
        }),
      }
    })
    const listConfig = {
      components: {
        body: {
          cell: EditableCell,
        },
      },

      dataSource: this.getFilterData(),
      rowKey: 'id',
      columns: editableColumns,
      pagination: false,
      scroll: { y: 'calc(100% - 98)' },
    }

    return (
      <div className="FB1 sync-tag-list pl24 pr24 pt16 pb16">
        {/* <Search
           placeholder="请输入标签名称关键字"
           onChange={this.onChange}
           style={{width: 300}}
           className="select-tag-search"
          /> */}
        <div className="df-js mb8">
          <Input
            onChange={this.onChange}
            style={{ width: 300 }}
            size="small"
            // className="select-tag-search"
            placeholder={intl
              .get(
                'ide.src.page-manage.page-object-model.object-list.object-detail.tag-list.ncn8t6qj01d'
              )
              .d('请输入标签名称关键字')}
            suffix={<SearchOutlined />}
          />

          <Button
            type="primary"
            onClick={this.removeAll}
            // className="clear-btn"
            disabled={!this.store.tableData.length}
          >
            {intl
              .get(
                'ide.src.page-manage.page-tag-sync.sync-list.drawer-edit-list.7gij9ot1mnl'
              )
              .d('全部清空')}
          </Button>
        </div>
        <EditableContext.Provider value={form}>
          <Table {...listConfig} />
        </EditableContext.Provider>
      </div>
    )
  }
}
export default SyncTagList
