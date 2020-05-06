import {Component} from 'react'
import {Popconfirm} from 'antd'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {ListContent, AuthBox} from '../../component'
import {Time} from '../../common/util'
import ModalMember from './modal-member'

import store from './store-member'

@observer
export default class MemberManger extends Component {
  constructor(props) {
    super(props)
    store.projectId = props.projectId
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
      key: 'ctime',
      dataIndex: 'ctime',
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
            myFunctionCodes={store.functionCodes}
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
  ]

  // 添加/编辑成员
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

  // 删除成员
  delItem = id => {
    store.delList(id)
  }

  render() {
    const {projectId: id, functionCodes} = this.props
    
    const listConfig = {
      columns: this.columns,
      initParams: {id},
      buttons: [<AuthBox 
        code="asset_tag_project_member_add_edit_del" 
        myFunctionCodes={functionCodes}
        type="primary" 
        onClick={() => this.openModal('add')}
      >
添加成员
      </AuthBox>],
      store, // 必填属性
    }

    return (
      <div> 
        <ListContent {...listConfig} /> 
        <ModalMember store={store} />
      </div>
    )
  }
}
