import {Component, Fragment} from 'react'
import {observer} from 'mobx-react'
import {action, observable, toJS} from 'mobx'
import {Form, Button, Drawer, Spin, Select, Table, Tooltip, Icon, Popconfirm} from 'antd'
import QuestionTooltip from '../component-question-tooltip'
import store from './store-obj-detail'

const FormItem = Form.Item
const {Option} = Select

@observer
class DrawerRelfieldAdd extends Component {
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
          return (
            <Popconfirm
              title="你确定要移除该字段吗？"
              onConfirm={() => this.removeItem(record)}
            ><a>移除</a></Popconfirm>
          )
        },
      },
    ]
  }

  @action.bound handleOnCancel() {
    const {form} = this.props
    store.modalVisible.addRelField = false
    store.dacList.clear()
    store.tableList.clear()
    store.fieldList.clear()

    this.stdlist.clear()
    this.dataStorageId = undefined
    this.dataTableName = undefined
    form.resetFields()
  }

  @action.bound handleOnOk() {
    const {form} = this.props
    const {validateFields} = form
    const getFieldObj = item => store.fieldList.find(o => o.field === item)

    validateFields((err, values) => {
      if (!err) {
        let arr = values.dataFieldName.map(item => store.fieldList.find(o => o.field === item))
        // 数据源相关参数
        const storageObj = toJS(store.dacList).find(item => item.dataStorageId === values.dataStorageId)

        if (store.baseInfo.objTypeCode === 3) {
          const timeObj = values.timeKey && getFieldObj(values.timeKey)
          const addrObj = values.addrKey && getFieldObj(values.addrKey)

          const mappingKeys = toJS(store.baseInfo).objRspList.map(item => {
            const o = getFieldObj(values[item.id])
            return ({
              obj_id: item.id,
              filed_name: o.field,
              file_type: o.type,
            })
          })

          arr = arr.map(item => {
            const o = {
              dataStorageId: values.dataStorageId,
              dataTableName: values.dataTableName,
              dataFieldName: item.field,
              dataFieldType: item.type,
              mappingKeys: JSON.stringify(mappingKeys),
              ...storageObj,
            }
            if (timeObj) {
              o.dataTimeName = timeObj.field
              o.dataTimeType = timeObj.type
            }
            if (addrObj) {
              o.dataAddrName = addrObj.field
              o.dataAddrType = addrObj.type
            }
            return o
          })

          // 关联的主键唯一性，覆盖
          this.stdlist.forEach(item => {
            if (item.dataStorageId === values.dataStorageId && item.dataTableName === values.dataTableName) {
              if (timeObj) {
                item.dataTimeName = timeObj.field
                item.dataTimeType = timeObj.type
              }
              if (addrObj) {
                item.dataAddrName = addrObj.field
                item.dataAddrType = addrObj.type
              }
              item.mappingKeys = JSON.stringify(mappingKeys)
            }
          })
        } else {
          const mapKeyObj = getFieldObj(values.mappingKey)

          arr = arr.map(item => ({
            dataStorageId: values.dataStorageId,
            dataTableName: values.dataTableName,
            dataFieldName: item.field,
            dataFieldType: item.type,
            mappingKey: mapKeyObj.field,
            mappingKeyType: mapKeyObj.type,
            ...storageObj,
          }))

          // 关联的主键唯一性，覆盖
          this.stdlist.forEach(item => {
            if (item.dataStorageId === values.dataStorageId && item.dataTableName === values.dataTableName) {
              item.mappingKey = mapKeyObj.field
              item.mappingKeyType = mapKeyObj.type
            }
          })
        }
        
        this.stdlist.push(...arr)
        form.resetFields()
        // console.log(this.stdlist.slice())
      }
    })
  }

  @action removeItem(item) {
    this.stdlist.remove(item)
  }


  @action getFields() {
    const fields = {}
    if (store.baseInfo.objTypeCode === 3) {
      _.map(toJS(store.baseInfo).objRspList, 'id').concat(['timeKey', 'addrKey']).map(item => {
        fields[item] = {
          value: undefined,
          errors: null,
        }
      })
    } else {
      fields.mappingKey = {
        value: undefined,
        errors: null,
      }
    }
    return fields
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
      ...this.getFields(),
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
      ...this.getFields(),
    })
  }

  renderItemDom(getFieldDecorator, formItemLayout, fieldList, fieldListLoading) {
    if (store.baseInfo.objTypeCode === 3) {
      const objSelect = toJS(store.baseInfo).objRspList.map(item => (
        <FormItem
          {...formItemLayout}
          label={(
            <span
              className="omit"
              title={`${item.name}主键`}
              style={{width: '115px', height: '16px', lineHeight: '16px', display: 'inline-block',}}
            >
              {`${item.name}主键`}
            </span>
          )}
        >
          {getFieldDecorator(`${item.id}`, {
            initialValue: undefined,
            rules: [
              {required: true, message: `${item.name}主键不可为空`},
            ],
          })(
            <Select
              showSearch
              placeholder="请下拉选择"
              loading={fieldListLoading}
              notFoundContent={null}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {
                fieldList.map(o => (
                  <Option key={o.field} value={o.field}>{o.field}</Option>
                ))
              }
            </Select>
          )}
        </FormItem>
      ))

      return (
        <Fragment>
          {objSelect}
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                关系时间主键
                <QuestionTooltip tip="发生这个关系的时间字段" />
              </span>
            )}
          >
            {getFieldDecorator('timeKey', {
              initialValue: undefined,
              rules: [],
            })(
              <Select
                showSearch
                placeholder="请下拉选择"
                loading={fieldListLoading}
                notFoundContent={null}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {
                  fieldList.map(o => (
                    <Option key={o.field} value={o.field}>{o.field}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={(
              <span>
                关系地点主键
                <QuestionTooltip tip="发生这个关系的地点字段" />
              </span>
            )}
          >
            {getFieldDecorator('addrKey', {
              initialValue: undefined,
              rules: [],
            })(
              <Select
                showSearch
                placeholder="请下拉选择"
                loading={fieldListLoading}
                notFoundContent={null}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {
                  fieldList.map(o => (
                    <Option key={o.field} value={o.field}>{o.field}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
        </Fragment>
      )
    }

    return (
      <Fragment>
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
              loading={fieldListLoading}
              notFoundContent={null}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {
                fieldList.map(o => (
                  <Option key={o.field} value={o.field}>{o.field}</Option>
                ))
              }
            </Select>
          )}
        </FormItem>
      </Fragment>
    )
  }

  render() {
    const {form: {getFieldDecorator}} = this.props
    const {
      modalVisible, dacList, tableList, fieldList, tableListLoading, fieldListLoading,
    } = store

    const modalProps = {
      title: '添加关联字段',
      visible: modalVisible.addRelField,
      maskClosable: false,
      width: 560,
      destroyOnClose: true,
      onClose: this.handleOnCancel,
    }

    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 18},
      colon: false,
    }
    console.log('xxxx')
    console.log(!tableList.length)

    return (
      <Drawer {...modalProps}>
        <Form>
          <Spin spinning={store.drawerLoading}>
            <FormItem
              {...formItemLayout} 
              label={(
                <span>
                  数据源
                  <QuestionTooltip tip="在数据源管理被授权，且在元数据中被采集进来的数据源" />
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
                  数据表
                  <QuestionTooltip tip="同一个数据源下的数据表不能被重复选择" />
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
                  loading={tableListLoading}
                  notFoundContent={null}
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
                  loading={fieldListLoading}
                  notFoundContent={null}
                  tokenSeparators={[',']}
                >
                  {
                    fieldList.map(o => (
                      <Option key={o.field} value={o.field}>{o.field}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>

            {this.renderItemDom(getFieldDecorator, formItemLayout, fieldList, fieldListLoading)}
          </Spin>
        </Form>

        <div className="far mb8">
          <Button onClick={this.handleOnOk} type="primary">
            添加
          </Button>
        </div>

        <div style={{marginBottom: '28px'}}>
          <Table
            columns={this.tableCol}
            loading={false}
            dataSource={this.stdlist.slice()}
            pagination={false}
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

export default Form.create()(DrawerRelfieldAdd)
