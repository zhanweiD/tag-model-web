import intl from 'react-intl-universal'
/**
 * @description 对象管理 - 对象列表
 */
import {Component, useEffect} from 'react'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {Link} from 'react-router-dom'
import {ListContent, Authority} from '../../../../component'
import seach from './search'
import TagClass from './tag-class'
import {objTypeList, objTypeMap} from '../util'

import store from './store'

@observer
class ObjectList extends Component {
  columns = [
    {
      title: intl
        .get(
          'ide.src.page-manage.page-object-model.object-list.object-list.main.9c8ou0oxjir'
        )
        .d('对象名称'),
      dataIndex: 'name',
      render: (text, record) => (
        <Link
          target="_blank"
          to={`/manage/object-list/${record.objTypeCode}/${record.id}`}
          className="mr16"
        >
          {text}
        </Link>
      ),
    },
    {
      title: intl
        .get('ide.src.page-manage.page-object-model.detail.ml3nv2hkkdo')
        .d('对象类目'),
      dataIndex: 'objCatName',
    },
    {
      title: intl
        .get('ide.src.page-manage.page-object-model.detail.qksgujny9q')
        .d('对象类型'),
      dataIndex: 'type',
      render: text => objTypeMap[text],
    },
    {
      title: intl
        .get('ide.src.page-manage.page-object-model.detail.wih18jbc78')
        .d('数据表数'),
      dataIndex: 'tableCount',
    },
    {
      title: intl
        .get(
          'ide.src.page-manage.page-object-model.object-list.object-list.main.mkwucyqm93'
        )
        .d('加工方案数'),
      dataIndex: 'schemeCount',
    },

    //  {
    //   title: '上架标签数',
    //   dataIndex: 'publicTagCount',
    // },
    {
      title: intl
        .get('ide.src.page-manage.page-object-model.detail.oq3u9e6e36')
        .d('标签总数'),
      dataIndex: 'tagCount',
    },
    {
      title: intl
        .get('ide.src.page-common.approval.approved.main.1tcpwa6mu1')
        .d('操作'),
      key: 'action',
      width: 150,
      dataIndex: 'action',
      render: (text, record) => (
        <div>
          {/* <Authority authCode="tag_model:obj_detail[r]" isCommon>
         <Link to={`/manage/object-list/${record.objTypeCode}/${record.id}`} className="mr16">查看详情</Link>
        </Authority> */}
          <Authority authCode="tag_model:select_tag_cate[r]" isCommon>
            <a href onClick={() => this.tagClass(record)}>
              {intl
                .get('ide.src.page-manage.page-object-model.detail.9o263cdwzol')
                .d('标签类目')}
            </a>
          </Authority>
        </div>
      ),
    },
  ]

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
        <div className="content-header">
          {intl.get('ide.src.common.navList.c2lnohs0y4n').d('对象列表')}
        </div>
        <div className="header-page">
          <ListContent {...listConfig} />
        </div>
        <TagClass {...tagClassConfig} />
      </div>
    )
  }
}
export default ObjectList
