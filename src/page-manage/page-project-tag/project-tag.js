import intl from 'react-intl-universal'
/**
 * @description 项目标签
 */
import { Component } from 'react'
import { Tabs } from 'antd'
import { projectProvider } from '../../component'
import TagList from './tag-list'
import TagSystem from './tag-system'

const { TabPane } = Tabs

class ProjectTag extends Component {
  render() {
    return (
      <div className="theme-bg">
        <div className="content-header-noBorder">
          {intl
            .get('ide.src.page-manage.page-project-tag.project-tag.lzp8o2hh5p')
            .d('项目标签')}
        </div>
        <Tabs defaultActiveKey="1" className="comp-tab">
          <TabPane
            tab={intl.get('ide.src.common.navList.5ywghq8b76s').d('标签列表')}
            key="1"
          >
            <TagList {...this.props} />
          </TabPane>
          <TabPane
            tab={intl
              .get(
                'ide.src.page-manage.page-common-tag.common-tag.tab.ibmbvhhebg'
              )
              .d('标签体系')}
            key="2"
          >
            <TagSystem {...this.props} />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default projectProvider(ProjectTag)
