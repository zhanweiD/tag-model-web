/**
 * @description 对象管理 - 对象列表
 */
import {Component, useEffect} from 'react'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {Link} from 'react-router-dom'
import OnerFrame from '@dtwave/oner-frame' 
import {ListContent} from '../../../component'
import seach from './search'
import TagClass from './tag-class'
import {objTypeList, objTypeMap} from '../util'

import store from './store'

@observer
class ObjectList extends Component {
  columns = [{
    title: '对象名称',
    dataIndex: 'name',
  }, {
    title: '对象类目',
    dataIndex: 'objCatName',
  }, {
    title: '对象类型',
    dataIndex: 'type',
    render: text => objTypeMap[text],
  }, {
    title: '数据表数',
    dataIndex: 'tableCount',
  }, {
    title: '加工方案数',
    dataIndex: 'schemeCount',
  },
  //  {
  //   title: '上架标签数',
  //   dataIndex: 'publicTagCount',
  // }, 
  {
    title: '标签总数',
    dataIndex: 'tagCount',
  }, {
    title: '操作',
    key: 'action',
    width: 150,
    dataIndex: 'action',
    render: (text, record) => (
      <div>
        <Link to={`/manage/object-list/${record.objTypeCode}/${record.id}`}>查看详情</Link>
        <span className="table-action-line" />
        <a href onClick={() => this.tagClass(record)}>标签类目</a>
      </div>
    ),
  }]

  componentWillMount() {
    store.getObjCate()
  }

  @action.bound tagClass(record) {
    store.tagClassObjId = record.id // 对象id
    store.tagClassVisible = true
  }

  @action.bound closeTagClass() {
    store.tagClassVisible = false
  }

  render() {
    const {tagClassObjId, tagClassVisible, objCateList} = store

    const listConfig = {
      columns: this.columns,
      searchParams: seach({objTypeList, objCateList}),
      store, // 必填属性
    }

    // 标签类目
    const tagClassConfig = {
      visible: tagClassVisible,
      onClose: this.closeTagClass,
      objId: tagClassObjId, // 对象id
      store,
    }
    return (
      <div>
        <div className="content-header">对象列表</div>
        <div className="header-page">
          <ListContent {...listConfig} />
        </div>
        <TagClass {...tagClassConfig} />
      </div>
    )
  }
}


export default props => {
  const ctx = OnerFrame.useFrame()
  useEffect(() => {
    ctx.useProject(false)
    ctx.useQuickEntrance([{
      label: '后台配置',
      icon: 'setting',
      url: '/tag-model/index.html#/config/environment',
    },
    {
      label: '审批管理',
      icon: 'approver',
      url: '/tag-model/index.html#/common/approval',
    }])
  }, [])

  return (
    <ObjectList {...props} />
  )
}
