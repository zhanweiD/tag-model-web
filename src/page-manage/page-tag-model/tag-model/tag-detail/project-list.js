import { Component, Fragment } from 'react'
import { action } from 'mobx'
import intl from 'react-intl-universal'
import { observer } from 'mobx-react'
import ModalBack from './modal-back'
import { ListContent } from '../../../../component'
import { Time } from '../../../../common/util'

import store from './store-project'

@observer
class ProjectList extends Component {
  constructor(props) {
    super(props)
    store.tagId = props.tagId
    store.projectId = props.projectId
  }
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
    {
      key: 'action',
      title: intl
        .get('ide.src.page-common.approval.approved.main.1tcpwa6mu1')
        .d('操作'),
      width: 200,
      fixed: 'right',
      render: (text, record) => (
        <div className="FBH FBAC">
          <Fragment>
            {record.id === +store.projectId ? (
              <span className="disabled">
                {intl
                  .get(
                    'ide.src.page-manage.page-tag-model.tag-model.tag-list.modal-back.oh88gcracm'
                  )
                  .d('回收权限')}
              </span>
            ) : (
              <a href onClick={() => this.openBackModal(record)}>
                {intl
                  .get(
                    'ide.src.page-manage.page-tag-model.tag-model.tag-list.modal-back.oh88gcracm'
                  )
                  .d('回收权限')}
              </a>
            )}
          </Fragment>
        </div>
      ),
    },
  ]

  @action.bound openBackModal(data) {
    store.backProjectId.push(data.id)
    store.modalBackVisible = true
  }

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
        <ModalBack store={store} />
      </div>
    )
  }
}

export default ProjectList
