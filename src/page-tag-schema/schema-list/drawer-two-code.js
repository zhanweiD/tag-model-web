/**
 * @description 
 */
import {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {action, observable} from 'mobx'
import cls from 'classnames'
import {Button, Icon, message} from 'antd'

import {SvgIcon} from '@dtwave/uikit'
import CodeMirror from 'codemirror'

// import sqlFormatter from 'sql-formatter'
import LogPanel from '../code-component/log-panel'

import yunxing from '../../icon-svg/yunxing.svg'
import zanting from '../../icon-svg/zanting.svg'


import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/sql-hint'
import 'codemirror/mode/sql/sql'
import 'codemirror/keymap/sublime'
// 引入keymap
import 'codemirror/addon/comment/comment'
import 'codemirror/addon/selection/active-line'


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

  componentWillMount() {

  }

  componentDidMount() {
    this.store.getHeight()

    if (document.getElementById('codeArea')) {
      this.store.editor = CodeMirror.fromTextArea(document.getElementById('codeArea'), {
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
        keyMap: 'sublime',
        theme: 'default',
      })
      // this.editor.setValue(sqlFormatter.format('SELECT * FROM table1'))
      // this.editor.setValue(sqlFormatter.format(toJS(this.props.store.sqlInfo), {language: 'n1ql', indent: '    '}))
    }
    this.store.editor.on('change', (instance, change) => this.checkIsCanHint(instance, change, 'sql'))
  }

  @action checkIsCanHint = (instance, change, type) => {
    console.log(instance, change, type)
    const {text} = change
    const {origin} = change
    let flag = false
    if (origin === '+input' && /\w|\./g.test(text[0]) && change.text[0].length === 1) {
      flag = true
    }
    
    if (flag && type) {
      this.store.editor.showHint(instance, {hint: CodeMirror.hint[type]}, true)
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
    console.log(this.store.editor.getValue())
  }

  render() {
    const {taskId} = this.store

    const logPanelConfig = {
      taskId,
      store: this.store,
    }

    console.log(this.store.isRuned)
    return (
      <div className="code-content">
        
        <div className="code-menu">
          {/* <span
            className={cls('FBH FBAC', {
              // noAllow: disabled,
            })}
          >
            <i className="iconfont dtwave icon-group15" />
            运行
          </span>
          <span
            className={cls('FBH FBAC', {
              // noAllow: disabled,
            })}
          >
            <i className="iconfont dtwave icon-tingzhi1" />
            运行
          </span> */}
          <span className="code-menu-item mr16" onClick={() => this.operationCode()}>
            <img src={yunxing} alt="img" />
            <span>运行</span>
          </span>
          <span className="code-menu-item" onClick={() => this.stopOperation()}>
            <img src={zanting} alt="img" />
            <span>停止</span>
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
          />
        </form>
        {/* <div
          id="log_area"
          className={
            cls({running_log: true})
          }
        >
          {
            this.store.isShowLog
              ? <div className="drag-bottom" onMouseDown={this.store.onDraggableLogMouseDown} />
              : null
          }
        </div> */}

        <LogPanel {...logPanelConfig} />
      </div>
    )
  }
}
