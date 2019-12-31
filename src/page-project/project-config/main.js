/**
 * @description 项目列表-项目配置
 */
import {Component} from 'react'
import {action} from 'mobx'
import {observer, inject} from 'mobx-react'
import {withRouter} from 'react-router'
import {Popconfirm, Button, Spin} from 'antd'
import {Time} from '../../common/util'
import {DetailHeader, ListContent, AuthBox} from '../../component'
import ModalProjectConfig from './modal'

import store from './store'

// 面包屑设置
// eslint-disable-next-line no-underscore-dangle
const {navListMap} = window.__keeper
const navList = [
  navListMap.tagCenter,
  navListMap.project,
  navListMap.projectConfig,
]

@inject('frameChange')
@observer
class ProjectConfig extends Component {
  constructor(props) {
    super(props)
    const {match} = props
    store.projectId = match.params.projectId // 项目id
  }

  columns = [
    {
      title: '姓名',
      key: 'userName',
      dataIndex: 'userName',
    }, {
      title: '手机号',
      key: 'mobile',
      dataIndex: 'mobile',
    }, {
      title: '邮箱',
      key: 'email',
      dataIndex: 'email',
    }, {
      title: '角色',
      key: 'role',
      dataIndex: 'role',
    }, {
      title: '添加时间',
      key: 'cTime',
      dataIndex: 'cTime',
      render: text => <Time timestamp={text} />,
    }, {
      key: 'action',
      title: '操作',
      dataIndex: 'action',
      width: 150,
      render: (text, record) => (
        <div>
          <AuthBox
            code="asset_tag_project_member_add_edit_del"
            isButton={false}
          >
            <a href onClick={() => this.openModal('edit', record)}>编辑</a>
            <span className="table-action-line" />
            <Popconfirm placement="topRight" title="确认删除？" onConfirm={() => this.delItem(record.id)}>
              <a href>删除</a>
            </Popconfirm>
          </AuthBox>
        
        </div>
      ),
    },
  ];
  
  componentWillMount() {
    // 面包屑设置
    const {frameChange} = this.props
    frameChange('nav', navList)
    if (store.projectId) {
      store.getDetail()
    }
  }

  @action openModal = (type, data = {}) => {
    if (type === 'add') {
    // 请求用户名下拉列表
      store.getUsers()
    }
    // 请求角色下拉列表
    store.getRole()
    
    store.detail = data 
    store.modalType = type
    store.visible = true
  }

  /**
   * @description 删除项目
   * @param id 项目ID
   */
  delItem = id => {
    store.delList(id)
  }

  render() {
    const {projectDetail, projectId: id, projectDetailLoading} = store

    const baseInfo = [{
      title: '创建者',
      value: projectDetail.cUserName,
    }, {
      title: '创建时间',
      value: <Time timestamp={projectDetail.cTime} />,
    }, {
      title: '修改时间',
      value: <Time timestamp={projectDetail.mTime} />,
    }]

    const listConfig = {
      columns: this.columns,
      initParams: {id},
      store, // 必填属性
      buttons: [<AuthBox code="asset_tag_project_member_add_edit_del" type="primary" onClick={() => this.openModal('add')}>添加成员</AuthBox>],
    }
    return (
      <div className="project-config">
        <Spin spinning={projectDetailLoading}>
          <DetailHeader
            name={projectDetail.name}
            descr={projectDetail.descr}
            baseInfo={baseInfo}
          />
        </Spin>
       
        <div className="list-content">
          <ListContent {...listConfig} />
        </div>
        <ModalProjectConfig store={store} />
      </div>
    )
  }
}

export default withRouter(ProjectConfig)
