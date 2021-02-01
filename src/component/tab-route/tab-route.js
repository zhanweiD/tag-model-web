import {Component} from 'react'
import {Tabs} from 'antd'

import './tab-route.styl'

const {TabPane} = Tabs

class TabRoute extends Component {
  static defaultProps = {
    tabs: [],
    changeUrl: true,
  }

  /**
   * @description tabs变化时触发
   */
  changeTab = key => {
    const {
      changeTab,
      _history,
      basePath,
      changeUrl,
    } = this.props
    if (changeTab) changeTab(key)
    if (changeUrl) _history.push(`${basePath}/${key}`)
  }

  render() {
    const {tabs, currentTab, objType} = this.props
    const toView = !!(currentTab === 'list' || currentTab === 'field')
    const nowCurrentTab = toView && objType === 0 ? 'view' : currentTab
    return (
      <div className="comp-tab">
        {
          tabs.length && (
            <Tabs
              activeKey={`${nowCurrentTab || tabs[0].value}`}
              animated={false}
              onChange={this.changeTab}
            >
              {
                tabs.map(data => <TabPane tab={data.name} key={data.value} />)
              }
            </Tabs>
          )
        }
      </div>
    )
  }
}

export default TabRoute
