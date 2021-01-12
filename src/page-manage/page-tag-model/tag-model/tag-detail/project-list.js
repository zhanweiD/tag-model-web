<<<<<<< HEAD
import {Component, Fragment} from 'react'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {ListContent} from '../../../../component'
import {Time} from '../../../../common/util'
import ModalBack from './modal-back'
=======
import intl from 'react-intl-universal'
import { Component } from 'react'
import { observer } from 'mobx-react'
import { ListContent } from '../../../../component'
import { Time } from '../../../../common/util'
>>>>>>> 115cf2e85bd8a8a433b72cf84004b2c572686a5b

import store from './store-project'

@observer
<<<<<<< HEAD
export default class ProjectList extends Component {
  constructor(props) {
    super(props)
    store.tagId = props.tagId
    store.projectId = props.projectId
  }
=======
class ProjectList extends Component {
>>>>>>> 115cf2e85bd8a8a433b72cf84004b2c572686a5b
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
    }, {
      key: 'action',
      title: '操作',
      width: 200,
      fixed: 'right',
      render: (text, record) => (
        <div className="FBH FBAC">
          <Fragment>
            {
              record.id === +store.projectId ? <span className="disabled">交回权限</span> : (
                <a href onClick={() => this.openBackModal(record)}>交回权限</a>)
            }        
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
<<<<<<< HEAD
      <div> 
        <ListContent {...listConfig} /> 
        <ModalBack store={store} />
=======
      <div>
        <ListContent {...listConfig} />
>>>>>>> 115cf2e85bd8a8a433b72cf84004b2c572686a5b
      </div>
    )
  }
}
export default ProjectList
