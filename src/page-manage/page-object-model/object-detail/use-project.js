import intl from 'react-intl-universal'
import {Component} from 'react'
import {Input} from 'antd'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {SearchOutlined} from '@ant-design/icons'
import {Time} from '../../../common/util'
import {ListContent} from '../../../component'

import store from './store-project'

@observer
class UseProject extends Component {
  columns = [
    {
      title: intl
        .get(
          'ide.src.page-manage.page-object-model.object-list.object-detail.use-project.v1drer78dg'
        )
        .d('项目名称'),
      dataIndex: 'name',
    },
    {
      title: intl
        .get(
          'ide.src.page-manage.page-object-model.object-list.object-detail.use-project.n7rzujk1s3n'
        )
        .d('项目描述'),
      dataIndex: 'descr',
      render: text => text || '-',
    },
    {
      title: intl
        .get(
          'ide.src.page-manage.page-object-model.object-list.object-detail.use-project.20rj2ebb35m'
        )
        .d('所有者'),
      dataIndex: 'cuserName',
    },
    {
      title: intl
        .get(
          'ide.src.page-manage.page-aim-source.source-detail.main.2vp94m4091h'
        )
        .d('创建时间'),
      dataIndex: 'ctime',
      render: text => <Time timestamp={text} />,
    },
    {
      title: intl
        .get(
          'ide.src.page-manage.page-object-model.object-list.object-detail.use-project.sk57orq1yt8'
        )
        .d('生产基础标签/衍生标签'),
      dataIndex: 'descr',
      render: (text, record) => `${record.basicCount}/${record.produceCount}`,
    },
    {
      title: intl
        .get(
          'ide.src.page-manage.page-object-model.object-list.object-detail.use-project.wz1cq2qyt7s'
        )
        .d('使用标签数'),
      dataIndex: 'usedCount',
    },
  ]

  simpleColumns = [
    {
      title: intl
        .get(
          'ide.src.page-manage.page-object-model.object-list.object-detail.use-project.v1drer78dg'
        )
        .d('项目名称'),
      dataIndex: 'name',
    },
    {
      title: intl
        .get(
          'ide.src.page-manage.page-object-model.object-list.object-detail.use-project.n7rzujk1s3n'
        )
        .d('项目描述'),
      dataIndex: 'descr',
      render: text => text || '-',
    },
    {
      title: intl
        .get(
          'ide.src.page-manage.page-object-model.object-list.object-detail.use-project.20rj2ebb35m'
        )
        .d('所有者'),
      dataIndex: 'cuserName',
    },
    {
      title: intl
        .get(
          'ide.src.page-manage.page-aim-source.source-detail.main.2vp94m4091h'
        )
        .d('创建时间'),
      dataIndex: 'ctime',
      render: text => <Time timestamp={text} />,
    },
  ]

  // componentDidMount() {
  //   this.store.getList()
  // }

  componentWillReceiveProps(next) {
    const {updateDetailKey, objId} = this.props
    if (
      !_.isEqual(updateDetailKey, next.updateDetailKey)
      || !_.isEqual(+objId, +next.objId)
    ) {
      store.getList({objId: next.objId})
    }
  }

  @action.bound onChange(v) {
    const keyword = v.target.value
    store.getList({
      currentPage: 1,
      keyword,
    })
  }

  render() {
    const {type, objId} = this.props

    const listConfig = {
      columns: +type ? this.columns : this.simpleColumns,
      initParams: {objId: +objId},
      buttons: [
        <div className="pr24 far">
          {/* <Search
           placeholder="请输入项目名称关键字"
           onChange={e => this.onChange(e)}
           style={{width: 200}}
          /> */}
          <Input
            size="small"
            onChange={e => this.onChange(e)}
            placeholder={intl
              .get(
                'ide.src.page-manage.page-object-model.object-list.object-detail.use-project.oaa6hlayvx'
              )
              .d('请输入项目名称关键字')}
            style={{width: 200}}
            suffix={<SearchOutlined />}
          />
        </div>,
      ],
      store,
    }

    return (
      <div>
        <ListContent {...listConfig} />
      </div>
    )
  }
}
export default UseProject
