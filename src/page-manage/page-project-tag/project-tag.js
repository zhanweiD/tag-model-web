/**
 * @description 项目标签
 */
import {Component} from 'react'
import {Tabs} from 'antd'
import {projectProvider} from '../../component'
import TagList from './tag-list'
import TagSystem from './tag-system'

const {TabPane} = Tabs

class ProjectTag extends Component {
  render() {
    return (
      <div className="theme-bg">
        <div className="content-header-noBorder">项目标签</div>
        <Tabs defaultActiveKey="1" className="comp-tab">
          <TabPane tab="标签列表" key="1">
            <TagList {...this.props} />
          </TabPane>
          <TabPane tab="标签体系" key="2">
            <TagSystem {...this.props} />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default projectProvider(ProjectTag)
