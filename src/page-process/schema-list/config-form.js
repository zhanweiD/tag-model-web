import {Component, Fragment} from 'react'
import {Radio, Tag, Button} from 'antd'
import {action} from 'mobx'
import {inject, observer} from 'mobx-react'

import {ModalForm} from '../../component'

@inject('store')
@observer
export default class ConfigDrawerOne extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  @action newTag = value => {
    this.store.isNewTag = value
  }
  @action checkName = (rule, value, callback) => {
    this.store.recheckName(value, callback)
  }
  @action checkEnName = (rule, value, callback) => {
    this.store.checkEnName(value, callback)
  }

  selectContent= () => {
    const {
      apiGroupList = [],
      release,
      tagList,
      isNewTag,
      cateList,
    } = this.store
    return [{
      label: '新建标签',
      key: 'newtag',
      initialValue: true,
      defaultChecked: true,
      disabled: release,
      onClick: v => this.newTag(v),
      component: 'switch',
    }, 
    {
      label: '标签名称',
      key: 'name',
      // initialValue: true,
      rules: isNewTag ? ([
        '@transformTrim',
        '@required',
        {validator: this.checkName},
      ]) : ([
        '@requiredSelect',
      ]),
      control: isNewTag ? null : ({
        options: tagList,
      }),
      disabled: release,
      component: isNewTag ? 'input' : 'select',
    }, {
      label: '唯一标识',
      key: 'enName',
      // initialValue: true,
      rules: [
        '@transformTrim',
        '@required',
        {validator: this.checkEnName},
      ],
      disabled: release,
      component: 'input',
    }, {
      label: '数据类型',
      key: 'valueType',
      initialValue: 2,
      rules: [
        '@requiredSelect',
      ],
      control: {
        options: [
          {
            name: '整数型',
            value: 2,
          }, {
            name: '小数型',
            value: 3,
          }, {
            name: '文本型',
            value: 4,
          }, {
            name: '日期型',
            value: 5,
          },
        ],
      },
      disabled: release,
      component: 'select',
    }, {
      label: '是否枚举',
      key: 'isEnum',
      initialValue: 0,
      rules: [
        '@requiredChecked',
      ],
      radios: [
        <Radio value={1}>是</Radio>,
        <Radio value={0}>否</Radio>,
      ],
      disabled: release,
      component: 'radioGroup',
    }, {
      label: '枚举显示值',
      key: 'map',
      // initialValue: true,
      disabled: release,
      autoSize: {minRows: 3, maxRows: 5},
      placeholder: '若标签值为枚举型，可将枚举代码值显示为易理解的值，例如：{0:女;1:男}',
      component: 'textArea',
    }, {
      label: '所属类目',
      key: 'cateId',
      // initialValue: true,
      rules: [
        '@requiredSelect',
      ],
      control: {
        options: cateList,
      },
      disabled: release,
      component: 'select',
    }, {
      label: '业务逻辑',
      key: 'descr',
      // initialValue: true,
      rules: [
        {max: 100, message: '业务逻辑不能超过100字'},
      ],
      disabled: release,
      autoSize: {minRows: 3, maxRows: 5},
      placeholder: '标签表示的业务逻辑，例如“该用户的手机号”，不超过100个字',
      component: 'textArea',
    }]
  }

  @action submit = () => {
    const {isConfig} = this.store
    if (isConfig) {
      // 取消配置
      // this.store.cancelConfig()
    } else {
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          // 配置
          // this.store.configField()
        }
      })
    }
    this.store.getFieldList()
  }

  render() {
    const {release, isConfig, recordObj} = this.store
    const {projectId} = recordObj
    const formConfig = {
      selectContent: this.selectContent(),
      disabled: true,
      wrappedComponentRef: form => { this.form = form ? form.props.form : form },
    }
    return (
      <Fragment>
        {
          projectId ? (
            <div className="config-form">
              <div className="form-header">
                <div>
                  <span className="fs14 mr8">字段名称</span>
                  <Tag color={release ? 'processing' : 'default'}>{release ? '已发布' : '未发布'}</Tag>
                </div>
                <div>
                  <Button type="primary" disabled={release} onClick={this.submit}>
                    {isConfig ? '取消配置' : '配置'}
                  </Button>
                </div>
              </div>
              <ModalForm {...formConfig} />
            </div>
          ) : (
            <div className="config-text">
              <div className="form-tooltip">
                点击左侧字段名称
                <br />
                配置标签
              </div>
            </div>
          )
        }
      </Fragment>
    )
  }
}
