import {Component} from 'react'
import {observable, action, computed, toJS} from 'mobx'
import {observer, inject} from 'mobx-react'
import {Steps} from 'antd'
import cls from 'classnames'
import {navListMap} from '../common/constants'
import store from './store-tag-export'
import StepOne from './step-1'
import StepTwo from './step-2'

const Step = Steps.Step

@inject('frameChange')
@observer
export default class TagExport extends Component {
  componentWillMount() {
    this.props.frameChange('nav', [
      navListMap.assetMgt,
      {text: '后台类目', url: '/tag#/backend'},
      {text: '导出类目及标签'},
    ])
  }

  componentWillUnmount() {
    store.treeData.clear()
    store.cateList.clear()
    store.list.clear()
  }

  render() {
    return (
      <div className="p16">
        <Steps current={store.currStep} style={{width: '70%', margin: '24px auto'}}>
          <Step title="选择类目及标签" />
          <Step title="预览数据" />
        </Steps>

        <div className={cls('mt48', {hide: store.currStep !== 0})}>
          <StepOne />
        </div>
        <div className={cls('mt48', {hide: store.currStep !== 1})}>
          <StepTwo />
        </div>
      </div>
    )
  }
}
