/**
 * @description 
 */
import {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {action, toJS} from 'mobx'
import cls from 'classnames'
import {
  message, 
  Tooltip,
} from 'antd'

import sqlFormatter from 'sql-formatter'
import LogPanel from '../code-component/log-panel'

import yunxing from '../../icon/yunxing.svg'
import geshihua from '../../icon/geshihua.svg'

@inject('rootStore')
@observer
export default class DrawerTwoCode extends Component {
  constructor(props) {
    super(props)

    const {drawerStore, codeStore} = props.rootStore

    this.drawerStore = drawerStore

    this.store = codeStore

    this.store.projectId = props.projectId
  }

  componentDidMount() {
    this.store.getHeight()

    if (document.getElementById('codeArea')) {
      this.store.editor = window.CodeMirror.fromTextArea(document.getElementById('codeArea'), {
        mode: 'text/x-mysql',
        autoCloseBrackets: true,
        matchBrackets: true,
        showCursorWhenSelecting: true,
        indentWithTabs: false,
        lineNumbers: true,
        dragDrop: false,
        indentUnit: 4,
        tabSize: 4,
        styleActiveLine: true,
        readOnly: false,
        // keyMap: 'sublime',
        theme: 'default',
      })

      const {schemeDetail} = this.drawerStore
      if (this.drawerStore.drawerType === 'edit' && schemeDetail.source) {
        this.store.editor.setValue(sqlFormatter.format(toJS(schemeDetail.source)), {language: 'n1ql', indent: '    '})
      }
    }

    this.store.editor.on('change', (instance, change) => this.checkIsCanHint(instance, change))
  }

  @action checkIsCanHint = (instance, change) => {
    const {text} = change
    const {origin} = change
    let flag = false
    if (origin === '+input' && /\w|\./g.test(text[0]) && change.text[0].length === 1) {
      flag = true

      this.store.editor.showHint(instance, {hint: window.CodeMirror.hint.sql}, true)
    }

    if (flag && this.store.runStatusMessage.status === 'success') {
      this.store.runStatusMessage.status = 'error'
    }
  }

  // 运行
  @action operationCode() {
    const {operationCode} = this.props

    const code = this.store.editor.getValue()
    if (!code) {
      message.error('请输入运行代码')
    } else {
      operationCode(code)
    }
  }

  // 停止
  @action stopOperation() {
    console.log(this.editor.getValue())
  }
  
  // 校验
  @action codeFormat() {
    const code = this.store.editor.getValue()
    if (!code) {
      message.error('请输入运行代码')
    } else {
      this.store.editor.setValue(sqlFormatter.format(code), {language: 'n1ql', indent: '    '})
    }
  }

  render() {
    const {taskId, runLoading} = this.store

    const logPanelConfig = {
      taskId,
      store: this.store,
    }

    const {schemeDetail} = this.drawerStore

    return (
      // <Spin spinning={runLoading} tip="运行中...">
      <div className="code-content">
       
        <div className="code-menu">
          {
            runLoading ? (
              <Tooltip placement="topRight" title="正在运行中，不可重复运行">
                <span className="mr16 disabled">
                  <img src={yunxing} alt="img" />
                  <span>运行</span>
                </span>
              </Tooltip>
            
            ) : (
              <span className="code-menu-item mr16" onClick={() => this.operationCode()}>
                <img src={yunxing} alt="img" />
                <span>运行</span>
              </span>
            )
          }
        
          <span className="code-menu-item mr16" onClick={() => this.codeFormat()}>
            <img src={geshihua} alt="img" />
            <span>格式化</span>
          </span>
        </div>
        <form
          id="code_area"
          className={cls({
            new_codearea: true,
            new_codearea_nolog: !this.store.isRuned,
            max_height: this.store.isRuned,
          })}
        >
          <textarea
            id="codeArea"
            ref={t => this.codeArea = t}
            placeholder="code goes here..."
          >
            {
              toJS(schemeDetail.source)
            }
          </textarea>
        </form>   
        <LogPanel {...logPanelConfig} />
   
      </div>
      // </Spin>
    )
  }
}
