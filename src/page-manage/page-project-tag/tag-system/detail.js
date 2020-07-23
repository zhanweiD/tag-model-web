/**
 * @description 标签仓库-标签体系-标签详情
 */
import {Component} from 'react'
import {Button} from 'antd'
import {action} from 'mobx'
import {inject, observer} from 'mobx-react'

import {DetailHeader, Tag} from '../../../component'
import {Time} from '../../../common/util'
import TagAnalyze from '../../../business-component/tag-analyze'
import TagTrend from '../../../business-component/tag-trend'
import TagApply from './modal-apply'

@inject('store')
@observer
export default class Detail extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  @action viewRule = () => {
    this.store.getProjectDetail()
    this.store.visible = true
  }

  render() {
    const {tagDetail} = this.store
    const {status, projectId, id} = tagDetail
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

    // 不同状态的相应map
    const tagMap = {
      1: <Tag status="success" text="有权限" />,
      2: <Tag status="process" text="审核中" />,
    }
    const actions = [
      <Button 
        className="mr8" 
        type="primary" 
        style={{display: !status && projectId ? 'block' : 'none'}}
        onClick={this.viewRule}
      >
        申请权限
      </Button>,
    ]

    return (
      <div className="detail-content">
        <DetailHeader
          name={tagDetail.name}
          descr={tagDetail.descr}
          baseInfo={baseInfo}
          tag={tagMap[status]}
          actions={actions}
        />
        <div className="bgf mt16 ">
          <TagAnalyze tagId={id} status={status} />
          <TagTrend tagId={id} />
        </div>
        <TagApply store={this.store} />
      </div>
    )
  }
}
