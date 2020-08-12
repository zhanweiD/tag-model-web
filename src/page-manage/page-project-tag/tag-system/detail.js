/**
 * @description 标签仓库-标签体系-标签详情
 */
import {Component, Fragment} from 'react'
import {Button, Spin} from 'antd'
import {action, toJS} from 'mobx'
import {inject, observer} from 'mobx-react'

import {DetailHeader, Tag, NoData} from '../../../component'
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
    this.store.projectId = props.projectId
  }

  @action viewRule = () => {
    this.store.getProjectDetail()
    this.store.modalApplyVisible = true
  }

  render() {
    const {detailLoading, tagDetail, selectedKey, projectId, useProjectId} = this.store
    const {authorStatus} = tagDetail
    const {commonTag} = this.props

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
      value: tagDetail.projectName,
    }]

    // 不同状态的相应map
    const tagMap = {
      2: <Tag status="success" text="有权限" />,
      1: <Tag status="process" text="审批中" />,
    }
    const actions = [
      <Button 
        className="mr8" 
        type="primary" 
        // style={{display: !authorStatus && projectId !== useProjectId ? 'block' : 'none'}}
        style={{display: !authorStatus ? 'block' : 'none'}}
        onClick={this.viewRule}
      >
        申请权限
      </Button>,
    ]
    const noDataConfig = {
      text: '请选择标签',
    }
    return (
      <div className="detail-content">
        {/* { */}
        {/* // selectedKey ? ( */}
        <Spin spinning={detailLoading}>
          <DetailHeader
            name={tagDetail.name}
            descr={tagDetail.descr}
            baseInfo={baseInfo}
            tag={commonTag ? tagMap[authorStatus] : null}
            actions={actions}
          />
        </Spin>
        <div className="bgf mt16 min-h">
          {tagDetail.isEnum ? <TagAnalyze tagId={selectedKey} status={authorStatus} /> : null}
          <TagTrend key={selectedKey} tagId={selectedKey} />
        </div>
        {/* ) : <NoData {...noDataConfig} /> */}
        {/* } */}
        <TagApply store={this.store} />
      </div>
    )
  }
}
