/**
 * @description 标签仓库-标签体系-标签详情
 */
import {Component} from 'react'
import {Button, Spin} from 'antd'
import {action} from 'mobx'
import {inject, observer} from 'mobx-react'

import {DetailHeader, Tag, NoData, Authority} from '../../../component'
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
      title: '标签标识',
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
    const baseInfo1 = [{
      title: '对象',
      value: tagDetail.objName,
    }, {
      title: '标签标识',
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
    }]

    // 不同状态的相应map
    const tagMap = {
      2: <Tag status="success" text="有权限" />,
      1: <Tag status="process" text="审批中" />,
    }
    const actions = [
      <Authority authCode="tag_model:apply_tag[c]">
        <Button 
        // className="mr8" 
          type="primary" 
          // style={{display: !authorStatus && projectId !== useProjectId ? 'block' : 'none'}}
          style={{display: !authorStatus ? 'block' : 'none'}}
          onClick={this.viewRule}
        >
        申请权限
        </Button>
      </Authority>,
    ]
    const noDataConfig = {
      text: '暂无数据',
    }
    console.log(tagDetail.isMajor)
    return (
      <div className="detail-content">
        {
          selectedKey ? (
            <Spin spinning={detailLoading}>
              <div className="box-border">
                <DetailHeader
                  name={tagDetail.name}
                  descr={tagDetail.descr}
                  baseInfo={tagDetail.isMajor ? baseInfo1 : baseInfo}
                  tag={commonTag ? tagMap[authorStatus] : null}
                  // actions={actions}
                />
              </div>
              <div className="box-border mt16 min-h">
                {tagDetail.isEnum ? <TagAnalyze tagId={selectedKey} authorStatus={authorStatus} /> : null}
                <TagTrend key={selectedKey} tagId={selectedKey} />
              </div>
            </Spin>
          ) : <div className="box-border" style={{paddingTop: '15%', minHeight: 'calc(100vh - 181px)'}}><NoData {...noDataConfig} /></div>
        }
        <TagApply store={this.store} />
      </div>
    )
  }
}
