/**
 * @description 封装modol中常用的详情组件
 */
import {Component} from 'react'
import LabelItem from '../label-item'

export default class ModalDetail extends Component {
  static defaultProps = {
    labelWidth: 90,
  }

  render() {
    const {data, labelWidth} = this.props

    return (
      <div>
        {
          data.length ? data.map(item => <LabelItem labelWidth={labelWidth} label={item.name} value={item.value} />) : null
        }
      </div>
    )
  }
}
