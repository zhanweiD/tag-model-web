import intl from 'react-intl-universal'
import { Component } from 'react'
import { observer } from 'mobx-react'
import { ListContent } from '../../../component'
import { Time } from '../../../common/util'

import store from './store-app'
// 1场景 2群体 3数据查询
const appType = {
  1: intl
    .get('ide.src.page-manage.page-project-tag.detail.app-list.is5q9klgisq')
    .d('业务场景'),
  2: intl
    .get('ide.src.page-manage.page-project-tag.detail.app-list.zr1psz6lu9')
    .d('群体洞察'),
  3: intl
    .get('ide.src.page-manage.page-project-tag.detail.app-list.ozx1ldgfkls')
    .d('数据查询'),
}

@observer
class AppList extends Component {
  columns = [
    {
      title: intl
        .get('ide.src.page-manage.page-project-tag.detail.app-list.p685gd2zzcr')
        .d('标签应用名称'),
      key: 'appName',
      dataIndex: 'appName',
    },
    {
      title: intl
        .get('ide.src.page-manage.page-project-tag.detail.app-list.iy4vstimw8s')
        .d('应用类型'),
      key: 'type',
      dataIndex: 'type',
      render: text => <span>{appType[+text]}</span>,
    },
    {
      title: intl
        .get(
          'ide.src.page-manage.page-aim-source.source-detail.main.2vp94m4091h'
        )
        .d('创建时间'),
      key: 'createTime',
      dataIndex: 'createTime',
      render: text => <Time timestamp={text} />,
    },
    {
      title: intl
        .get('ide.src.page-manage.page-common-tag.detail.main.hv8quje3qk')
        .d('创建者'),
      key: 'cuserName',
      dataIndex: 'cuserName',
    },

    //  {
    //   title: '使用状态',
    //   key: 'ctime',
    //   dataIndex: 'ctime',
    //   render: text => <Time timestamp={text} />,
    // },
  ]

  render() {
    const { tagId, projectId } = this.props

    const listConfig = {
      columns: this.columns,
      initParams: { tagId, projectId },
      store, // 必填属性
    }

    return (
      <div>
        <ListContent {...listConfig} />
      </div>
    )
  }
}
export default AppList
