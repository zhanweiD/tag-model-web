import {Component, Fragment} from 'react'
import PropTypes from 'prop-types'
import {
  Drawer, Steps, Button,
} from 'antd'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import StepOne from './step-one'
import StepTwo from './step-two'
import StepThree from './step-three'

import Store from './store'

const {Step} = Steps

// Store的实例
let store = {}

// 标签配置（字段->标签）
@observer
export default class TagConfiguration extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired, // 是否显示
    treeId: PropTypes.number.isRequired, // 树节点id
    objId: PropTypes.number.isRequired, // 对象id
    storageId: PropTypes.string.isRequired, // 数据源id
    tableName: PropTypes.string.isRequired, // 数据表名
    onClose: PropTypes.func.isRequired, // 取消，关闭抽屉
    onSuccess: PropTypes.func, // 当保存标签成功时，要刷新页面相关数据，用个回调传进来
  }

  state = {
    currentStep: 0,
  }

  constructor(props) {
    super(props)

    const {
      treeId, objId, storageId, tableName,
    } = props

    store = new Store({
      treeId, 
      objId, 
      storageId, 
      tableName,
    })

    // store = new Store({
    //   treeId, 
    //   objId: 5615659963970688, 
    //   storageId: '1565936664994p3tk', 
    //   tableName: 'bas_backend_tag_field',
    // })
  }

  render() {
    const {currentStep} = this.state
    const {visible, onSuccess = () => {}} = this.props

    const steps = [
      {
        title: '选择字段',
      },
      {
        title: '填写配置信息',
      },
      {
        title: '创建成功',
      },
    ]

    const Content = [StepOne, StepTwo, StepThree][currentStep]

    return (
      <Drawer
        title="配置标签"
        visible={visible}
        // width="73%"
        width={1020} // 大抽屉统一1020px
        onClose={this.onClose}
        maskClosable={false}
      >
        {/* 步骤条 */}
        <Steps current={currentStep} style={{padding: '0 100px', marginBottom: '32px'}}>
          {
            steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))
          }
        </Steps>

        {/* 内容区域 */}
        <div style={{paddingBottom: '28px'}}>
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
          {currentStep === 0 && (
            <Fragment>
              <Button 
                className="mr8"
                onClick={this.onClose}
              >
                取消
              </Button>
              <Button 
                type="primary" 
                disabled={!store.secondTableList.length}
                onClick={this.toStepTwo}
              >
                下一步
              </Button>
            </Fragment>
          )}
          {/* 第二步 */}
          {currentStep === 1 && (
            <Fragment>
              <Button 
                className="mr8"
                onClick={this.backToStepOne}
              >
                上一步
              </Button>
              <Button 
                type="primary" 
                disabled={
                  // 错误条数为0
                  store.secondTableList.filter(item => !item.isTrue).length 
                  // 或者标签个数也为0（可能全被删了）
                  || !store.secondTableList.length
                }
                onClick={this.confirmStepTwo}
                loading={store.loadings.tagSaving}
              >
                确定
              </Button>
            </Fragment>
          )}
          {/* 第三步 */}
          {currentStep === 2 && (
            <Button 
              type="primary"
              onClick={() => {
                this.onClose()
              }}
            >
              确定
            </Button>
          )}
        </div>
      </Drawer>
    )
  }

  // 关闭
  onClose = () => {
    const {onClose} = this.props
    onClose()
  }

  // 从第一步到第二步
  @action.bound toStepTwo() {
    store.checkTagList(() => {
      this.setState({
        currentStep: 1,
      })
    })
  }

  // 从第二步回到第一步
  @action.bound backToStepOne() {
    this.setState({
      currentStep: 0,
    })
    store.getInitialList()
  }

  // 从第二步“确定”，决定是不是要进入第三步
  @action.bound confirmStepTwo() {
    const {onSuccess = () => {}} = this.props

    store.saveTags(() => {
      // 加载结果数据
      store.getStorageDetail()
      
      // 保存成功的额外回调
      onSuccess()

      this.setState({
        currentStep: 2,
      })
    }, () => {
      console.log('保存失败')
      // 保存失败的话，可能是这期间某些接口不能创建了，重新调用校验接口来更新数据
      store.checkTagList()
    })
  }
}
