/**
 * @description 添加同步计划 - 基础信息配置
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {Form} from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import {Input, Select, Button, Switch} from 'antd'
import {ModalStotageDetail} from '../../../component'
import {debounce} from '../../../common/util'

const FormItem = Form.Item
const Option = {Select}
const {TextArea} = Input

const formItemLayout = {
  labelCol: {span: 7},
  wrapperCol: {span: 12},
  colon: false,
}

@Form.create()
@observer
export default class StepOne extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }


  componentWillMount() {
    this.store.getObjList()
    this.store.getStorageType()
  }

  @action.bound selectObj(obj) {
    const {form: {resetFields}} = this.props
    
    this.store.objId = obj.key
    this.store.storageId = undefined
    
    resetFields(['dataStorageId'])

    if (this.store.storageType) {
      this.store.getStorageList({
        storageType: this.store.storageType,
        objId: obj.key,
      })
    }
  } 

  @action.bound selecStorageType(obj) {
    const {form: {resetFields, getFieldValue}} = this.props
    this.store.storageType = obj.key
    
    this.store.storageId = undefined

    this.store.storageList.clear()
    resetFields(['dataStorageId'])

    if (getFieldValue('objId')) {
      this.store.getStorageList({
        storageType: obj.key,
        objId: this.store.objId,
      })
    }
  } 

  @action.bound selecStorage(obj) {
    const {form: {setFieldsValue}} = this.props

    setFieldsValue({
      dataStorageId: obj,
    })
    this.store.storageId = obj.key
    this.store.storageName = this.getStoragName(obj.key)
  } 

  getStoragName = storageId => {
    const {storageList} = this.store
    const obj = storageList.filter(d => d.storageId === storageId)[0] || {}
    return obj.storageName
  }

  @action handleSubmit = e => {
    const {
      form: {
        validateFieldsAndScroll,
      },
    } = this.props
    
    const t = this

    validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      } 

      t.store.previewData = values
      t.nextStep()
    })
  }

  // 查看数据源
  @action.bound viewStorage() {
    this.store.getStorageDetail({
      dataStorageId: this.store.storageId,
    })
    this.store.storageVisible = true
  }

  @action.bound closeStorageDetail() {
    this.store.storageVisible = false
  }

  // 重名校验
  checkName = (rule, value, callback) => {
    const params = {
      name: value,
    }

    // this.store.checkName(params, callback)
    debounce(() => this.store.checkName(params, callback), 500)
  }
  
  // 重名校验
  changeTableName = (rule, value, callback) => {
    // console.log(this.store.storageId)
    const params = {
      storageId: this.store.storageId,
      tableName: `tbjh_${value}`,
    }
    debounce(() => this.store.checkTableName(params, callback), 500)
    // this.store.checkTableName(params, callback)
  }

  @action.bound nextStep() {
    const tagTreeParams = {
      objId: this.store.objId,
      storageId: this.store.storageId,
    }
    this.store.getTagTree(tagTreeParams)
    this.store.nextStep()
  }

  render() {
    const {
      form: {
        getFieldDecorator,
        getFieldValue,
      },
      show,
      closeDrawer,
    } = this.props

    const {
      objList,
      storageTypeList,
      storageList,
      storageDetailLoading,
      storageDetail,
      storageVisible,
    } = this.store

    return (
      <div style={{display: show ? 'block' : 'none'}}>
        <Form>
          <FormItem {...formItemLayout} label="计划名称">
            {getFieldDecorator('name', {
              rules: [
                {transform: value => value && value.trim()},
                {required: true, message: '计划名称不能为空'},  
                {max: 32, message: '输入不能超过32个字符'},
                {
                  validator: this.checkName,
                }],
              validateFirst: true,
            })(
              <Input size="small" autoComplete="off" placeholder="请输入计划名称" />
            )}
          </FormItem>
       
          <FormItem {...formItemLayout} label="同步对象">
            {getFieldDecorator('objId', {
              rules: [{required: true, message: '请选择同步对象'}],
            })(
              <Select 
                showSearch
                labelInValue 
                placeholder="请选择所属对象" 
                style={{width: '100%'}} 
                onSelect={v => this.selectObj(v)}
                optionFilterProp="children"
              >
                {
                  objList.map(item => (
                    <Option key={item.value} value={item.value}>{item.name}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="方案描述">
            {getFieldDecorator('descr', {
              rules: [
                {transform: value => value && value.trim()},
                {max: 128, whitespace: true, message: '输入不能超过128个字符'},
              ],
            })(
              <TextArea placeholder="请输入方案描述" />
            )}
          </FormItem>
          <h3 className="mb24 fs14" style={{marginLeft: '200px'}}>目的源信息</h3>
          <FormItem {...formItemLayout} label="数据源类型">
            {getFieldDecorator('dataDbType', {
              rules: [{required: true, message: '请选择数据源类型'}],
            })(
              <Select 
                showSearch
                labelInValue 
                placeholder="请选择数据源类型" 
                style={{width: '100%'}} 
                onSelect={v => this.selecStorageType(v)}
                optionFilterProp="children"
                getPopupContainer={triggerNode => triggerNode.parentElement}
              >
                {
                  storageTypeList.map(item => (
                    <Option key={item.value} value={item.value}>{item.name}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
          <FormItem 
            {...formItemLayout} 
            label="目的源"
            // extra={(
            //   <span>
            //   若无可用的数据源，请先
            //     <a target="_blank" rel="noopener noreferrer" href={`/tag-model/index.html#/project/${this.store.projectId}`}>去项目配置中添加目的数据源</a>
            //   </span>
            // )}
          >
            {getFieldDecorator('dataStorageId', {
              rules: [{required: true, message: '请选择目的源'}],
            })(
              <div className="select-storage">
                <Select 
                  showSearch
                  labelInValue 
                  value={this.store.storageId ? {key: this.store.storageId} : undefined}
                  placeholder="请选择目的源" 
                  style={{width: '100%'}} 
                  onSelect={v => this.selecStorage(v)}
                  optionFilterProp="children"
                  getPopupContainer={triggerNode => triggerNode.parentElement}
                >
                  {
                    storageList.map(item => (
                      <Option key={item.storageId} value={item.storageId} disabled={item.isUsed}>{item.storageName}</Option>
                    ))
                  }
                </Select>
                {
                  getFieldValue('dataStorageId') ? <a href className="view-storage" onClick={() => this.viewStorage()}>查看数据源</a> : null
                }
             
              </div>
              
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="自定义目的表">
            {getFieldDecorator('isDefineTable', {
              valuePropName: 'checked',
            })(<Switch size="small" checkedChildren="是" unCheckedChildren="否" />)}
            {/* })(<Switch checkedChildren="是" unCheckedChildren="否" onChange={v => this.changeSwitch(v)} />)} */}
          </FormItem>
          {
            getFieldValue('isDefineTable') ? (
              <FormItem {...formItemLayout} label="表名">
                {getFieldDecorator('tableName', {
                  rules: [
                    {transform: value => value && value.trim()},
                    {required: true, message: '表名不能为空'},  
                    {validator: this.changeTableName},
                  ]})(
                  <div className="FBH"> 
                      <span className="ml16 mr16">tbjh_</span>
                      <Input size="small" autoComplete="off" placeholder="请输入表名称" disabled={!this.store.storageId || !this.store.objId} />
                    </div>
                )}
              </FormItem>
            ) : null
          }
         
        </Form>
        <div className="bottom-button">
          <Button style={{marginRight: 8}} onClick={() => closeDrawer()}>关闭</Button>
          <Button
            type="primary"
            style={{marginRight: 8}}
            onClick={this.handleSubmit}
          >
            下一步
          </Button>
        </div>

        <ModalStotageDetail 
          visible={storageVisible}
          detail={storageDetail}
          loading={storageDetailLoading}
          handleCancel={this.closeStorageDetail}
        />
      </div>
    )
  }
}
