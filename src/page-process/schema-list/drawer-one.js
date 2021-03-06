import intl from 'react-intl-universal'
/**
 * @description 创建加工方案 - 基础信息
 */
import { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { action, toJS } from 'mobx'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Input, Select, Button, Modal, Spin } from 'antd'
import { debounce, getNamePattern } from '../../common/util'

const FormItem = Form.Item
const Option = { Select }
const { TextArea } = Input

const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 12 },
}

@Form.create()
@inject('rootStore')
@observer
class DrawerOne extends Component {
  constructor(props) {
    super(props)

    const { drawerStore, codeStore } = props.rootStore

    this.store = drawerStore
    this.codeStore = codeStore
  }

  componentWillMount() {
    this.store.getObjList()
  }

  @action.bound nextStep() {
    const {
      form: { validateFieldsAndScroll },
    } = this.props

    const { schemeDetail } = this.store

    validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }

      this.store.schemeDetail.objId = Array.isArray(values.objId)
        ? values.objId[0].key
        : values.objId.key
      this.store.schemeDetail.objName = Array.isArray(values.objId)
        ? values.objId[0].label
        : values.objId.label
      this.store.schemeDetail.name = values.name
      this.store.schemeDetail.descr = values.descr
      this.store.schemeDetail.obj = this.obj || schemeDetail.obj

      // 请求标签树
      this.store.getTagTree(() => {
        if (this.codeStore.editor) {
          this.codeStore.editor.refresh()
        }
      })

      this.store.nextStep()

      this.store.oneStepSuccess = true
    })
  }

  @action.bound closeDrawer() {
    const {
      form: { validateFieldsAndScroll },
    } = this.props

    const { schemeDetail } = this.store

    const t = this
    Modal.confirm({
      title: intl
        .get('ide.src.page-process.schema-list.drawer-one.lhw5n2z4lk')
        .d('是否保存方案'),
      okText: intl
        .get('ide.src.page-config.workspace-config.modal.osxrfhrriz')
        .d('确认'),
      cancelText: intl
        .get('ide.src.page-config.workspace-config.modal.xp905zufzth')
        .d('取消'),
      onOk: () => {
        validateFieldsAndScroll((err, values) => {
          if (err) {
            return
          }

          t.store.schemeDetail.objId = Array.isArray(values.objId)
            ? values.objId[0].key
            : values.objId.key
          this.store.schemeDetail.objName = Array.isArray(values.objId)
            ? values.objId[0].label
            : values.objId.label
          t.store.schemeDetail.name = values.name
          t.store.schemeDetail.descr = values.descr
          t.store.schemeDetail.obj = t.obj || schemeDetail.obj

          t.store.saveSchema({
            status: 0,
          })
          // 保存
        })
      },
      onCancel: () => t.store.closeDrawer(),
    })
  }

  /**
   * @description 重名校验
   */
  checkName = (rule, value, callback) => {
    const {
      form: { getFieldValue },
    } = this.props
    const { schemeDetail } = this.store

    const formObjId = getFieldValue('objId')
    const objId = Array.isArray(formObjId) ? formObjId[0].key : formObjId.key

    const params = {
      name: value,
      objId,
    }

    if (schemeDetail.id) {
      params.id = schemeDetail.id
    }
    debounce(() => this.store.checkName(params, callback), 500)
    // this.store.checkName(params, callback)
  }

  @action.bound selectObj(v) {
    const { objList } = this.store

    const selectObj = objList.filter(d => +d.objId === +v.key)[0]

    // 1 复杂关系 2 实体
    if (selectObj.type === 1) {
      this.store.getObjDetail(
        {
          id: v.key,
        },
        data => {
          const entityObj = data.objRspList.map(d => ({
            id: d.id,
            name: d.name,
          }))

          this.obj = entityObj
        }
      )
    } else {
      this.obj = [
        {
          id: v.key,
          name: v.label,
        },
      ]
    }
  }

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },

      show,
      wrappedComponentRef,
    } = this.props

    const { objList, schemeDetail, loading } = this.store

    return (
      <div style={{ display: show ? 'block' : 'none' }}>
        <Spin spinning={loading}>
          <Form wrappedComponentRef={wrappedComponentRef}>
            <FormItem
              {...formItemLayout}
              label={intl
                .get(
                  'ide.src.page-manage.page-aim-source.tag-config.main.2vfpdytl49n'
                )
                .d('所属对象')}
            >
              {getFieldDecorator('objId', {
                initialValue: schemeDetail.objId
                  ? [{ key: schemeDetail.objId, label: schemeDetail.objName }]
                  : undefined,
                rules: [
                  {
                    required: true,
                    message: intl
                      .get(
                        'ide.src.page-manage.page-tag-sync.sync-list.step-one.aeuprk6e6c'
                      )
                      .d('请选择所属对象'),
                  },
                ],
              })(
                <Select
                  labelInValue
                  placeholder={intl
                    .get(
                      'ide.src.page-manage.page-tag-sync.sync-list.step-one.aeuprk6e6c'
                    )
                    .d('请选择所属对象')}
                  style={{ width: '100%' }}
                  onSelect={v => this.selectObj(v)}
                  showSearch
                  optionFilterProp="children"
                >
                  {objList.map(item => (
                    <Option key={item.objId} value={item.objId}>
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
                  'ide.src.page-manage.page-tag-sync.sync-list.step-three.o5xmbmtg9qr'
                )
                .d('方案名称')}
            >
              {getFieldDecorator('name', {
                initialValue: schemeDetail.name,
                rules: [
                  { transform: value => value && value.trim() },
                  {
                    required: true,
                    message: intl
                      .get(
                        'ide.src.page-process.schema-list.drawer-one.vksmn9iajzl'
                      )
                      .d('方案名称不能为空'),
                  },
                  ...getNamePattern(),
                  // {max: 32, message: '输入不能超过32个字符'},
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
                      'ide.src.page-process.schema-list.drawer-one.leon38a3qh'
                    )
                    .d('请输入方案名称')}
                  disabled={!getFieldValue('objId')}
                />
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
                initialValue: schemeDetail.descr,
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
        </Spin>
        <div className="bottom-button">
          <Button style={{ marginRight: 8 }} onClick={() => this.closeDrawer()}>
            {intl
              .get('ide.src.component.modal-stroage-detail.main.ph80bkiru5h')
              .d('关闭')}
          </Button>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={this.nextStep}
          >
            {intl
              .get(
                'ide.src.page-manage.page-tag-model.data-sheet.config-field.kpiieqt46x'
              )
              .d('下一步')}
          </Button>
        </div>
      </div>
    )
  }
}
export default DrawerOne
