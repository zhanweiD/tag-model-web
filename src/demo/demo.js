import React, {useEffect, useState, useRef} from 'react'
import {Form, Input, Button, ConfigProvider} from 'antd'

export default function demo(props) {
  const editor = useRef(null)
  const codeArea = useRef(null)
  // const [editor, setEditor] = useState(null) 
  const formItemLayout = {
    labelCol: {
      xs: {span: 24},
      sm: {span: 8},
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 16},
    },
  }
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  }
  const arr = [
    {
      name: 'a',
      child: [
        {
          name: 'b',
        }, {
          name: 'c',
        },
      ],
    }, {
      name: 'd',
    },
  ]

  // 输入提示
  function checkIsCanHint(instance, change) {
    const {text} = change
    const {origin} = change
    
    let flag = false
    if (origin === '+input' && /\w|\./g.test(text[0]) && change.text[0].length === 1) {
      flag = true

      editor.current.showHint(instance, {hint: window.CodeMirror.hint.sql}, true)
    }

    // if (flag && this.store.runStatusMessage.status === 'success') {
    //   this.store.runStatusMessage.status = 'error'
    // }
  }

  useEffect(() => {
    const obj = {}
    arr.forEach(item => {
      const arr1 = []
      if (item.child) {
        item.child.forEach(i => arr1.push(i.name))
      }
      obj[item.name] = arr1
    })
    if (codeArea.current) {
      editor.current = window.CodeMirror.fromTextArea(codeArea.current, { // 格式化输入code为sql格式
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
        hintOptions: { // 自定义提示选项
          completeSingle: false, // 当匹配只有一项的时候是否自动补全
          // tables: {
          //   // users: ['name', 'score', 'birthDate'],
          //   // countries: ['name', 'population', 'size'],
          //   // score: ['zooao'],
          //   hive123: ['field312'], // 表：[字段]
            
          // },
          tables: obj,
        },
      })
      editor.current.on('change', (instance, change) => checkIsCanHint(instance, change))
    }
  }, [])

  return (
    <div style={{width: '525px', margin: '48px'}}>
      <ConfigProvider
        componentSize="small"
      >
        <Form
          {...formItemLayout}
          onFinish={value => {
            value.code = editor.current.getValue()
            console.log(value)
          }}
        >
          <Form.Item
            name="email"
            label="E-mail"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="code"
            label="sql定义"
          >
            <textarea
              id="codeArea"
              ref={t => codeArea.current = t}
              placeholder="请输入select查询语句，查询结果将被作为一张虚拟表。"
            />
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
          确认
            </Button>
          </Form.Item>
        </Form>
      </ConfigProvider>
    </div>
  )
}
