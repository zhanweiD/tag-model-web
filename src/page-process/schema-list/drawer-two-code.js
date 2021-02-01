import intl from 'react-intl-universal'
/**
 * @description 运行code
 */
import { Component, Fragment } from 'react'
import { observer, inject } from 'mobx-react'
import { action, toJS } from 'mobx'
import cls from 'classnames'
import { message, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import sqlFormatter from 'sql-formatter'
import LogPanel from '../code-component/log-panel'

// import yunxing from '../../icon/yunxing.svg'
// import geshihua from '../../icon/geshihua.svg'

@inject('rootStore')
@observer
class DrawerTwoCode extends Component {
  constructor(props) {
    super(props)

    const { drawerStore, codeStore } = props.rootStore

    this.drawerStore = drawerStore

    this.store = codeStore

    this.store.projectId = props.projectId
  }

  componentDidMount() {
    this.store.getHeight()
    this.configCode(this.props.promptData)
  }

  configCode = data => {
    // if (!data.ttt) return
    if (document.getElementById('codeArea')) {
      this.store.editor = window.CodeMirror.fromTextArea(
        document.getElementById('codeArea'),
        {
          // 格式化输入code为sql格式
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
          hintOptions: {
            // 自定义提示选项
            completeSingle: false, // 当匹配只有一项的时候是否自动补全
            tables: data,
          },
        }
      )

      const { schemeDetail } = this.drawerStore
      if (this.drawerStore.drawerType === 'edit' && schemeDetail.source) {
        // source运行code，如果是编辑将code转为
        this.store.editor.setValue(
          sqlFormatter.format(toJS(schemeDetail.source)),
          { language: 'n1ql', indent: '    ' }
        )
      }
      this.store.editor.on('change', (instance, change) =>
        this.checkIsCanHint(instance, change)
      )
    }
  }

  // 输入提示
  @action checkIsCanHint = (instance, change) => {
    const { text } = change
    const { origin } = change
    let flag = false
    if (
      origin === '+input' &&
      /\w|\./g.test(text[0]) &&
      change.text[0].length === 1
    ) {
      flag = true

      this.store.editor.showHint(
        instance,
        { hint: window.CodeMirror.hint.sql },
        true
      )
    }

    if (flag && this.store.runStatusMessage.status === 'success') {
      this.store.runStatusMessage.status = 'error'
    }
  }

  // 运行
  @action operationCode() {
    const { operationCode } = this.props

    const code = this.store.editor.getValue()
    if (!code) {
      message.error(
        intl
          .get('ide.src.page-process.schema-list.drawer-two-code.mohvx2ntaeg')
          .d('请输入运行代码')
      )
    } else {
      operationCode(code)
    }
  }

  // 停止
  @action stopOperation() {
    this.store.stopInstance()
  }

  // 格式化校验
  @action codeFormat() {
    const code = this.store.editor.getValue()
    if (!code) {
      message.error(
        intl
          .get('ide.src.page-process.schema-list.drawer-two-code.mohvx2ntaeg')
          .d('请输入运行代码')
      )
    } else {
      this.store.editor.setValue(sqlFormatter.format(code), {
        language: 'n1ql',
        indent: '    ',
      })
    }
  }

  render() {
    const { taskId, runLoading } = this.store
    const logPanelConfig = {
      taskId,
      store: this.store,
    }

    // 不要注掉promptData,否则会导致该组件拿不到更新后的promptData，导致智能提示失效
    const { schemeDetail } = this.drawerStore

    return (
      // <Spin spinning={runLoading} tip="运行中...">
      <div className="code-content">
        <div className="code-menu">
          {runLoading ? (
            <Fragment>
              <Tooltip
                placement="topRight"
                title={intl
                  .get(
                    'ide.src.page-process.schema-list.drawer-two-code.sx4six7pkh'
                  )
                  .d('正在运行中，不可重复运行')}
              >
                <span className="mr16 disabled">
                  <i className="iconfont dtwave icon-run" />
                  <span>
                    {intl
                      .get(
                        'ide.src.page-process.schema-list.drawer-two-code.xkjtzlkklch'
                      )
                      .d('运行')}
                  </span>
                </span>
              </Tooltip>
              <span
                className="code-menu-item mr16"
                onClick={() => this.stopOperation()}
              >
                <i
                  className="iconfont dtwave icon-tingzhi1"
                  style={{ lineHeight: '36px' }}
                />
                <span>
                  {intl
                    .get(
                      'ide.src.page-process.schema-list.drawer-two-code.tdfyvw66olg'
                    )
                    .d('停止')}
                </span>
              </span>
            </Fragment>
          ) : (
            <Fragment>
              <span
                className="code-menu-item mr16"
                onClick={() => this.operationCode()}
              >
                <i className="iconfont dtwave icon-run" />
                <span>
                  {intl
                    .get(
                      'ide.src.page-process.schema-list.drawer-two-code.xkjtzlkklch'
                    )
                    .d('运行')}
                </span>
              </span>
              <span className="mr16 disabled">
                <i
                  className="iconfont dtwave icon-tingzhi1"
                  style={{ lineHeight: '36px' }}
                />
                <span>
                  {intl
                    .get(
                      'ide.src.page-process.schema-list.drawer-two-code.tdfyvw66olg'
                    )
                    .d('停止')}
                </span>
              </span>
            </Fragment>
          )}

          <span
            className="code-menu-item mr16"
            onClick={() => this.codeFormat()}
          >
            <i className="iconfont dtwave icon-geshihua1" />
            <span>
              {intl
                .get(
                  'ide.src.page-process.schema-list.drawer-two-code.c0h2be35k0k'
                )
                .d('格式化')}
            </span>
          </span>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`${window.__keeper.pathHrefPrefix}/process/tql-explain`}
            style={{ marginLeft: '-8px' }}
          >
            <QuestionCircleOutlined />
          </a>
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
            ref={t => (this.codeArea = t)}
            placeholder="code goes here..."
          >
            {toJS(schemeDetail.source)}
          </textarea>
        </form>
        <LogPanel {...logPanelConfig} projectId={this.store.projectId} />
      </div>
      // </Spin>
    )
  }
}
export default DrawerTwoCode
