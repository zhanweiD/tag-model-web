import intl from 'react-intl-universal'
/**
 * @description 添加目的源
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import {Form} from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import {Drawer, Input, Select, Button} from 'antd'
import {ModalStotageDetail, OmitTooltip} from '../../../component'
import {debounce, getNamePattern} from '../../../common/util'

const FormItem = Form.Item
const Option = {Select}
const {TextArea} = Input

const formItemLayout = {
  labelCol: {span: 5},
  wrapperCol: {span: 19},
}

@Form.create()
@observer
class AddSource extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  componentDidMount() {
    this.store.oneForm = this.props.form
    this.store.selecStorageType = this.selecStorageType
    this.store.getDefaultStorage()
  }

  @observable objId
  @observable storageId
  @observable entity0Key
  @observable entity1Key

  @action.bound resetSelect() {
    const {
      form: {resetFields},
    } = this.props

    this.entity0Key = undefined
    this.entity1Key = undefined
    this.store.fieldList.clear()
    this.store.storageTable.clear()

    resetFields(['dataTableName', 'entity0Key', 'entity1Key'])
  }

  @action.bound selectObj(v) {
    this.objId = v

    this.store.getRelObj({
      objId: v,
    })

    // const dataStorageType = getFieldValue('dataStorageType')
    // if (typeof dataStorageType !== 'undefined') {
    //   this.store.getStorageList({
    //     dataStorageType,
    //     objId: v,
    //   })
    // }

    // this.storageId = undefined
    // resetFields(['dataStorageId'])
    // this.resetSelect()
  }

  @action.bound selecStorageType(v) {
    const {
      form: {getFieldValue, resetFields},
    } = this.props

    this.storageId = undefined
    resetFields(['dataStorageId'])
    this.resetSelect()

    const objId = getFieldValue('objId')
    // if (typeof objId !== 'undefined') {
    this.store.getStorageList(
      {
        dataStorageType: v,
        objId,
      },
      this.selecStorage
    )
    // }
  }

  @action.bound selecStorage(v) {
    const {
      form: {setFieldsValue},
    } = this.props

    this.storageId = v
    this.store.storageId = v
    this.resetSelect()

    setFieldsValue({
      dataStorageId: v,
    })

    this.store.getStorageTable({
      dataStorageId: v,
    })
  }

  @action.bound selectTable(v) {
    const {
      form: {resetFields},
    } = this.props

    this.entity0Key = undefined
    this.entity1Key = undefined
    this.store.fieldList.clear()

    resetFields(['entity0Key', 'entity1Key'])

    this.store.getFieldList({
      dataStorageId: this.storageId,
      dataTableName: v,
    })
  }

  @action.bound selectField(field, index, objId, tagId) {
    this.store.fieldList = this.store.fieldList.map(d => {
      if (d.fieldName === field) {
        return {
          ...d,
          disabled: true,
          objId,
          tagId,
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
    this[`entity${index}Key`] = field
  }

  @action.bound handleSubmit() {
    const {
      form: {validateFieldsAndScroll},
    } = this.props

    const t = this

    validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }

      const majorKeyList = t.store.fieldList.filter(
        d => d.fieldName === t.entity0Key || d.fieldName === t.entity1Key
      )

      const tableRelMainTagMapping = majorKeyList.map(d => ({
        objId: d.objId,
        tagId: d.tagId,
        fieldName: d.fieldName,
        fieldType: d.fieldType,
      }))

      const params = {
        name: values.name,
        objId: values.objId,
        descr: values.descr,
        dataStorageType: values.dataStorageType,
        dataStorageId: values.dataStorageId,
        dataTableName: values.dataTableName,
        tableRelMainTagMapping,
      }

      t.store.addList(params, () => t.closeDrawer())
    })
  }

  @action.bound closeDrawer() {
    this.objId = undefined
    this.storageId = undefined
    this.entity0Key = undefined
    this.entity1Key = undefined

    this.store.closeDrawer()
  }

  @action.bound viewDetail() {
    this.store.getStorageDetail({
      dataStorageId: this.storageId,
    })

    this.store.storageDetailVisible = true
  }

  @action closeStorageDetail = () => {
    this.store.storageDetailVisible = false
  }

  // 重名校验
  checkName = (rule, value, callback) => {
    const params = {
      name: value,
    }

    // this.store.checkName(params, callback)
    debounce(() => this.store.checkName(params, callback), 500)
  }

  render() {
    const {
      form: {getFieldDecorator},
    } = this.props
    const {
      visible,
      confirmLoading,
      underObjList,
      storageTypeList,
      storageList,
      storageTable,
      fieldList,
      objRelList,

      storageLoading,
      storageDetail,
      storageDetailVisible,
      defaultStorage,
    } = this.store

    const drawerConfig = {
      title: intl
        .get(
          'ide.src.page-manage.page-aim-source.source-list.drawer.r6g2nr788q8'
        )
        .d('新建目的源'),
      visible,
      closable: true,
      width: 560,
      maskClosable: false,
      destroyOnClose: true,
      onClose: this.closeDrawer,
      className: 'add-source',
    }

    return (
      <Drawer {...drawerConfig}>
        <Form style={{paddingBottom: '50px'}} colon={false}>
          <FormItem
            {...formItemLayout}
            label={intl
              .get(
                'ide.src.page-manage.page-aim-source.source-list.drawer.u411cezuxlh'
              )
              .d('目的源名称')}
          >
            {getFieldDecorator('name', {
              rules: [
                {transform: value => value && value.trim()},
                {
                  required: true,
                  message: intl
                    .get(
                      'ide.src.page-manage.page-aim-source.source-list.drawer.nbl76uy5t6i'
                    )
                    .d('目的源名称不能为空'),
                },
                // {max: 32, message: '输入不能超过32个字符'},
                ...getNamePattern(),
                {
                  validator: this.checkName,
                },
              ],

              validateFirst: true,
            })(
              <Input
                size="small"
                autoComplete="off"
                placeholder={intl
                  .get(
                    'ide.src.page-manage.page-aim-source.source-list.drawer.vmwa9tf76i'
                  )
                  .d('请输入目的源名称')}
              />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={intl
              .get('ide.src.page-config.workspace-config.main.1b0l5lpgghm')
              .d('数据源类型')}
          >
            {getFieldDecorator('dataStorageType', {
              rules: [
                {
                  required: true,
                  message: intl
                    .get(
                      'ide.src.page-config.workspace-config.source-modal.sexnlhau4v'
                    )
                    .d('请选择数据源类型'),
                },
              ],
            })(
              <Select
                showSearch
                disabled={defaultStorage.storageType}
                optionFilterProp="children"
                placeholder={intl
                  .get(
                    'ide.src.page-config.workspace-config.source-modal.sexnlhau4v'
                  )
                  .d('请选择数据源类型')}
                style={{width: '100%'}}
                onSelect={v => this.selecStorageType(v)}
              >
                {storageTypeList.map(item => (
                  <Option key={item.value} value={item.value}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem
            labelCol={{span: 5}}
            wrapperCol={{span: 16}}
            label={intl
              .get('ide.src.business-component.tag-relate.dag-box.9mzk7452ggp')
              .d('数据源')}
            // extra={(
            //   <span>
            //     若无可用的数据源，请先
            //     <a target="_blank" rel="noopener noreferrer" href={`/tag-model/index.html#/project/${this.store.projectId}`}>去项目配置中添加目的数据源</a>
            //   </span>
            // )}
          >
            {getFieldDecorator('dataStorageId', {
              rules: [
                {
                  required: true,
                  message: intl
                    .get(
                      'ide.src.page-config.workspace-config.source-modal.0oev0nqwsxun'
                    )
                    .d('请选择数据源'),
                },
              ],
            })(
              <div className="select-storage">
                <Select
                  showSearch
                  disabled={defaultStorage.storageId}
                  optionFilterProp="children"
                  value={this.storageId}
                  placeholder={intl
                    .get(
                      'ide.src.page-config.workspace-config.source-modal.0oev0nqwsxun'
                    )
                    .d('请选择数据源')}
                  style={{width: '100%'}}
                  onSelect={v => this.selecStorage(v)}
                >
                  {storageList.map(item => (
                    <Option
                      key={item.dataStorageId}
                      value={item.dataStorageId}
                      disabled={item.used}
                    >
                      {item.storageName}
                    </Option>
                  ))}
                </Select>
                {this.storageId ? (
                  <a href className="view-storage" onClick={this.viewDetail}>
                    {intl
                      .get(
                        'ide.src.component.modal-stroage-detail.main.v6urtgjoxwd'
                      )
                      .d('查看数据源')}
                  </a>
                ) : (
                  <span className="view-storage disabled">
                    {intl
                      .get(
                        'ide.src.component.modal-stroage-detail.main.v6urtgjoxwd'
                      )
                      .d('查看数据源')}
                  </span>
                )}
              </div>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={intl
              .get(
                'ide.src.page-manage.page-aim-source.source-detail.main.64wlzv1scpk'
              )
              .d('同步对象')}
          >
            {getFieldDecorator('objId', {
              rules: [
                {
                  required: true,
                  message: intl
                    .get(
                      'ide.src.page-manage.page-aim-source.source-list.drawer.6973zbnt1wk'
                    )
                    .d('请选择同步对象'),
                },
              ],
            })(
              <Select
                placeholder={intl
                  .get(
                    'ide.src.page-manage.page-aim-source.source-list.drawer.6973zbnt1wk'
                  )
                  .d('请选择同步对象')}
                style={{width: '100%'}}
                onSelect={v => this.selectObj(v)}
                showSearch
                optionFilterProp="children"
              >
                {underObjList.map(item => (
                  <Option disabled={item.isUsed} key={item.objId} value={item.objId}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={intl
              .get(
                'ide.src.page-manage.page-aim-source.source-list.drawer.5u6m68xs7v6'
              )
              .d('方案描述')}
          >
            {getFieldDecorator('descr', {
              rules: [
                {transform: value => value && value.trim()},
                {
                  max: 128,
                  whitespace: true,
                  message: intl
                    .get('ide.src.component.form-component.8ftxftczpk7')
                    .d('输入不能超过128个字符'),
                },
              ],
            })(
              <TextArea
                placeholder={intl
                  .get(
                    'ide.src.page-manage.page-aim-source.source-list.drawer.t3bend5cdmq'
                  )
                  .d('请输入方案描述')}
              />
            )}
          </FormItem>
          {/* <h3 className="mb24 fs14">目的源信息</h3> */}

          <FormItem
            {...formItemLayout}
            label={intl
              .get(
                'ide.src.page-manage.page-aim-source.source-detail.main.vzwvcfbgza'
              )
              .d('目的表')}
          >
            {getFieldDecorator('dataTableName', {
              rules: [
                {
                  required: true,
                  message: intl
                    .get(
                      'ide.src.page-manage.page-aim-source.source-list.drawer.ywu4do2altd'
                    )
                    .d('请选择目的表'),
                },
              ],
            })(
              <Select
                showSearch
                optionFilterProp="children"
                placeholder={intl
                  .get(
                    'ide.src.page-manage.page-aim-source.source-list.drawer.ywu4do2altd'
                  )
                  .d('请选择目的表')}
                style={{width: '100%'}}
                onSelect={v => this.selectTable(v)}
              >
                {storageTable.map(item => (
                  <Option key={item} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          {this.objId
            ? objRelList.map((d, i) => (
              <FormItem
                {...formItemLayout}
                label={(
                  <OmitTooltip
                    text={d.objName}
                    maxWidth={100}
                    className="rel-entity-name"
                  />
                )}
              >
                {getFieldDecorator(`entity${i}Key`, {
                  rules: [
                    {
                      required: true,
                      message: intl
                        .get(
                          'ide.src.page-manage.page-aim-source.source-list.drawer.5ynyp00ian4'
                        )
                        .d('请选择主标签绑定的字段'),
                    },
                  ],
                })(
                  <Select
                    showSearch
                    optionFilterProp="children"
                    placeholder={intl
                      .get(
                        'ide.src.page-manage.page-aim-source.source-list.drawer.5ynyp00ian4'
                      )
                      .d('请选择主标签绑定的字段')}
                    style={{width: '100%'}}
                    onSelect={v => this.selectField(v, i, d.objId, d.tagId)}
                  >
                    {fieldList.map(d => (
                      <Option
                        key={d.fieldName}
                        value={d.fieldName}
                        disabled={d.disabled}
                      >
                        {d.fieldName}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            ))
            : null}
        </Form>
        <div className="bottom-button">
          <Button style={{marginRight: 8}} onClick={() => this.closeDrawer()}>
            {intl
              .get('ide.src.page-config.workspace-config.modal.xp905zufzth')
              .d('取消')}
          </Button>
          <Button
            type="primary"
            loading={confirmLoading}
            onClick={this.handleSubmit}
          >
            {intl
              .get('ide.src.page-config.workspace-config.modal.wrk0nanr55b')
              .d('确定')}
          </Button>
        </div>
        <ModalStotageDetail
          visible={storageDetailVisible}
          detail={storageDetail}
          loading={storageLoading}
          handleCancel={this.closeStorageDetail}
        />
      </Drawer>
    )
  }
}
export default AddSource
