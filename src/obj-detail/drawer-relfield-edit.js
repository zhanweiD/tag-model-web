import {Component} from 'react'
import {observer} from 'mobx-react'
import {action, observable, toJS} from 'mobx'
import {Form, Button, Drawer, Spin, Select, Table, Tooltip, Icon} from 'antd'
import store from './store-obj-detail'

const FormItem = Form.Item
const {Option} = Select

@observer
class DrawerRelfieldEdit extends Component {
  @observable stdlist = []
  @observable dataStorageId = undefined
  @observable dataTableName = undefined

  constructor(props) {
    super(props)
    this.tableCol = [
      {
        title: '字段',
        key: 'dataFieldName',
        dataIndex: 'dataFieldName',
      }, {
        title: '字段类型',
        key: 'dataFieldType',
        dataIndex: 'dataFieldType',
        width: 150,
      }, {
        title: '数据源',
        key: 'dataDbName',
        dataIndex: 'dataDbName',
        width: 150,
      }, {
        title: '数据表',
        key: 'dataTableName',
        dataIndex: 'dataTableName',
      }, {
        title: '操作',
        render: (text, record) => {
          if (record.mappingKey === record.dataFieldName) {
            return <Tooltip title="关联的主键，不可以移除"><span className="mr8 disabled">移除</span></Tooltip>
          }
          return <a onClick={() => this.removeItem(record)}>移除</a>
        },
      },
    ]
  }

  componentWillReceiveProps(nextProps) {
  }

  componentDidMount() {
  }

  @action.bound handleOnCancel() {
    const {form} = this.props
    store.modalVisible.editRelField = false
    store.dacList.clear()
    store.tableList.clear()
    store.fieldList.clear()

    this.stdlist.clear()
    form.resetFields()
  }

  @action.bound handleOnOk() {
    const {form} = this.props
    const {validateFields} = form
    // const {eStatus: {editCategory}, cateDetail, currentTreeItemKey} = this.store
    // const {typeCode} = this.bigStore

    const getFieldObj = item =>  store.fieldList.find(o => o.field === item)

    validateFields((err, values) => {
      if (!err) {
        const obj = store.dacList.find(item => item.dataStorageId === values.dataStorageId)
        const mapKeyObj = getFieldObj(values.mappingKey)
        let arr = values.dataFieldName.map(item => store.fieldList.find(o => o.field === item))
        arr = arr.map(item => ({
          dataStorageId: values.dataStorageId,
          dataTableName: values.dataTableName,
          dataFieldName: item.field,
          dataFieldType: item.type,
          mappingKey: mapKeyObj.field,
          mappingKeyType: mapKeyObj.type,
          ...obj,
        }))
        this.stdlist.map(item => {
          if (item.dataStorageId === values.dataStorageId && item.dataTableName === values.dataTableName) {
            item.mappingKey = mapKeyObj.field
            item.mappingKeyType = mapKeyObj.type
          }
        })
        this.stdlist.push(...arr)
        console.log(this.stdlist.slice())

        form.resetFields()
      }
    })
  }

  @action removeItem(item) {
    this.stdlist.remove(item)
  }

  @action changeStorageId(e) {
    this.dataStorageId = e

    const {form} = this.props
    store.getTableList(this.dataStorageId)
    form.setFields({
      dataTableName: {
        value: undefined,
        errors: null,
      },
      dataFieldName: {
        value: undefined,
        errors: null,
      },
    })
  }

  @action changeTableName(e) {
    this.dataTableName = e

    const {form} = this.props
    store.getFieldList(this.dataStorageId, this.dataTableName)
    form.setFields({
      dataFieldName: {
        value: undefined,
        errors: null,
      },
    })
  }

  render() {
    const {form: {getFieldDecorator}} = this.props
    const {modalVisible, dacList, tableList, fieldList} = store

    const modalProps = {
      title: '编辑关联字段',
      visible: modalVisible.editRelField,
      maskClosable: false,
      width: 520,
      destroyOnClose: true,
    }

    const formItemLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 20},
      colon: false,
    }

    return (
      <Drawer {...modalProps}>
        <Form>
          <Spin spinning={store.drawerLoading}>
            <FormItem
              {...formItemLayout} 
              label={(
                <span>
                  数据源 &nbsp;
                  <Tooltip title="在数据源管理被授权，且在元数据中被采集进来的数据源">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              )}
            >
              {getFieldDecorator('dataStorageId', {
                initialValue: undefined,
                rules: [
                  {required: true, message: '数据源不可为空'},
                ],
              })(
                <Select
                  showSearch
                  placeholder="请下拉选择"
                  onChange={e => this.changeStorageId(e)}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {
                    dacList.map(item => (
                      <Option key={item.dataStorageId} value={item.dataStorageId}>{item.dataDbName}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout} 
              label={(
                <span>
                  数据表 &nbsp;
                  <Tooltip title="同一个数据源下的数据表不能被重复选择">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              )}
            >
              {getFieldDecorator('dataTableName', {
                initialValue: undefined,
                rules: [
                  {required: true, message: '数据表不可为空'},
                ],
              })(
                <Select
                  showSearch
                  placeholder="请下拉选择"
                  onChange={e => this.changeTableName(e)}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {
                    tableList.map(item => (
                      <Option key={item.tableName} value={item.tableName} disabled={item.isUsed}>{item.tableName}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="字段">
              {getFieldDecorator('dataFieldName', {
                initialValue: undefined,
                rules: [
                  {required: true, message: '字段不可为空'},
                ],
              })(
                <Select
                  mode="tags"
                  placeholder="请下拉选择"
                  tokenSeparators={[',']}
                >
                  {
                    fieldList.map(item => (
                      <Option key={item.field} value={item.field}>{item.field}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="关联的主键">
              {getFieldDecorator('mappingKey', {
                initialValue: undefined,
                rules: [
                  {required: true, message: '关联的主键不可为空'},
                ],
              })(
                <Select
                  showSearch
                  placeholder="请下拉选择"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {
                    fieldList.map(item => (
                      <Option key={item.field} value={item.field}>{item.field}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          </Spin>
        </Form>

        <div className="far mb8">
          <Button onClick={this.handleOnOk} type="primary">
            添加
          </Button>
        </div>
        
        <div className="scroll-table">
          <Table
            columns={this.tableCol}
            loading={false}
            dataSource={this.stdlist.slice()}
            pagination={false}
            scroll={{y: '90%' }}
          />
        </div>

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
            borderRadius: '0 0 4px 4px',
          }}
        >
          <Button
            className="mr8"
            onClick={this.handleOnCancel}
          >
            取消
          </Button>
          <Button
            type="primary"
            disabled={!this.stdlist.length}
            onClick={() => {
              store.addRelField(this.stdlist.slice(), () => {
                this.handleOnCancel()
              })
            }}
          >确定</Button>
        </div>
      </Drawer>
    )
  }
}

// export default DrawerRelfieldEdit
export default Form.create()(DrawerRelfieldEdit)
