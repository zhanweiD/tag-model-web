import intl from 'react-intl-universal'
import { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Drawer, Steps, Button } from 'antd'
import { observer, inject } from 'mobx-react'
import { action, observable, toJS } from 'mobx'
import StepOne from './config-field-step-one'
import StepTwo from './config-field-step-two'
import StepThree from './config-field-step-three'

import store from './store-tag'

const { Step } = Steps

// Store的实例
// const store = {}

// 标签配置（字段->标签）

@inject('dataSheetStore')
@observer
class ConfigField extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired, // 是否显示
    // treeId: PropTypes.number.isRequired, // 树节点id
    // objId: PropTypes.number.isRequired, // 对象id
    // storageId: PropTypes.string.isRequired, // 数据源id
    // tableName: PropTypes.string.isRequired, // 数据表名
    onClose: PropTypes.func.isRequired, // 取消，关闭抽屉
    onSuccess: PropTypes.func, // 当保存标签成功时，要刷新页面相关数据，用个回调传进来
  }

  @observable currentStep = 0

  constructor(props) {
    super(props)
    const { projectId, objId, editSelectedItem } = props.dataSheetStore
    store.projectId = projectId
    store.objId = objId
    store.tableName = editSelectedItem.dataTableName
    store.storageId = editSelectedItem.dataStorageId
    // console.log(props, 'cf')
  }

  componentWillMount() {
    store.checkKeyWord()
  }

  componentWillUnmount() {
    store.initialList.clear()
    store.secondTableList.clear()
    store.cateList.clear()
    store.defaultCateId = undefined
    store.secondSelectedRows.clear()
    store.successResult = {}
    store.tagTypeList.clear()
    store.checkedPulish = true
  }

  render() {
    const { visible } = this.props

    const steps = [
      {
        title: intl
          .get(
            'ide.src.page-manage.page-tag-model.data-sheet.config-field.zobzgmm5y'
          )
          .d('选择字段'),
      },

      {
        title: intl
          .get(
            'ide.src.page-manage.page-tag-model.data-sheet.config-field.ctsk0hmfag'
          )
          .d('填写配置信息'),
      },

      {
        title: intl
          .get(
            'ide.src.page-manage.page-tag-model.data-sheet.config-field-step-three.7358fgalxex'
          )
          .d('创建成功'),
      },
    ]

    const Content = [StepOne, StepTwo, StepThree][this.currentStep]

    return (
      <Drawer
        title={intl
          .get(
            'ide.src.page-manage.page-tag-model.data-sheet.config-field.7i73j0om993'
          )
          .d('标签配置')}
        visible={visible}
        // width="73%"
        width={1120}
        onClose={this.onClose}
        maskClosable={false}
        destroyOnClose
      >
        {/* 步骤条 */}
        <Steps
          current={this.currentStep}
          style={{ padding: '0 100px', marginBottom: '32px' }}
        >
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>

        {/* 内容区域 */}
        <div style={{ paddingBottom: '28px' }}>
          <Content store={store} />
        </div>

        {/* 底部步骤控制按钮 */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}
        >
          {/* 第一步 */}
          {this.currentStep === 0 && (
            <Fragment>
              <Button className="mr8" onClick={this.onClose}>
                {intl
                  .get('ide.src.page-config.workspace-config.modal.xp905zufzth')
                  .d('取消')}
              </Button>
              <Button
                type="primary"
                disabled={!store.secondTableList.length}
                onClick={this.toStepTwo}
              >
                {intl
                  .get(
                    'ide.src.page-manage.page-tag-model.data-sheet.config-field.kpiieqt46x'
                  )
                  .d('下一步')}
              </Button>
            </Fragment>
          )}

          {/* 第二步 */}
          {this.currentStep === 1 && (
            <Fragment>
              <Button className="mr8" onClick={this.backToStepOne}>
                {intl
                  .get(
                    'ide.src.page-manage.page-tag-model.data-sheet.config-field.m6ae9pj50gh'
                  )
                  .d('上一步')}
              </Button>
              <Button
                type="primary"
                disabled={
                  // 错误条数为0
                  store.secondTableList.filter(item => !item.isTrue).length ||
                  // 或者标签个数也为0（可能全被删了）
                  !store.secondTableList.length
                }
                onClick={this.confirmStepTwo}
                loading={store.loadings.tagSaving}
              >
                {intl
                  .get('ide.src.page-config.workspace-config.modal.wrk0nanr55b')
                  .d('确定')}
              </Button>
            </Fragment>
          )}

          {/* 第三步 */}
          {this.currentStep === 2 && (
            <Button
              type="primary"
              onClick={() => {
                this.onClose()
              }}
            >
              {intl
                .get('ide.src.page-config.workspace-config.modal.wrk0nanr55b')
                .d('确定')}
            </Button>
          )}
        </div>
      </Drawer>
    )
  }

  // 关闭
  onClose = () => {
    const { onClose } = this.props
    onClose()
  }

  // 从第一步到第二步
  @action.bound toStepTwo() {
    store.checkTagList(() => {
      this.currentStep = 1
    })
  }

  // 从第二步回到第一步
  @action.bound backToStepOne() {
    this.currentStep = 0
    store.getInitialList()
  }

  // 从第二步“确定”，决定是不是要进入第三步
  @action.bound confirmStepTwo() {
    const { onSuccess = () => {} } = this.props

    store.saveTags(
      () => {
        // 加载结果数据
        store.getStorageDetail()

        // 保存成功的额外回调
        onSuccess()

        this.currentStep = 2
      },
      () => {
        // 保存失败的话，可能是这期间某些接口不能创建了，重新调用校验接口来更新数据
        store.checkTagList()
      }
    )
  }
}
export default ConfigField
