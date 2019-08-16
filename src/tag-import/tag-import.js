import {Component} from 'react'
import {observable, action} from 'mobx'
import {observer, inject} from 'mobx-react'
import {Steps} from 'antd'
import cls from 'classnames'
import {navListMap} from '../common/constants'
import StepOne from './step-1'
import StepTwo from './step-2'
import StepThree from './step-3'
import store from './store-tag-import'

const {Step} = Steps

@inject('frameChange')
@observer
export default class TagImport extends Component {
  componentWillMount() {
    const {frameChange, match} = this.props
    frameChange('nav', [
      navListMap.assetMgt,
      navListMap.tagPool,
      {text: '导入类目及标签'},
    ])

    store.getTypeCodes()
  }

  render() {
    return (
      <div className="page-import p16">
        <Steps current={store.currStep} className="steps">
          <Step title="选择对象" />
          <Step title="选择导入的文件" />
          <Step title="预览数据" />
        </Steps>
        <div className={cls('FBV FBAC', {hide: store.currStep !== 0})}>
          <StepOne />
        </div>
        <div className={cls('FBV FBAC', {hide: store.currStep !== 1})}>
          <StepTwo />
        </div>
        <div className={cls('mt48', {hide: store.currStep !== 2})}>
          <StepThree />
        </div>
      </div>
    )
  }
}
