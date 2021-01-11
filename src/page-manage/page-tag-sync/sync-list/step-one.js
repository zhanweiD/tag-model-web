import intl from 'react-intl-universal'
/**
 * @description 添加同步计划 - 基础信息配置
 */
import { Component } from 'react'
import { observer } from 'mobx-react'
import { action } from 'mobx'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Input, Select, Button, Switch, Spin } from 'antd'
import { ModalStotageDetail } from '../../../component'
import {
  debounce,
  getNamePattern,
  getEnNamePattern,
} from '../../../common/util'

const FormItem = Form.Item
const Option = { Select }
const { TextArea } = Input

const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 12 },
  colon: false,
}

@Form.create()
@observer
class StepOne extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  componentWillMount() {
    // this.store.getObjList()
    this.store.getStorageType()
  }

  componentDidMount() {
    this.store.oneForm = this.props.form
    this.store.selecStorageType = this.selecStorageType
    this.store.getDefaultStorage()
  }

  @action.bound selectObj(obj) {
    const {
      form: { resetFields },
    } = this.props

    this.store.objId = obj.key
    // this.store.storageId = undefined

    // resetFields(['dataStorageId'])

    // if (this.store.storageType) {
    //   this.store.getStorageList({
    //     storageType: this.store.storageType,
    //     objId: obj.key,
    //   })
    // }
  }

  @action.bound selecStorageType(v) {
    const {
      form: { resetFields, getFieldValue },
    } = this.props
    this.store.storageType = v.key

    this.store.storageId = undefined

    this.store.storageList.clear()
    resetFields(['dataStorageId'])

    // if (getFieldValue('objId')) {
    //   this.store.getStorageList({
    //     storageType: obj.key,
    //     objId: this.store.objId,
    //   })
    // }
    this.store.getStorageList(
      {
        storageType: v.key,
        objId: this.store.objId,
      },
      this.selecStorage
    )
  }

  @action.bound selecStorage(obj) {
    // const {form: {setFieldsValue}} = this.props
    // setFieldsValue({
    //   dataStorageId: obj,
    // })
    this.store.storageId = obj.key
    this.store.storageName = this.getStoragName(obj.key)
    if (obj.key) this.store.getObjList()
    // this.store.getObjList()
  }

  getStoragName = storageId => {
    const { storageList } = this.store
    const obj = storageList.filter(d => d.storageId === storageId)[0] || {}
    return obj.storageName
  }

  @action handleSubmit = e => {
    const {
      form: { validateFieldsAndScroll },
    } = this.props

    const t = this

    validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      console.log(values)
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

    this.store.checkName(params, callback)
    // debounce(() => this.store.checkName(params, callback), 500)
  }

  // 重名校验
  changeTableName = (rule, value, callback) => {
    // console.log(this.store.storageId)
    const params = {
      storageId: this.store.storageId,
      tableName: `tbjh_${value}`,
    }

    // debounce(() => this.store.checkTableName(params, callback), 500)
    this.store.checkTableName(params, callback)
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
      form: { getFieldDecorator, getFieldValue },

      show,
      closeDrawer,
    } = this.props

    const {
      objList,
      syncObjList,
      storageTypeList,
      storageList,
      storageDetailLoading,
      storageDetail,
      storageVisible,
      defaultStorage,
      getDefaultLogin,
    } = this.store
    // if (defaultStorage.storageType) {
    //   this.selecStorageType({key: defaultStorage.storageType})
    // }
    return (
      <div style={{ display: show ? 'block' : 'none' }}>
        <Form>
          <FormItem
            {...formItemLayout}
            label={intl
              .get(
                'ide.src.page-manage.page-tag-sync.sync-list.main.882htd8mhmo'
              )
              .d('计划名称')}
          >
            {getFieldDecorator('name', {
              rules: [
                { transform: value => value && value.trim() },
                {
                  required: true,
                  message: intl
                    .get(
                      'ide.src.page-manage.page-tag-sync.sync-list.step-one.3xm9wutswb9'
                    )
                    .d('计划名称不能为空'),
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
                    'ide.src.page-manage.page-tag-sync.sync-list.step-one.3ktdud8rvz6'
                  )
                  .d('请输入计划名称')}
              />
            )}
          </FormItem>

          {/* <h3 className="mb24 fs14" style={{marginLeft: '200px'}}>目的源信息</h3> */}
          <FormItem
            {...formItemLayout}
            label={intl
              .get('ide.src.page-config.workspace-config.main.1b0l5lpgghm')
              .d('数据源类型')}
          >
            {getFieldDecorator('dataDbType', {
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
              initialValue: defaultStorage.storageType,
            })(
              <Select
                showSearch
                labelInValue // 贼坑，设置不上初始值
                disabled={defaultStorage.storageType}
                placeholder={intl
                  .get(
                    'ide.src.page-config.workspace-config.source-modal.sexnlhau4v'
                  )
                  .d('请选择数据源类型')}
                style={{ width: '100%' }}
                onSelect={v => this.selecStorageType(v)}
                optionFilterProp="children"
                getPopupContainer={triggerNode => triggerNode.parentElement}
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
            {...formItemLayout}
            label={intl
              .get(
                'ide.src.page-manage.page-tag-sync.sync-list.step-one.6zd732vlszu'
              )
              .d('目的源')}
            extra={
              <span style={{ color: 'rgba(0,0,0,.65)' }}>
                {intl
                  .get(
                    'ide.src.page-manage.page-tag-sync.sync-list.step-one.o28pul7s3u'
                  )
                  .d('若无可用的数据源，请先去')}

                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="/tag-model/index.html#/config/environment"
                >
                  {intl
                    .get(
                      'ide.src.page-manage.page-tag-sync.sync-list.step-one.h3ozye9vojw'
                    )
                    .d('后台配置-基础配置')}
                </a>
                {intl
                  .get(
                    'ide.src.page-manage.page-tag-sync.sync-list.step-one.u8mq35frfym'
                  )
                  .d('中添加目的数据源')}
              </span>
            }

            // initialValue={storageList[0] ? storageList[0].storageId : undefined}
          >
            {getFieldDecorator('dataStorageId', {
              rules: [
                {
                  required: true,
                  message: intl
                    .get(
                      'ide.src.page-manage.page-tag-sync.sync-list.step-one.1zqrsmr1kc3'
                    )
                    .d('请选择目的源'),
                },
              ],
            })(
              <div className="select-storage">
                <Select
                  showSearch
                  labelInValue
                  disabled={defaultStorage.storageId}
                  value={
                    this.store.storageId
                      ? { key: this.store.storageId }
                      : undefined
                  }
                  placeholder={intl
                    .get(
                      'ide.src.page-manage.page-tag-sync.sync-list.step-one.1zqrsmr1kc3'
                    )
                    .d('请选择目的源')}
                  style={{ width: '100%' }}
                  onSelect={v => this.selecStorage(v)}
                  optionFilterProp="children"
                  getPopupContainer={triggerNode => triggerNode.parentElement}
                >
                  {storageList.map(item => (
                    <Option
                      key={item.storageId}
                      value={item.storageId}
                      disabled={item.isUsed}
                    >
                      {item.storageName}
                    </Option>
                  ))}
                </Select>
                {getFieldValue('dataStorageId') ? (
                  <a
                    href
                    className="view-storage"
                    onClick={() => this.viewStorage()}
                  >
                    {intl
                      .get(
                        'ide.src.component.modal-stroage-detail.main.v6urtgjoxwd'
                      )
                      .d('查看数据源')}
                  </a>
                ) : null}
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
                showSearch
                labelInValue
                placeholder={intl
                  .get(
                    'ide.src.page-manage.page-tag-sync.sync-list.step-one.aeuprk6e6c'
                  )
                  .d('请选择所属对象')}
                style={{ width: '100%' }}
                onSelect={v => this.selectObj(v)}
                optionFilterProp="children"
              >
                {syncObjList.map(item => (
                  <Option
                    disabled={item.isUsed}
                    key={item.objId}
                    value={item.value}
                  >
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
                'ide.src.page-manage.page-tag-sync.sync-list.step-one.cna70avlgoj'
              )
              .d('自定义目的表')}
          >
            {getFieldDecorator('isDefineTable', {
              valuePropName: 'checked',
            })(
              <Switch
                size="small"
                checkedChildren={intl
                  .get('ide.src.component.form-component.03xp8ux32s3a')
                  .d('是')}
                unCheckedChildren={intl
                  .get('ide.src.component.form-component.h7p1pcijouf')
                  .d('否')}
              />
            )}
            {/* })(<Switch checkedChildren="是" unCheckedChildren="否" onChange={v => this.changeSwitch(v)} />)} */}
          </FormItem>
          {getFieldValue('isDefineTable') ? (
            <FormItem
              {...formItemLayout}
              label={intl
                .get(
                  'ide.src.page-manage.page-tag-sync.sync-list.step-one.fqn16w8hfcf'
                )
                .d('表名')}
            >
              {getFieldDecorator('tableName', {
                rules: [
                  { transform: value => value && value.trim() },
                  ...getEnNamePattern(),
                  {
                    required: true,
                    message: intl
                      .get(
                        'ide.src.page-manage.page-tag-sync.sync-list.step-one.7l4fplaaicb'
                      )
                      .d('表名不能为空'),
                  },
                  { validator: this.changeTableName },
                ],
              })(
                <div className="FBH">
                  <span className="ml16 mr16">tbjh_</span>
                  <Input
                    size="small"
                    autoComplete="off"
                    placeholder={intl
                      .get(
                        'ide.src.page-manage.page-tag-sync.sync-list.step-one.450whn0yz9y'
                      )
                      .d('请输入表名称')}
                    disabled={!this.store.storageId || !this.store.objId}
                  />
                </div>
              )}
            </FormItem>
          ) : null}

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
                { transform: value => value && value.trim() },
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
        </Form>

        <div className="bottom-button">
          <Button style={{ marginRight: 8 }} onClick={() => closeDrawer()}>
            {intl
              .get('ide.src.component.modal-stroage-detail.main.ph80bkiru5h')
              .d('关闭')}
          </Button>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={this.handleSubmit}
          >
            {intl
              .get(
                'ide.src.page-manage.page-tag-model.data-sheet.config-field.kpiieqt46x'
              )
              .d('下一步')}
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
export default StepOne
