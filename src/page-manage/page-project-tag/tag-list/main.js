/**
 * @description  标签仓库(项目标签)-标签列表
 */
import {Component, Fragment} from 'react'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {Link} from 'react-router-dom'
import {Spin} from 'antd'
import {CompassOutlined} from '@ant-design/icons'
import {
  ListContent, NoData, OmitTooltip, Authority,
} from '../../../component'
import {getDataTypeName} from '../../../common/util'
import ModalApply from './modal-apply'
import ModalBack from './modal-back'
import Search from './search'

import store from './store'

const statusMap = {
  0: '有效',
  1: '有效',
  2: '失效',
}

@observer
export default class TagList extends Component {
  constructor(props) {
    super(props)
    store.useProjectId = props.projectId
    // console.log(store)
  }

  // componentWillMount() {
  //   // 获取所属对象下拉数据
  //   if (store.useProjectId) {
  //     store.getAuthCode()
  //   }
  // }

  componentDidMount() {
    if (store.useProjectId) {
      // 请求列表，放在父组件进行请求是因为需要在外层做空数据判断。
      // 若返回数据为空[]。则渲染 NoData 组件。
      // 要是请求放在列表组件ListContent中的话, 就必须渲染表格的dom 影响体验
      store.getList({
        useProjectId: store.useProjectId,
      })
    }
  }

  componentWillUnmount() {
    store.tagIds.clear()

    store.expand = false
    store.permissionType = '' // 使用权限状态
    store.ownProjectId = '' // 所属项目id
    store.objectId = '' // 对象id
    store.hotWord = undefined // 关键词
    store.selectItem = {}
    store.searchParams = {}
    store.pagination = {
      pageSize: 10,
      currentPage: 1,
    }
  }

  columns = [
    {
      key: 'name',
      title: '标签名称',
      dataIndex: 'name',
      fixed: 'left',
      render: (text, record) => <Link target="_blank" to={`/manage/project-tag/${record.id}/${store.useProjectId}`}>{text}</Link>,
    }, {
      key: 'enName',
      title: '标签标识',
      dataIndex: 'enName',
      render: text => <OmitTooltip maxWidth={200} text={text} />,
    }, {
      key: 'valueType',
      title: '数据类型',
      dataIndex: 'valueType',
      render: text => getDataTypeName(text),
    }, {
      key: 'objName',
      title: '对象名称',
      dataIndex: 'objName',
      render: text => <OmitTooltip maxWidth={200} text={text} />,
    }, {
      key: 'projectName',
      title: '所属项目',
      dataIndex: 'projectName',
      render: text => <OmitTooltip maxWidth={200} text={text} />,
    }, 
    {
      key: 'status',
      title: '使用权限状态',
      dataIndex: 'status',
      render: text => statusMap[+text] || '失效',
    },
    {
      key: 'action',
      title: '操作',
      width: 200,
      fixed: 'right',
      render: (text, record) => (
        <div className="FBH FBAC">
          <Fragment> 
            {
              ((record.projectId === store.useProjectId || record.projectId === -1) || (record.status && !record.endTime)) ? <a className="mr8 disabled">权限申请</a> : (
                <a className="mr8" href onClick={() => this.openApplyModal(record)}>权限申请</a>
              )
            }       
          </Fragment>
          <Fragment>
            {
              (record.projectId === store.useProjectId || record.projectId === -1) ? <a className="disabled">交回权限</a> : (
                <a href onClick={() => this.openBackModal(record)}>交回权限</a>
              )
            }        
          </Fragment>
        </div>
      ),
    },
  ]
  
  @action.bound openApplyModal(data) {
    store.selectItem = data
    store.tagIds.replace([data.id])
    store.modalApplyVisible = true
  }

  @action.bound openBackModal(data) {
    store.projectId = data.projectId
    store.tagId = data.id
    store.modalBackVisible = true
  }

  // 是否有进行搜索操作
  isSearch = () => {
    const {
      hotWord,
      objectId,
      ownProjectId,
      // projectPermission,
    } = store

    if (
      typeof hotWord === 'undefined'
      && ownProjectId === ''
      && objectId === ''
    ) {
      return false
    }
    return true
  }

  // 跳转到标签管理
  goTagManager = () => {
    window.location.href = `${window.__keeper.pathHrefPrefix || '/'}/manage/tag-maintain`
  }

  render() {
    const {
      useProjectId, list, functionCodes, tableLoading,
    } = store

    const listConfig = {
      columns: this.columns,
      initParams: {useProjectId},
      rowKey: 'id',
      initGetDataByParent: true, // 初始请求 在父层组件处理。列表组件componentWillMount内不再进行请求
      store, // 必填属性
    }

    const noDataConfig = {
      btnText: '去新建标签',
      onClick: this.goTagManager,
      text: '没有任何标签，去标签维护新建标签吧!',
      code: 'tag_model:create_tag[c]',
      noAuthText: '没有任何标签',
      // myFunctionCodes: functionCodes,
      isLoading: tableLoading,
    }

    if (tableLoading) {
      return (
        <div style={{width: '100%', height: '100%', textAlign: 'center'}}>
          <Spin spinning />
        </div>
      )
    }

    return (
      <div>
        {
          !list.length && !this.isSearch() ? (
            <div className="header-page" style={{paddingTop: '15%', minHeight: 'calc(100vh - 181px)'}}>
              <NoData
                // isLoading={tableLoading}
                {...noDataConfig}
              />
            </div>
          ) : (
            <Fragment>
              <Search store={store} />
              <div className="search-list box-border"> 
                <ListContent {...listConfig} />
                <ModalApply store={store} />
                <ModalBack store={store} />
              </div>
            </Fragment>
          ) 
        }  
      </div>
    )
  }
}
