import {Component, Fragment} from 'react'
import {observer} from 'mobx-react'
import {action, observable, toJS} from 'mobx'
import {Form, Button, Drawer, Spin, Select, Table, Tooltip, Icon, Popconfirm, Badge} from 'antd'
import store from './store-obj-detail'
import QuestionTooltip from '../component-question-tooltip'

const FormItem = Form.Item
const {Option} = Select

@observer
class DrawerRelfieldEdit extends Component {
  @observable updateKey = false
  @observable stdlist = []

  constructor(props) {
    super(props)
    this.tableCol = [
      {
        title: '字段',
        key: 'dataFieldName',
        dataIndex: 'dataFieldName',
      }, {
        title: '是否主键',
        key: 'isMajorKey',
        dataIndex: 'isMajorKey',
        render: text => <span>{text ? '是' : '否'}</span>,
      }, {
        title: '字段类型',
        key: 'dataFieldType',
        dataIndex: 'dataFieldType',
        width: 150,
      }, {
        title: (
          <span>
            使用状态
            <QuestionTooltip tip="字段绑定的标签是否被使用" />
          </span>
        ),
        key: 'isUsed',
        dataIndex: 'isUsed',
        render: v => (
          +v === 1
            ? <Badge color="#1890FF" text="使用中" />
            : <Badge color="rgba(0,0,0,0.25)" text="未使用" />
        ),
      }, {
        title: (
          <span>
            操作
            <QuestionTooltip tip="若字段绑定的标签已被使用，或者该字段为主键，则不能被移除" placement="topRight" />
          </span>
        ),
        render: (text, record) => {
          const {isMajorKey, isUsed} = record
          if (isMajorKey || isUsed) {
            let str = ''
            if (isMajorKey) str = '关联的主键，不可以移除'
            if (isUsed) str = '使用中，不可以移除'
            return <Tooltip title={str}><span className="mr8 disabled">移除</span></Tooltip>
          }
          return (
            <Popconfirm
              title="你确定要移除该字段吗？"
              onConfirm={() => this.removeItem(record)}
            ><a className="mr8">移除</a></Popconfirm>
          )
        },
      },
    ]
  }

  componentWillReceiveProps(nextProps) {
    if (this.updateKey !== nextProps.updateKey) {
      this.updateKey = nextProps.updateKey
      this.stdlist.replace(nextProps.defStdlist)
    }
  }

  @action.bound handleOnCancel() {
    const {form} = this.props
    store.modalVisible.editRelField = false

    this.updateKey = false
    this.stdlist.clear()
    form.resetFields()
  }

  @action.bound handleOnOk() {
    const {form} = this.props
    const {validateFields} = form

    validateFields((err, values) => {
      if (!err) {
        const tempStdlist = toJS(this.stdlist)
        const arr = values.dataFieldName.map(item => store.fieldList.find(o => o.field === item))
        arr.forEach(item => {
          // 去重处理
          if (!tempStdlist.find(o => o.dataFieldName === item.field)) {
            tempStdlist.push({
              dataFieldName: item.field,
              dataFieldType: item.type,
              isUsed: 0,
            })
          }
        })

        this.stdlist.replace(tempStdlist)

        form.resetFields()
      }
    })
  }

  @action removeItem(o) {
    this.stdlist.forEach(item => {
      if (item.dataFieldName === o.dataFieldName) {
        this.stdlist.remove(item)
      }
    })
  }

  @action getBaseParam() {
    const {
      curentItem: {
        dataStorageId, dataDbName, dataDbType, dataTableName,
      },
    } = this.props
    const param = {
      objId: store.id,
      dataStorageId,
      dataDbName,
      dataDbType,
      dataTableName,
    }
    const o = this.stdlist.map(item => ({
      dataFieldName: item.dataFieldName,
      dataFieldType: item.dataFieldType,
    }))

    if (store.baseInfo.objTypeCode === 3) {
      param.filedObjAssReqList = o
    } else {
      param.filedObjReqList = o
    }

    return param
  }

  render() {
    const {form: {getFieldDecorator}, curentItem} = this.props
    const {modalVisible, fieldList} = store
    if (!curentItem) return false

    const modalProps = {
      title: '编辑关联字段',
      visible: modalVisible.editRelField,
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

    return (
      <Drawer {...modalProps}>
        <Form>
          <Spin spinning={store.drawerLoading}>
            <FormItem {...formItemLayout} label="数据源">
              <span className="ant-form-text">{curentItem.dataStorageName}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="数据表">
              <span className="ant-form-text">{curentItem.dataTableName}</span>
            </FormItem>
            
            <FormItem {...formItemLayout} label="添加新的关联字段">
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
                      <Option key={item.field} value={item.field} disabled={item.disabled}>{item.field}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          </Spin>
        </Form>

        <div className="far mb16">
          <Button onClick={this.handleOnOk} type="primary">
            添加
          </Button>
        </div>
        
        <div style={{marginBottom: '28px'}}>
          <h3>已关联字段列表</h3>
          <Table
            columns={this.tableCol}
            loading={store.relDbFieldLoading}
            dataSource={toJS(this.stdlist)}
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
              store.updateRelField(this.getBaseParam(), () => {
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
