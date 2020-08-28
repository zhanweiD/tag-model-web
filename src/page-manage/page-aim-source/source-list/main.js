import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Button, Popconfirm} from 'antd'
import {Link} from 'react-router-dom'
import {ListContent, projectProvider, OmitTooltip, Authority} from '../../../component'
import {Time} from '../../../common/util'
import seach from './search'
import AddSource from './drawer'
import DrawerTagConfig from '../tag-config'

import store from './store'

@observer
class SourceList extends Component {
  constructor(props) {
    super(props)
    store.projectId = props.projectId
  }

  columns = [{
    title: '目的源名称',
    dataIndex: 'name',
    render: (text, record) => <Link target="_blank" to={`/manage/aim-source/${record.id}`}>{text}</Link>,
  }, {
    title: '对象',
    dataIndex: 'objName',
    render: text => <OmitTooltip maxWidth={100} text={text} />,
  }, {
    title: '数据表',
    dataIndex: 'dataTableName',
    render: text => <OmitTooltip maxWidth={100} text={text} />,
  }, {
    title: '数据源',
    dataIndex: 'storageName',
    render: text => <OmitTooltip maxWidth={100} text={text} />,
  }, {
    title: '数据源类型',
    dataIndex: 'storageType',
  }, {
    title: '已映射/字段数',
    dataIndex: 'tagUsedCount',
    render: (text, record) => `${record.tagUsedCount}/${record.fieldTotalCount}`,
  }, {
    title: '已被使用',
    dataIndex: 'status',
    render: text => (text ? '是' : '否'),
  }, {
    title: '创建时间',
    dataIndex: 'ctime',
    render: text => <Time timestamp={text} />,
  }, {
    title: '操作',
    dataIndex: 'action',
    width: 200,
    render: (text, record) => (
      <Authority 
        authCode="tag_model:update_tag_target[ud]"
      >
        <div>
          <a href className="mr16" onClick={() => this.openTagConfig(record)}>标签映射</a>
          {
            record.status ? <span className="disabled">删除</span> : (
              <Popconfirm placement="topRight" title="你确定要删除该目的源吗？" onConfirm={() => this.delItem(record.id)}>
                <a href>删除</a>
              </Popconfirm>
            )
          }
        </div>
      </Authority>
    ),
  }]

  componentWillMount() {
    if (store.projectId) {
      store.getObjList()
      this.initData()
    }
  }

  // 初始化数据，一般情况不需要，此项目存在项目空间中项目的切换，全局性更新，较为特殊
  @action initData() {
    store.list.clear()
    store.searchParams = {}
    store.pagination = {
      pageSize: 10,
      currentPage: 1,
    }
  }

  @action.bound addSource() {
    store.getStorageType()
    store.visible = true
  }

  @action.bound openTagConfig(record) {
    store.drawerTagConfigInfo = record
    store.drawerVisible = true
  }

  // 删除目的源
  delItem = id => {
    store.delList(id)
  }

  render() {
    const {
      projectId,
      objList,
      drawerVisible,
      drawerTagConfigInfo,
      closeTagConfig,
      updateTagConfig,
    } = store

    const listConfig = {
      columns: this.columns,
      searchParams: seach({
        objList: toJS(objList),
      }),
      initParams: {projectId},
      buttons: [
        <Authority 
          authCode="tag_model:create_target_source[c]" 
        >
          <Button type="primary" onClick={() => this.addSource()}>新建目的源</Button>
        </Authority>,
      ],
      store, // 必填属性
    }
    
    return (
      <div>
        <div className="content-header">目的源管理</div>
        <div className="header-page">
          <ListContent {...listConfig} />
        </div>
        <AddSource store={store} />
        <DrawerTagConfig
          visible={drawerVisible}
          info={drawerTagConfigInfo}
          onClose={closeTagConfig}
          onUpdate={updateTagConfig}
          projectId={store.projectId}
        />
      </div>
    )
  }
}

export default projectProvider(SourceList)
