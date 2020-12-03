import {Component, Fragment} from 'react'
import {observer, inject} from 'mobx-react'
import {action, observable, toJS} from 'mobx'
import {Form} from '@ant-design/compatible'
import _ from 'lodash'
import '@ant-design/compatible/assets/index.css'
import {Modal, Select, Switch, Radio} from 'antd'
import {OmitTooltip} from '../../../component'

const FormItem = Form.Item
const {Option} = Select

const formItemLayout = {
  labelCol: {span: 5},
  wrapperCol: {span: 19},
  colon: false,
}

@inject('bigStore')
@Form.create()
@observer
class ModalRelateTable extends Component {
  constructor(props) {
    super(props)
    
    this.store = props.store
    this.bigStore = props.bigStore
  }

  @observable chooseEntity // 简单关系 从关联实体的数据表中选择的实体
  @observable chooseEntityMaJorKey // 简单关系 从关联实体的数据表中选择的实体 的主键
  @observable chooseModel = 0
  // @observable modalRelateVisible = true 

  @action.bound initData() {
    const {form: {resetFields}} = this.props
    this.store.majorKeyField = undefined
    this.store.entity1Key = undefined
    this.store.entity2Key = undefined
 
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
  

  // 单选按钮
  @action.bound onRadioChange(e) {
    const {value} = e.target
    this.chooseModel = value
    const {form: {resetFields}} = this.props
    this.store.tableName = undefined
    resetFields(['mode'])
    this.initData()
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

  @action handleSubmit = e => {
    const {
      form: {
        validateFieldsAndScroll,
      },
    } = this.props
    const t = this
    const {
      typeCode,
      bothTypeCode,
      dataSourceList,
      fieldList,
      fieldList1,
      fieldList2,
    } = this.store

    validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      } 

      if (values.entity1Key || values.entity2Key) {
        this.store.entity1Key = values.entity1Key 
        this.store.entity2Key = values.entity2Key
      }

      if (values.mode === 0) {
        // 并集模式
        this.store.updateObjJoinMode({
          mode: values.mode,
          objId: +this.store.objId,
        }, () => {
          t.handleCancel()
        })
      } else {
        const targetStorage = _.find(dataSourceList, item => item.storageId === values.dataStorageId)
        const dataStorageType = targetStorage.storageType
        const dataDbName = targetStorage.dbName
        let fieldArr = []

        if (+typeCode === 4) {
          // 实体
          const targetField = _.find(fieldList, item => item.field === values.mappingKey)
          const fieldName = targetField.field
          const fieldType = targetField.type
          fieldArr = [
            {
              obj_id: this.bigStore.objDetail.id,
              field_type: fieldType,
              field_name: fieldName,
            },
          ]
        } else {
          // 关系
          const {objDetail} = this.bigStore
          const entity1Id = objDetail.objRspList && objDetail.objRspList[0].id
          const entity2Id = objDetail.objRspList && objDetail.objRspList[1].id

          const {entity1Key, entity2Key} = values
          const targetField1 = _.find(fieldList1, item => item.field === entity1Key)
          const fieldName1 = targetField1.field
          const fieldType1 = targetField1.type

          const targetField2 = _.find(fieldList2, item => item.field === entity2Key)
          const fieldName2 = targetField2.field
          const fieldType2 = targetField2.type

          fieldArr = [
            {
              obj_id: entity1Id,
              field_type: fieldType1,
              field_name: fieldName1,
            }, {
              obj_id: entity2Id,
              field_type: fieldType2,
              field_name: fieldName2,
            },
          ]
        }
        

        // 主表模式
        this.store.updateObjJoinMode({
          mode: values.mode,
          objId: +this.store.objId,
          dataStorageId: values.dataStorageId,
          dataStorageType,
          dataDbName,
          dataTableName: values.dataTableName,
          mappingKeys: JSON.stringify(fieldArr),
        }, () => {
          t.handleCancel()
        })
      }
    })
  }

  @action handleCancel = () => {
    const {store} = this.props
    this.chooseEntity = undefined
    this.chooseModel = undefined
    this.chooseEntityMaJorKey = undefined
    store.closeModal()
    this.handleReset()
  }

  // @action.bound closeModal(){
  //   this.chooseModel = 2 
  // }

  @action handleReset = () => {
    const {
      form: {
        resetFields,
      },
    } = this.props
    resetFields()
  }

  @action dataSourceSelect = e => {
    const {form: {resetFields}} = this.props
    const {typeCode} = this.store
    if (this.chooseModel === 1) {
      if (typeCode === 4) {
        resetFields(['dataTableName', 'mappingKey'])
      } else {
        resetFields(['dataTableName', 'mappingKey', 'entity1Key', 'entity2Key'])
      }
    }

    this.store.storageId = e
    this.store.getDataSheet({
      storageId: e,
    })
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
      typeCode,
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
        title="多表关联模式设置"
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
        confirmLoading={confirmLoading}
        className="data-sheet-modal"
      >
        <Form>
          <FormItem {...formItemLayout}>
            {getFieldDecorator('mode', {
              initialValue: 0, // 0 是并集，1是主表
            })(
              <Radio.Group onChange={this.onRadioChange}>
                <Radio value={1}>主表模式</Radio>
                <Radio value={0}>并集模式</Radio>
              </Radio.Group>,
            )}
          </FormItem>
          
          { +this.chooseModel === 1 ? (
            <Fragment>
              <FormItem {...formItemLayout} label="数据源">
                {getFieldDecorator('dataStorageId', {
                  rules: [{required: true, message: '请选择数据源'}],
                })(
                  <Select 
                    placeholder="请选择数据源" 
                    showSearch
                    optionFilterProp="children"
                    onSelect={e => this.dataSourceSelect(e)}
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
              {/* 实体2 */}
              { 
                this.chooseModel === 1 && +typeCode === 4 ? (
                  // <FormItem {...formItemLayout} label="主标签绑定的字段">
                  <FormItem 
                    {...formItemLayout} 
                    label={<OmitTooltip text="主标签绑定的字段" className="rel-entity-name" />}
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
                // ) : null
              } 
            </Fragment>
          ) : null
          }
          {
            this.chooseModel === 1 && +typeCode === 3 ? (
              <Fragment>
                <FormItem {...formItemLayout} label={<OmitTooltip text={entity1Name} maxWidth={80} className="rel-entity-name" />}>
                  {getFieldDecorator('entity1Key', {
                    rules: [{required: true, message: `请选择${entity1Name}绑定的字段`}],
                  })(
                    <Select 
                      placeholder={`请选择${entity1Name}绑定的字段`} 
                      onSelect={v => this.selectEntityKey(v, 1, entity1Id)} 
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
                    rules: [{required: true, message: `请选择${entity2Name}绑定的字段`}],
                  })(
                    <Select 
                      showSearch
                      optionFilterProp="children"
                      placeholder={`请选择${entity2Name}绑定的字段`} 
                      onSelect={v => this.selectEntityKey(v, 2, entity2Id)} 
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

export default ModalRelateTable
