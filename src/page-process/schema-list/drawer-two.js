/**
 * @description 创建加工方案 - 逻辑配置
 */
import {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {action, toJS} from 'mobx'
import {Button} from 'antd'

import {Loading} from '../../component'
import DrawerTwoTree from './drawer-two-tree'
import DrawerTwoCode from './drawer-two-code'
import DrawerTwoParams from './drawer-two-params'

import './code.styl'


@inject('rootStore')
@observer
export default class DrawerTwo extends Component {
  constructor(props) {
    super(props)
    this.store = props.rootStore.drawerStore
    this.codeStore = props.rootStore.codeStore
  }

  // 运行
  @action.bound operationCode(code) {
    this.store.paramsForm.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      } 
      const parameterMappingKeys = {}
      Object.values(values).forEach(d => {
        parameterMappingKeys[d.key] = d.value
      })

      this.store.schemeDetail.source = code
      this.store.schemeDetail.parameterMappingKeys = parameterMappingKeys

      // 运行任务
      this.codeStore.runTask({
        source: code,
        parameterMappingKeys,
      }, data => {
        this.store.schemeDetail.fieldInfo = data.fieldInfo
      })
    })
  }

  @action.bound nextStep() {
    this.store.schemeDetail.fieldInfo = this.codeStore.fieldInfo
    this.store.nextStep()
  }
  
  render() {
    const {show, projectId} = this.props
    const {runStatusMessage} = this.codeStore
    const {treeLoading} = this.store
    
    return (
      <div style={{display: show ? 'block' : 'none'}} className="logic-config">
        <div className="FBH">
          <DrawerTwoTree />
          {
            !treeLoading ? (
              <DrawerTwoCode promptData={this.store.promptData} operationCode={this.operationCode} projectId={projectId} />
            ) : <div className="code-content border-d9"><Loading mode="block" height={100} /></div>
          }
          <DrawerTwoParams 
            wrappedComponentRef={form => this.store.paramsForm = form ? form.props.form : form}
          />
        </div>
        
        <div className="bottom-button">
          <Button style={{marginRight: 8}} onClick={() => this.store.lastStep()}>上一步</Button>
          <Button
            type="primary"
            style={{marginRight: 8}}
            onClick={this.nextStep}
            disabled={runStatusMessage.status === 'error' || runStatusMessage.status === ''}
          >
            下一步
          </Button>
        </div>
      </div>
    )
  }
}
