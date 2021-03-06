import intl from 'react-intl-universal'
/**
 * @description 创建加工方案
 */
import { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { action } from 'mobx'
import { Drawer, Steps, Modal } from 'antd'
import { CycleSelect } from '@dtwave/uikit'
import DrawerOne from './drawer-one'
import DrawerTwo from './drawer-two'
import DrawerThree from './drawer-three'
import DrawerFour from './drawer-four'
import { cycleSelectMap } from '../util'

const { Step } = Steps

@inject('rootStore')
@observer
class DrawerConfig extends Component {
  constructor(props) {
    super(props)
    const { drawerStore, codeStore } = props.rootStore

    this.store = drawerStore
    this.codeStore = codeStore
    this.store.projectId = props.projectId
  }

  @action.bound closeDrawer() {
    const t = this
    const { schemeDetail, currentStep } = this.store

    if (+currentStep !== 3) {
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
          // 第一步退出保存
          if (+currentStep === 0) {
            t.store.oneForm.validateFieldsAndScroll((err, values) => {
              if (err) {
                return
              }
              // 保存后更新store中加工详情数据
              t.store.schemeDetail.objId = Array.isArray(values.objId)
                ? values.objId[0].key
                : values.objId.key
              t.store.schemeDetail.objName = Array.isArray(values.objId)
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
          }

          // 第二步退出保存
          if (+currentStep === 1) {
            t.store.paramsForm.validateFieldsAndScroll((err, values) => {
              if (err) {
                return
              }

              // 运行参数对象
              const parameterMappingKeys = {}
              Object.values(values).forEach(d => {
                parameterMappingKeys[d.key] = d.value
              })

              t.store.schemeDetail.parameterMappingKeys = parameterMappingKeys
              const source = this.codeStore.editor.getValue()
              t.store.schemeDetail.source = source

              t.store.saveSchema({
                status: 0,
              })
              // 保存
            })
          }

          // 第3步退出保存
          if (+currentStep === 2) {
            t.store.drawerThreeForm.validateFieldsAndScroll((err, values) => {
              if (err) {
                return
              }

              if (values.zoneParams) {
                const { isPartitioned, key, value } = values.zoneParams
                this.store.schemeDetail.isPartitioned = isPartitioned ? 1 : 0 // 是否分区

                if (isPartitioned) {
                  this.store.schemeDetail.partitionMappingKeys = [
                    { partitionFieldName: key, partitionFieldValue: value },
                  ]
                } else {
                  this.store.schemeDetail.partitionMappingKeys = []
                }
              } else {
                this.store.schemeDetail.isPartitioned = 0
                this.store.schemeDetail.partitionMappingKeys = []
              }

              // 调度周期时间
              if (values.scheduleExpression) {
                this.store.schemeDetail.scheduleExpression =
                  values.scheduleExpression

                const expression = CycleSelect.cronSrialize(
                  values.scheduleExpression
                ) // 转化时间格式
                this.store.schemeDetail.period =
                  cycleSelectMap[expression.cycle] // 调度周期
                this.store.schemeDetail.periodTime = expression.time // 调度时间
              }

              // 主标签
              const mainTagMappingKeys =
                schemeDetail.obj &&
                schemeDetail.obj.map((d, i) => ({
                  objId: d.id,
                  columnName: values[`majorTag${i}`], // ？？？
                }))

              this.store.schemeDetail.mainTagMappingKeys = mainTagMappingKeys // 主标签
              this.store.schemeDetail.scheduleType = values.scheduleType // 调度类型

              t.store.saveSchema(
                {
                  status: 0,
                },
                'close'
              ) // 保存
            })
          }
        },
        onCancel: () => t.store.closeDrawer(),
      })
    } else {
      t.store.closeDrawer()
    }
  }

  render() {
    const {
      drawerVisible,
      drawerType,
      currentStep,
      // closeDrawer,
    } = this.store

    const { projectId } = this.props

    const drawerConfig = {
      width: 1120,
      title:
        drawerType === 'edit'
          ? intl
              .get('ide.src.page-process.schema-list.drawer.wpqsbs6wisc')
              .d('编辑加工方案')
          : intl
              .get('ide.src.page-process.schema-list.drawer.exqsb5ca7ap')
              .d('新建加工方案'),
      maskClosable: false,
      destroyOnClose: true,
      visible: drawerVisible,
      onClose: this.closeDrawer,
    }

    return (
      <Drawer {...drawerConfig}>
        <div className="processe-config">
          <Steps
            current={currentStep}
            size="small"
            className="processe-config-step"
          >
            <Step
              title={intl
                .get(
                  'ide.src.page-manage.page-object-model.tree-drawer-object.ptd7orh6gg'
                )
                .d('基础信息')}
            />
            <Step
              title={intl
                .get(
                  'ide.src.page-process.schema-detail.config-info.ca3eiune9je'
                )
                .d('逻辑配置')}
            />
            <Step
              title={intl
                .get('ide.src.page-process.schema-list.drawer.ue4y549a00i')
                .d('任务配置')}
            />
            <Step
              title={intl
                .get('ide.src.page-config.workspace-config.main.91qopphasx')
                .d('添加成功')}
            />
          </Steps>
          <div className="processe-content">
            <DrawerOne
              show={currentStep === 0}
              wrappedComponentRef={form =>
                (this.store.oneForm = form ? form.props.form : form)
              }
            />

            <DrawerTwo show={currentStep === 1} projectId={projectId} />

            <DrawerThree
              show={currentStep === 2}
              projectId={projectId}
              wrappedComponentRef={form =>
                (this.store.drawerThreeForm = form ? form.props.form : form)
              }
            />

            <DrawerFour show={currentStep === 3} projectId={projectId} />
          </div>
        </div>
      </Drawer>
    )
  }
}
export default DrawerConfig
