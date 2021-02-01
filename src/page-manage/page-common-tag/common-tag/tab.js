import intl from 'react-intl-universal'
/**
 * @description 公共标签
 */
import {Component} from 'react'
import {Tabs} from 'antd'
import TagList from './list'
import TagSystem from '../../page-project-tag/tag-system'

const {TabPane} = Tabs

class CommonTag extends Component {
  render() {
    return (
      <div className="theme-bg">
        <div className="content-header-noBorder">
          {intl
            .get(
              'ide.src.page-manage.page-common-tag.common-tag.tab.hl9dz7f8p4j'
            )
            .d('公共标签')}
        </div>
        <Tabs animated={false} defaultActiveKey="1" className="comp-tab">
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
            <TagSystem {...this.props} commonTag />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default CommonTag
