/**
 * @description 
 */
import {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {action, observable} from 'mobx'
import {Button, Tabs} from 'antd'

import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/sql-hint'
import 'codemirror/mode/sql/sql'

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

  @action.bound operationCode(code) {
    this.paramsForm.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      } 

      const parameterMappingKeys = Object.values(values).map(d => ({
        partitionFieldName: d.key,
        partitionFieldValue: d.value,
      }))
      console.log({
        source: code,
        parameterMappingKeys,
      })
      this.codeStore.runTask({
        source: code,
        parameterMappingKeys,
      }, data => {
        this.store.schemeDetail.fieldInfo = data.fieldInfo
      })
    })
  }
  
  render() {
    const {show, projectId} = this.props
    const {runStatusMessage} = this.codeStore

    return (
      <div style={{display: show ? 'block' : 'none'}} className="logic-config">
        <div className="FBH">
          <DrawerTwoTree />
          <DrawerTwoCode operationCode={this.operationCode} projectId={projectId} />
          <DrawerTwoParams wrappedComponentRef={form => this.paramsForm = form ? form.props.form : form} />
        </div>
        <div className="bottom-button">
          <Button style={{marginRight: 8}} onClick={() => this.store.lastStep()}>上一步</Button>
          <Button
            type="primary"
            style={{marginRight: 8}}
            onClick={this.store.nextStep}
            disabled={runStatusMessage.status === 'error' || runStatusMessage.status === ''}
          >
            下一步
          </Button>
        </div>
      </div>
    )
  }
}
