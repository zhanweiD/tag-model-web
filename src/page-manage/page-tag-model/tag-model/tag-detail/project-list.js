import {Component, Fragment} from 'react'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {ListContent} from '../../../../component'
import {Time} from '../../../../common/util'
import ModalBack from './modal-back'

import store from './store-project'

@observer
export default class ProjectList extends Component {
  constructor(props) {
    super(props)
    store.tagId = props.tagId
    store.projectId = props.projectId
  }
  columns = [
    {
      title: '项目名称',
      key: 'name',
      dataIndex: 'name',
    }, {
      title: '项目描述',
      key: 'descr',
      dataIndex: 'descr',
      render: text => (text || '-'),
    }, {
      title: '申请时间',
      key: 'ctime',
      dataIndex: 'ctime',
      render: text => <Time timestamp={text} />,
    }, {
      title: '加工方案引用数',
      key: 'derivativeCount',
      dataIndex: 'derivativeCount',
    }, {
      title: '标签应用数',
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
    const {tagId, projectId} = this.props
    
    const listConfig = {
      columns: this.columns,
      initParams: {tagId, projectId},
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
