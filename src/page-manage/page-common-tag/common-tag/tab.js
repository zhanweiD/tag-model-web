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
        <div className="content-header-noBorder">公共标签</div>
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

export default CommonTag
