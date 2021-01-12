import intl from 'react-intl-universal'
/**
 * @description 标签仓库-标签体系-标签详情
 */
import { Component } from 'react'
import { Button, Spin } from 'antd'
import { action } from 'mobx'
import { inject, observer } from 'mobx-react'

import { DetailHeader, Tag, NoData, Authority } from '../../../component'
import { Time } from '../../../common/util'
import TagAnalyze from '../../../business-component/tag-analyze'
import TagTrend from '../../../business-component/tag-trend'
import TagApply from './modal-apply'

@inject('store')
@observer
class Detail extends Component {
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
    const {
      detailLoading,
      tagDetail,
      selectedKey,
      projectId,
      useProjectId,
    } = this.store
    const { authorStatus } = tagDetail
    const { commonTag } = this.props

    const baseInfo = [
      {
        title: intl
          .get(
            'ide.src.page-manage.page-aim-source.source-detail.modal.hdb36gt6rzf'
          )
          .d('对象'),
        value: tagDetail.objName,
      },
      {
        title: intl
          .get('ide.src.business-component.tag-relate.dag-box.xs30zaqk60p')
          .d('标签标识'),
        value: tagDetail.enName,
      },
      {
        title: intl
          .get('ide.src.business-component.tag-relate.dag-box.zfaw0a4v7jh')
          .d('数据类型'),
        value: tagDetail.valueTypeName,
      },
      {
        title: intl
          .get('ide.src.page-manage.page-common-tag.detail.main.hv8quje3qk')
          .d('创建者'),
        value: tagDetail.creator,
      },
      {
        title: intl
          .get(
            'ide.src.page-manage.page-aim-source.source-detail.main.2vp94m4091h'
          )
          .d('创建时间'),
        value: <Time timestamp={tagDetail.createTime} />,
      },
      {
        title: intl
          .get('ide.src.page-manage.page-common-tag.detail.main.2ziwjluj78c')
          .d('绑定方式'),
        value:
          tagDetail.configType === 1
            ? intl
                .get(
                  'ide.src.page-manage.page-common-tag.detail.main.mfs279f7xcc'
                )
                .d('衍生标签')
            : intl
                .get(
                  'ide.src.page-manage.page-common-tag.detail.main.vwwmvcib39m'
                )
                .d('基础标签'),
      },
      {
        title: intl
          .get('ide.src.component.comp.search.h5l3m6s8dn7')
          .d('所属项目'),
        value: tagDetail.projectName,
      },
    ]

    const baseInfo1 = [
      {
        title: intl
          .get(
            'ide.src.page-manage.page-aim-source.source-detail.modal.hdb36gt6rzf'
          )
          .d('对象'),
        value: tagDetail.objName,
      },
      {
        title: intl
          .get('ide.src.business-component.tag-relate.dag-box.xs30zaqk60p')
          .d('标签标识'),
        value: tagDetail.enName,
      },
      {
        title: intl
          .get('ide.src.business-component.tag-relate.dag-box.zfaw0a4v7jh')
          .d('数据类型'),
        value: tagDetail.valueTypeName,
      },
      {
        title: intl
          .get('ide.src.page-manage.page-common-tag.detail.main.hv8quje3qk')
          .d('创建者'),
        value: tagDetail.creator,
      },
      {
        title: intl
          .get(
            'ide.src.page-manage.page-aim-source.source-detail.main.2vp94m4091h'
          )
          .d('创建时间'),
        value: <Time timestamp={tagDetail.createTime} />,
      },
      {
        title: intl
          .get('ide.src.page-manage.page-common-tag.detail.main.2ziwjluj78c')
          .d('绑定方式'),
        value: intl
          .get('ide.src.page-manage.page-common-tag.detail.main.dz497pguc9')
          .d('主标签'),
      },
    ]

    // 不同状态的相应map
    const tagMap = {
      2: (
        <Tag
          status="success"
          text={intl
            .get(
              'ide.src.page-manage.page-common-tag.common-tag.list.imf5yhtwj8c'
            )
            .d('有权限')}
        />
      ),
      1: (
        <Tag
          status="process"
          text={intl
            .get(
              'ide.src.page-common.approval.common.comp-approval-modal.nb8qntq7vug'
            )
            .d('审批中')}
        />
      ),
    }

    const actions = [
      <Authority authCode="tag_model:apply_tag[c]">
        <Button
          // className="mr8"
          type="primary"
          // style={{display: !authorStatus && projectId !== useProjectId ? 'block' : 'none'}}
          style={{ display: !authorStatus ? 'block' : 'none' }}
          onClick={this.viewRule}
        >
          {intl
            .get(
              'ide.src.page-manage.page-project-tag.tag-system.detail.qtu77t9ha8'
            )
            .d('申请权限')}
        </Button>
      </Authority>,
    ]

    const noDataConfig = {
      text: intl
        .get('ide.src.business-component.tag-trend.tag-trend.o18ga4b3ils')
        .d('暂无数据'),
    }

    return (
      <div className="detail-content">
        {selectedKey ? (
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
              {tagDetail.isEnum ? (
                <TagAnalyze tagId={selectedKey} authorStatus={authorStatus} />
              ) : null}
              {tagDetail.isMajor ? null : (
                <TagTrend key={selectedKey} tagId={selectedKey} />
              )}

              {/* <TagTrend key={selectedKey} tagId={selectedKey} /> */}
            </div>
          </Spin>
        ) : (
          <div
            className="box-border"
            style={{ paddingTop: '15%', minHeight: 'calc(100vh - 181px)' }}
          >
            <NoData {...noDataConfig} />
          </div>
        )}

        <TagApply store={this.store} />
      </div>
    )
  }
}
export default Detail
