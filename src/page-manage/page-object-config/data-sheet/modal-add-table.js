import {Component, Fragment} from 'react'
import {observer, inject} from 'mobx-react'
import {action, observable, toJS} from 'mobx'
import {Form} from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import {Modal, Select, Switch, Radio, Input, Button} from 'antd'
import {OmitTooltip} from '../../../component'

const FormItem = Form.Item
const {Option} = Select
const {TextArea} = Input

const formItemLayout = {
  labelCol: {span: 4},
  wrapperCol: {span: 20},
  colon: false,
}

@inject('bigStore')
@Form.create()
@observer
class ModalAddTable extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
    this.bigStore = props.bigStore
  }

  @observable chooseEntity // 简单关系 从关联实体的数据表中选择的实体
  @observable chooseEntityMaJorKey // 简单关系 从关联实体的数据表中选择的实体 的主键

  @action.bound initData() {
    const {form: {resetFields}} = this.props
    this.store.majorKeyField = undefined
    this.store.entity1Key = undefined
    this.store.entity2Key = undefined
    this.store.whereCondition = undefined
 
    // 关系
    if (this.store.typeCode === '3') {
      resetFields(['entity1Key', 'entity2Key'])
      this.store.entity1Key = undefined
      this.store.entity2Key = undefined
    }
  }

  @action.bound onSwitchChange(checked) {
    const {form: {resetFields}} = this.props
    const {objDetail} = this.bigStore

    this.store.tableName = undefined
    resetFields(['dataTableName'])
    if (checked) {
      this.chooseEntity = objDetail.objRspList && objDetail.objRspList[0].id
      this.store.getEntityDataSource(this.chooseEntity)
    } else {
      this.chooseEntity = undefined
      this.chooseEntityMaJorKey = undefined
      this.store.getDataSheet()
      resetFields(['entity1Key', 'entity2Key'])
    }
  }
  
  @action.bound onRadioChange(e) {
    const {value} = e.target
    this.chooseEntity = value
    this.store.getEntityDataSource(value)

    const {form: {resetFields}} = this.props
    this.store.tableName = undefined
    this.chooseEntityMaJorKey = undefined

    resetFields(['dataTableName'])

    this.initData()
  }

  @action.bound onWhereChange(data) {
    this.store.whereCondition = data.target.value
    this.store.whereSuccess = false
  }

  /*
   * @description 选择数据表；请求数据表下字段列表
   * @param {*} tableName 数据表名
   */
  @action.bound selectDataSheet(tableName) {
    const t = this
    const {form: {resetFields}} = this.props
    if (tableName !== this.store.tableName) {
      this.store.tableName = tableName

      resetFields(['mappingKey'])

      const {objDetail} = this.bigStore

      const entity1Id = objDetail.objRspList && objDetail.objRspList[0].id
      const entity2Id = objDetail.objRspList && objDetail.objRspList[1].id

      // 关系
      if (entity1Id && entity1Id) {
        this.store.getFieldList({objId: entity1Id}, fieldList => {
          if (t.chooseEntity) {
            t.store.getMappingKey(t.chooseEntity, field => {
              t.chooseEntityMaJorKey = field
              t.store.fieldList1 = fieldList.map(d => {
                if (d.field === field) {
                  return {
                    ...d,
                    objId: t.chooseEntity,
                    disabled: true,
                  }
                }
    
                return d
              })
            })
          } else {
            t.store.fieldList1 = fieldList
          }
        })

        this.store.getFieldList({objId: entity2Id}, fieldList => {
          if (t.chooseEntity) {
            t.store.getMappingKey(t.chooseEntity, field => {
              t.chooseEntityMaJorKey = field
              t.store.fieldList2 = fieldList.map(d => {
                if (d.field === field) {
                  return {
                    ...d,
                    objId: t.chooseEntity,
                    disabled: true,
                  }
                }
    
                return d
              })
            })
          } else {
            t.store.fieldList2 = fieldList
          }
        })
      } else {
        // 实体
        this.store.getFieldList({objId: this.store.objId})
      }
      
      this.initData()
    }
  }

  @action.bound selectMajorKey(field) {
    this.store.majorKeyField = field
  }

  @action.bound selectEntityKey(field, index, objId) {
    this.store.fieldList1 = this.store.fieldList1.map(d => {
      if (d.field === field) {
        return {
          ...d,
          disabled: true,
          objId,
        }
      }

      if (d.objId === objId) {
        return {
          ...d,
          field: d.field,
          disabled: false,
        }
      }
      return d
    })

    this.store.fieldList2 = this.store.fieldList2.map(d => {
      if (d.field === field) {
        return {
          ...d,
          disabled: true,
          objId,
        }
      }

      if (d.objId === objId) {
        return {
          ...d,
          field: d.field,
          disabled: false,
        }
      }
      return d
    })
    this.store[`entity${index}Key`] = field
  }

  // @action checkWhere() {
  //   this.store.checkWhere()
  //   console.log(this.store.whereSuccess)
  // }

  @action handleSubmit = e => {
    const {
      form: {
        validateFieldsAndScroll,
      },
    } = this.props
    const t = this
    const {
      typeCode,
      // bothTypeCode,
    } = this.store

    validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      } 

      if (values.entity1Key || values.entity2Key) {
        this.store.entity1Key = values.entity1Key 
        this.store.entity2Key = values.entity2Key
      }

      // 实体添加数据表
      if (+typeCode === 4) {
        this.store.saveEntityField(() => {
          t.bigStore.getObjDetail()
          t.bigStore.getObjCard()
          t.store.getList({
            objId: t.store.objId,
            currentPage: 1,
          })
          t.handleCancel()
        })
      } else {
        this.store.saveRelField({
          fromEntity: this.chooseEntity ? 1 : 0,
          entityId: this.chooseEntity,
        }, () => {
          t.bigStore.getObjDetail()
          t.bigStore.getObjCard()
          t.store.getList({
            objId: t.store.objId,
            currentPage: 1,
          })
          t.handleCancel()
        })
      }
    })
  }

  @action handleCancel = () => {
    const {store} = this.props
    this.chooseEntity = undefined
    this.chooseEntityMaJorKey = undefined
    store.closeModal()
    this.handleReset()
  }

  @action handleReset = () => {
    const {
      form: {
        resetFields,
      },
    } = this.props
    resetFields()
  }

  // 校验where值输入
  handleWhereConditionValidator = (rule, value, callback) => {
    this.store.whereCondition && !this.store.whereSuccess ? callback('请校验where条件') : callback()
  }

  render() {
    const {
      form: {
        getFieldDecorator,
        getFieldValue,
      },

    } = this.props

    const {
      modalVisible,
      confirmLoading,
      dataSourceList,
      dataSheetList,
      fieldList,
      fieldList1,
      fieldList2,
      bothTypeCode,
      storageId,
      whereCondition,
      whereSuccess,
    } = this.store

    const {objDetail} = this.bigStore

    const entity1Id = objDetail.objRspList && objDetail.objRspList[0].id
    const entity1Name = objDetail.objRspList && objDetail.objRspList[0].name
    const entity2Id = objDetail.objRspList && objDetail.objRspList[1].id
    const entity2Name = objDetail.objRspList && objDetail.objRspList[1].name

    return (
      <Modal
        width={600}
        visible={modalVisible}
        maskClosable={false}
        destroyOnClose
        title="添加关联表"
        // onOk={this.handleSubmit}
        onCancel={this.handleCancel}
        confirmLoading={confirmLoading}
        className="data-sheet-modal"
        footer={[<Button onClick={this.handleCancel}>取消</Button>, 
          <Button disabled={whereCondition && !whereSuccess} type="primary" onClick={this.handleSubmit}>确认</Button>]}
      >
        <Form>
          {/* 0 简单关系 */}
          {
            +bothTypeCode === 0 ? (
              <Fragment>
                <FormItem 
                  {...formItemLayout} 
                  label={<OmitTooltip text="从关联实体的数据表中选择" maxWidth={80} className="rel-entity-name" />}
                  //             label={(
                  //               <span>
                  //                 <span className="mr10">从关联实体的</span>
                  //                 <br />
                  // 数据表中选择
                  //               </span>
                  //             )}
                >
                  {getFieldDecorator('switch')(
                    <Switch 
                      size="small"
                      checkedChildren="是"
                      unCheckedChildren="否"
                      onChange={this.onSwitchChange}
                    />
                  )}
                </FormItem>

                {
                  getFieldValue('switch') ? (
                    <FormItem {...formItemLayout} label="关联实体">
                      {getFieldDecorator('entity', {
                        initialValue: entity1Id,
                      })(
                        <Radio.Group onChange={this.onRadioChange}>
                          <Radio value={entity1Id}>{entity1Name}</Radio>
                          <Radio value={entity2Id}>{entity2Name}</Radio>
                        </Radio.Group>,
                      )}
                    </FormItem>
                  ) : null
                }
             
              </Fragment>
            ) : null
          }
        
          <FormItem {...formItemLayout} label="数据源">
            {getFieldDecorator('dataStorageId', {
              initialValue: storageId,
              rules: [{required: true, message: '请选择数据源'}],
            })(
              <Select 
                placeholder="请选择数据源" 
                disabled 
                showSearch
                optionFilterProp="children"
              >
                {
                  dataSourceList.map(item => (
                    <Option key={item.storageId} value={item.storageId} disabled={item.isUsed}>{item.storageName}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
          <FormItem 
            {...formItemLayout}
            label="数据表"
            extra={+bothTypeCode === 0 && getFieldValue('switch') 
              ? (
                <span>
关联实体下无可用的数据表？
                  <a target="_blank" rel="noopener noreferrer" href={`${window.__keeper.pathHrefPrefix}/manage/object-config/4/${+this.chooseEntity}/table`}>去对象配置中添加</a>
                </span>
              )
              : null}
          >
            {getFieldDecorator('dataTableName', {
              rules: [{required: true, message: '请选择数据表'}],
            })(
              <Select placeholder="请选择数据表" onSelect={v => this.selectDataSheet(v)} showSearch optionFilterProp="children">
                {
                  dataSheetList.map(item => (
                    <Option key={item.tableName} value={item.tableName} disabled={item.isUsed}>{item.tableName}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="where条件">
            {getFieldDecorator('whereCondition', {
              rules: [
                '@transformTrim',
                '@required',
                '@max128',
              ],
            })(
              <FormItem>
                <TextArea 
                  onChange={this.onWhereChange}
                  id="where"
                  placeholder="请输入查询语句的where条件，该查询语句的返回结果将作为对象绑定的数据。例如：sex=“男” and age>30" 
                />
                <FormItem style={{textAlign: 'right'}}>
                  {getFieldDecorator('validator', {
                    // rules: [
                    //   {validator: this.handleWhereConditionValidator},
                    // ],
                  })(
                    <Button
                      type="ghost"
                      onClick={() => this.store.checkWhere()}
                    >
                    校验
                    </Button>
                  )}
                </FormItem>
              </FormItem>
            )}
          </FormItem>
          {/* 实体2 */}
          {
            +bothTypeCode === 2 ? (
              // <FormItem {...formItemLayout} label="主标签绑定的字段">
              <FormItem 
                {...formItemLayout} 
                label={<OmitTooltip text="主标签绑定的字段" maxWidth={80} className="rel-entity-name" />}
                //             label={(
                //               <span>
                //                 <span className="mr10">主标签绑定的</span>
                //                 <br />
                // 字段
                //               </span>
                //             )}
              >
                {getFieldDecorator('mappingKey', {
                  rules: [{required: true, message: '请选择主标签绑定的字段'}],
                })(
                  <Select placeholder="请选择主标签绑定的字段" onSelect={v => this.selectMajorKey(v)} showSearch optionFilterProp="children">
                    {
                      fieldList.map(item => (
                        <Option key={item.field} value={item.field} disabled={!item.isMajor}>{item.field}</Option>
                      ))
                    }
                  </Select>
                )}
              </FormItem>
            ) : <h3 className="mb24 fs14" style={{marginLeft: '12px'}}>主标签配置</h3>
          }
        
          {/* 复杂关系1 */}
          {
            +bothTypeCode === 1 || +bothTypeCode === 0 ? (
              <Fragment>
                <FormItem {...formItemLayout} label={<OmitTooltip text={entity1Name} maxWidth={80} className="rel-entity-name" />}>
                  {getFieldDecorator('entity1Key', {
                    initialValue: +this.chooseEntity === entity1Id ? this.chooseEntityMaJorKey : undefined,
                    rules: [{required: true, message: '请选择主标签绑定的字段'}],
                  })(
                    <Select 
                      placeholder={`请选择${entity1Name}绑定的字段`} 
                      onSelect={v => this.selectEntityKey(v, 1, entity1Id)} 
                      disabled={+this.chooseEntity === entity1Id}
                      showSearch
                      optionFilterProp="children"
                    >
                      {
                        fieldList1.map(item => (
                          <Option key={item.field} value={item.field} disabled={item.disabled || !item.isMajor}>{item.field}</Option>
                        ))
                      }
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label={<OmitTooltip text={entity2Name} maxWidth={80} className="rel-entity-name" />}>
                  {getFieldDecorator('entity2Key', {
                    initialValue: +this.chooseEntity === entity2Id ? this.chooseEntityMaJorKey : undefined,
                    rules: [{required: true, message: '请选择主标签绑定的字段'}],
                  })(
                    <Select 
                      showSearch
                      optionFilterProp="children"
                      placeholder={`请选择${entity2Name}绑定的字段`} 
                      onSelect={v => this.selectEntityKey(v, 2, entity2Id)} 
                      disabled={+this.chooseEntity === entity2Id}
                    >
                      {
                        fieldList2.map(item => (
                          <Option key={item.field} value={item.field} disabled={item.disabled || !item.isMajor}>{item.field}</Option>
                        ))
                      }
                    </Select>
                  )}
                </FormItem>
              </Fragment>
            
            ) : null
          }
        </Form>
      </Modal>

    )
  }
}

export default ModalAddTable
