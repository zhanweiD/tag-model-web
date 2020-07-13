/**
 * @description 标签仓库-标签体系-标签详情
 */
import {Component} from 'react'
import {DetailHeader} from '../../../component'
import {Time} from '../../../common/util'
import TagAnalyze from '../../../business-component/tag-analyze'

export default class Detail extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  render() {
    const {tagDetail} = this.store

    const baseInfo = [{
      title: '对象',
      value: tagDetail.objName,
    }, {
      title: '唯一标识',
      value: tagDetail.enName,
    }, {
      title: '数据类型',
      value: tagDetail.valueTypeName,
    }, {
      title: '创建者',
      value: tagDetail.creator,
    }, {
      title: '创建时间',
      value: <Time timestamp={tagDetail.createTime} />,
    }, {
      title: '绑定方式',
      value: tagDetail.configType === 1 ? '衍生标签' : '基础标签',
    }, {
      title: '所属项目',
      value: tagDetail.tableName,
    }]

    return (
      <div className="detail-content">
        <DetailHeader
          name={tagDetail.name}
          descr={tagDetail.descr}
          baseInfo={baseInfo}
        />
        <div className="bgf mt16 ">
          <TagAnalyze />
        </div>
      </div>
    )
  }
}
