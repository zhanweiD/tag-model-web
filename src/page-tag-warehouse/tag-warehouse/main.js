/**
 * @description 标签仓库
 */
import {Component} from 'react'
import {Tabs} from 'antd'
import {projectProvider} from '../../component'
import TagList from '../tag-list'
import TagSystem from '../tag-system'

const {TabPane} = Tabs

class TagWareHouse extends Component {
  render() {
    return (
      <div>
        <Tabs defaultActiveKey="1" className="comp-tab">
          <TabPane tab="标签列表" key="1">
            <TagList />
          </TabPane>
          <TabPane tab="标签体系" key="2">
            <TagSystem />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default projectProvider(TagWareHouse)
