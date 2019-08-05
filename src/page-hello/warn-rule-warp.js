import {Component} from 'react'
import {observer} from 'mobx-react'
import {action, toJS} from 'mobx'
import WarnRule from './warn-rule'
import store from './store-warn-rule'

@observer
export default class WrapWarnRule extends Component {
  componentWillMount() {
    store.getRuleChartData()
  }

  render() {
    return (
      <div>
        {
          toJS(store.warnRuleData).map(item => (
            <WarnRule chartData={item} isTable key={`${Math.random()}`} ruleId={item.ruleId} />
          ))
        }
      </div>
    )
  }
}
