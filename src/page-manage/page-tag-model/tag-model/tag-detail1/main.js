import intl from 'react-intl-universal'
/**
 * @description 标签模型-标签详情
 */
import { Component } from 'react'
import { observer } from 'mobx-react'
import { Spin } from 'antd'
import * as navListMap from '../../../../common/navList'
import { DetailHeader, TabRoute, Tag } from '../../../../component'
import { Time } from '../../../../common/util'
import TagRelate from './tag-relate'

import store from './store'

// 面包屑设置
// eslint-disable-next-line no-underscore-dangle

const navList = [
  navListMap.tagCenter,
  navListMap.tagManagement,
  navListMap.tagModel,
  navListMap.tagDetail,
]

// @inject('frameChange')
@observer
class TagManagement extends Component {
  constructor(props) {
    super(props)
    const { match } = props
    store.tagId = match.params.tagId // 标签id
  }

  componentWillMount() {
    // 面包屑设置
    // const {frameChange} = this.props
    // frameChange('nav', navList)

    store.getDetail()
  }

  render() {
    const { tagDetailLoading, tagDetail } = store

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
          .get('ide.src.page-manage.page-common-tag.detail.main.ilm7zazygy')
          .d('是否枚举'),
        value: tagDetail.isEnum
          ? intl.get('ide.src.component.form-component.03xp8ux32s3a').d('是')
          : intl.get('ide.src.component.form-component.h7p1pcijouf').d('否'),
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
          .get('ide.src.business-component.tag-relate.dag-box.9mzk7452ggp')
          .d('数据源'),
        value: tagDetail.dataSource,
      },
      {
        title: intl
          .get(
            'ide.src.page-manage.page-aim-source.source-list.main.bh6e3tzii5'
          )
          .d('数据表'),
        value: tagDetail.tableName,
      },
      {
        title: intl
          .get('ide.src.business-component.tag-relate.dag-box.bhzleo4vj5g')
          .d('字段'),
        value: tagDetail.fieldName,
      },
    ]

    // 不同状态的相应map
    const tagMap = {
      0: (
        <Tag
          status="wait"
          text={intl.get('ide.src.component.tag.tag.ogvpoe5m3bg').d('未使用')}
        />
      ),
      1: (
        <Tag
          status="process"
          text={intl
            .get('ide.src.page-config.workspace-config.main.ztbqzsc34bb')
            .d('使用中')}
        />
      ),
    }

    return (
      <div>
        <Spin spinning={tagDetailLoading}>
          <DetailHeader
            name={tagDetail.name}
            descr={tagDetail.descr}
            baseInfo={baseInfo}
            tag={tagMap[tagDetail.isUsed]}
          />
        </Spin>
        <TabRoute
          tabs={[
            {
              name: intl
                .get(
                  'ide.src.page-manage.page-tag-model.tag-model.tag-detail1.main.ga0dkpzjpsq'
                )
                .d('标签血缘'),
              value: 1,
            },
          ]}
        />
        <div className="bgf m16" style={{ height: 'calc(100vh - 298px)' }}>
          <TagRelate store={store} />
        </div>
      </div>
    )
  }
}
export default TagManagement
