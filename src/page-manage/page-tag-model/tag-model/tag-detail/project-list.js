import intl from 'react-intl-universal'
import { Component } from 'react'
import { observer } from 'mobx-react'
import { ListContent } from '../../../../component'
import { Time } from '../../../../common/util'

import store from './store-project'

@observer
class ProjectList extends Component {
  columns = [
    {
      title: intl
        .get(
          'ide.src.page-manage.page-object-model.object-list.object-detail.use-project.v1drer78dg'
        )
        .d('项目名称'),
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: intl
        .get(
          'ide.src.page-manage.page-object-model.object-list.object-detail.use-project.n7rzujk1s3n'
        )
        .d('项目描述'),
      key: 'descr',
      dataIndex: 'descr',
      render: text => text || '-',
    },
    {
      title: intl.get('ide.src.component.comp.search.bld1br247f').d('申请时间'),
      key: 'ctime',
      dataIndex: 'ctime',
      render: text => <Time timestamp={text} />,
    },
    {
      title: intl
        .get('ide.src.page-manage.page-project-tag.detail.main.40y9kbpr4qg')
        .d('加工方案引用数'),
      key: 'derivativeCount',
      dataIndex: 'derivativeCount',
    },
    {
      title: intl
        .get('ide.src.page-manage.page-project-tag.detail.main.nh79sa2cn9')
        .d('标签应用数'),
      key: 'tagAppCount',
      dataIndex: 'tagAppCount',
    },
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
export default ProjectList
