/**
 * @description 创建加工方案
 */
import {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {action} from 'mobx'
import {Drawer, Steps, Modal} from 'antd'
import {CycleSelect} from '@dtwave/uikit'
import DrawerOne from './drawer-one'
import DrawerTwo from './drawer-two'
import DrawerThree from './drawer-three'
import DrawerFour from './drawer-four'
import {cycleSelectMap} from '../util'

const {Step} = Steps

@inject('rootStore')
@observer
export default class DrawerConfig extends Component {
  constructor(props) {
    super(props)
    const {drawerStore, codeStore} = props.rootStore

    this.store = drawerStore
    this.codeStore = codeStore
    this.store.projectId = props.projectId
  }

  @action.bound closeDrawer() {
    const t = this
    const {schemeDetail, currentStep} = this.store

    if (+currentStep !== 3) {
      Modal.confirm({
        title: '是否保存方案',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          // 第一步退出保存
          if (+currentStep === 0) {
            t.store.oneForm.validateFieldsAndScroll((err, values) => {
              if (err) {
                return
              } 
    
              t.store.schemeDetail.objId = Array.isArray(values.objId) ? values.objId[0].key : values.objId.key
              t.store.schemeDetail.objName = Array.isArray(values.objId) ? values.objId[0].label : values.objId.label
              t.store.schemeDetail.name = values.name
              t.store.schemeDetail.descr = values.descr
              t.store.schemeDetail.obj = t.obj || schemeDetail.obj
    
              t.store.saveSchema({
                status: 0,
              }) // 保存
            })
          }

          // 第二步退出保存
          if (+currentStep === 1) {
            t.store.paramsForm.validateFieldsAndScroll((err, values) => {
              if (err) {
                return
              } 
              
              const parameterMappingKeys = {}
              Object.values(values).forEach(d => {
                parameterMappingKeys[d.key] = d.value
              })

              t.store.schemeDetail.parameterMappingKeys = parameterMappingKeys
              const source = this.codeStore.editor.getValue()
              t.store.schemeDetail.source = source
  
              t.store.saveSchema({
                status: 0,
              }) // 保存
            })
          }

          // 第3步退出保存
          if (+currentStep === 2) {
            t.store.drawerThreeForm.validateFieldsAndScroll((err, values) => {
              if (err) {
                return
              } 
 
              
              if (values.zoneParams) {
                const {
                  isPartitioned, key, value,
                } = values.zoneParams
                this.store.schemeDetail.isPartitioned = isPartitioned ? 1 : 0

                if (isPartitioned) {
                  this.store.schemeDetail.partitionMappingKeys = [{partitionFieldName: key, partitionFieldValue: value}]
                } else {
                  this.store.schemeDetail.partitionMappingKeys = []
                }
              } else {
                this.store.schemeDetail.isPartitioned = 0
                this.store.schemeDetail.partitionMappingKeys = []
              }
 
              if (values.scheduleExpression) {
                this.store.schemeDetail.scheduleExpression = values.scheduleExpression

                const expression = CycleSelect.cronSrialize(values.scheduleExpression)
                this.store.schemeDetail.period = cycleSelectMap[expression.cycle]
                this.store.schemeDetail.periodTime = expression.time
              }

              const mainTagMappingKeys = schemeDetail.obj && schemeDetail.obj.map((d, i) => ({
                objId: d.id,
                columnName: values[`majorTag${i}`],
              }))
      
              this.store.schemeDetail.mainTagMappingKeys = mainTagMappingKeys
              this.store.schemeDetail.scheduleType = values.scheduleType

              t.store.saveSchema({
                status: 0,
              }, 'close') // 保存
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

    const {
      projectId,
    } = this.props

    const drawerConfig = {
      width: 1120,
      title: drawerType === 'edit' ? '编辑加工方案' : '新建加工方案',
      maskClosable: false,
      destroyOnClose: true,
      visible: drawerVisible,
      onClose: this.closeDrawer,
    }

    return (
      <Drawer {...drawerConfig}>
        <div className="processe-config">
          <Steps current={currentStep} size="small" className="processe-config-step">
            <Step title="基础信息" />
            <Step title="逻辑配置" />
            <Step title="任务配置" />
            <Step title="添加成功" />
          </Steps>
          <div className="processe-content">
            <DrawerOne 
              show={currentStep === 0} 
              wrappedComponentRef={form => this.store.oneForm = form ? form.props.form : form}
            />
            <DrawerTwo 
              show={currentStep === 1} 
              projectId={projectId}
            />
            <DrawerThree 
              show={currentStep === 2} 
              projectId={projectId}
              wrappedComponentRef={form => this.store.drawerThreeForm = form ? form.props.form : form}
            />
            <DrawerFour 
              show={currentStep === 3} 
              projectId={projectId} 
            />
          </div>
        </div>        
      </Drawer>     
    )
  }
}
