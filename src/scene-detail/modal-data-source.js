import {Component} from 'react'
import {observer} from 'mobx-react'
import {
  observable, action, toJS,
} from 'mobx'
import {
  Modal, Table, Alert, Select, Tooltip, Icon, Form, Button,
} from 'antd'

const {Option} = Select
const FormItem = Form.Item

@Form.create()
@observer
class ModalDataSource extends Component {
  @observable dbTableValue = undefined
  @observable dbSourceValue = undefined
  isFieldRepeat = false

  columns = [{
    title: '所属对象',
    dataIndex: 'objTypeName',
  }, {
    title: '对象名称',
    dataIndex: 'objName',
  }, {
    title: '所属类目',
    dataIndex: 'catName',
  }, {
    title: '标签中文名',
    dataIndex: 'tagName',
  }, {
    title: '标签英文名',
    dataIndex: 'tagEnName',
  }, {
    title: '目的字段',
    dataIndex: 'fileds',
    render: (text, record, index) => {
      const {form: {getFieldDecorator}} = this.props

      return (
        <FormItem className="mb0">
          {getFieldDecorator(record.tagId, {
            initialValue: record.fileds.filter(d => d.name === record.tagEnName).length ? record.tagEnName : undefined,
            rules: [{
              required: true, message: '目的字段不能为空',
            },
            {
              validator: this.handleValidator,
            },
            ],
          })(
            <Select style={{width: 120}} onChange={e => this.onFieldChange(e, `fileds_${index}`)}>
              {record.fileds.map(({name}) => <Option value={name} key={name}>{name}</Option>)}
            </Select>
          )}
        </FormItem>
      )
    },
  }]

  @action handleSubmit(e) {
    const {form: {validateFields, getFieldsError}, store} = this.props

    e.preventDefault()

    const errorArr = Object.values(getFieldsError()) 

    if (errorArr.filter(item => item).length) {
      return
    }
    
    validateFields((err, value) => {
      if (err) {
        return
      }
      const params = {
        storageId: this.dbSourceValue,
        tableName: this.dbTableValue,
        save: value,
      }

      store.saveStorage(params, () => {
        this.reset()
      })
    })
  }

  // 目的字段查重校验
   @action.bound handleValidator = (rule, value = '', callback) => {
     if (value && this.isFieldRepeat) {
       callback('目的字段不能重复选择')
     } else {
       callback()
     }
   }

  
  @action onFieldChange(value) {
     const {form: {getFieldsValue}} = this.props
     const fieldArr = Object.values(getFieldsValue())
     this.isFieldRepeat = fieldArr.includes(value)
   }

  @action.bound handleCancel() {
    const {store} = this.props
    store.dbSourceVisible = false
    this.reset()
  }

  // 数据源下拉框
  @action.bound onSourceChange(value) {
    const {store} = this.props
    this.dbSourceValue = value
    this.dbTableValue = undefined
    store.getDbTableList(value)
  }

  // 数据表下拉框
  @action.bound onTableChange(value) {
    const {store} = this.props
    this.dbTableValue = value

    const params = {
      storageId: this.dbSourceValue,
      tableName: value,
    }

    store.getDBSourceList(params)
  }

  // 重置
  @action.bound reset() {
    const {store: {dbSourceData, dbTable}} = this.props
    this.dbTableValue = ''
    this.dbSourceValue = ''
    this.isFieldRepeat = false
    
    // 清空表格数据
    dbSourceData.data.clear()
    // 清空数据表下拉框数据
    dbTable.clear()
  }

  render() {
    const {
      store: {
        dbSourceVisible, 
        dbSource,
        dbTable,
        dbSourceData,
      },
    } = this.props

    return (
      <Modal
        width={800}
        title="添加目的数据源"
        destroyOnClose
        maskClosable={false}
        visible={dbSourceVisible}
        onCancel={this.handleCancel}
        footer={[
          <Button onClick={this.handleCancel}>取消</Button>,
          <Button type="primary" onClick={e => this.handleSubmit(e)} disabled={!this.dbTableValue || !this.dbSourceValue}>确定</Button>,
        ]}
      >
        <div>
          <Alert message="为了让标签通过API的方式输出，需要将标签映射至API所对应的目的数据源、目的数据表、目的字段" type="info" showIcon className="mb24" />
          <div className="FBH mb32">
            <div className="FB1">
              <span className="mr8">目的数据源</span>
              <Select style={{width: 150}} placeholder="请选择" onChange={this.onSourceChange}>
                {
                  toJS(dbSource).map(({value, label, children}) => <Option value={value} key={value} dbtable={children}>{label}</Option>)
                }
              </Select>
              <Tooltip title="可以去“数据源管理”模块，添加并授权想要的数据源">
                {/* 点击“没有要选择的数据源”，页面跳转至“数据源管理” */}
                <a href="" className="ml16">没有要选择的数据源？</a>
              </Tooltip>
            </div>
            <div className="FB1">
              <span className="mr8">
                  目的数据表
                <Tooltip title="该场景中已选择的目的数据表，不能被再次选择">
                  <Icon type="question-circle" className="ml4" />
                </Tooltip>

              </span>
              <Select value={this.dbTableValue} style={{width: 150}} placeholder="请选择" onChange={this.onTableChange}>
                {
                  toJS(dbTable).map(({value, label, used}) => <Option value={label} key={value} disabled={used}>{label}</Option>)
                }
              </Select>
              <Tooltip title="可以去“离线开发中心”，添加一个项目，加工出想要的同步表">
                {/* 点击“没有要选择的数据表”，页面跳转至离线开发中心的项目列表 */}
                <a href="" className="ml16">没有要选择的数据表？</a>                
              </Tooltip>
            </div>
          </div>
          <Table 
            loading={dbSourceData.loading}
            pagination={false}
            columns={this.columns} 
            dataSource={dbSourceData.data.slice()} 
          />
        </div>
      </Modal>
    )
  }
}

export default ModalDataSource
