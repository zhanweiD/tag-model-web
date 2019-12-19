import {Component} from 'react'
import PropTypes from 'prop-types'
import NemoBaseInfo from '@dtwave/nemo-base-info'
// import {Tag} from 'antd'

export default class Main extends Component {
  static propTypes = {
    name: PropTypes.string, // 对象名称
    descr: PropTypes.string, // 对象描述
    actions: PropTypes.arrayOf(PropTypes.object),
    baseInfo: PropTypes.arrayOf(PropTypes.object),
  }

  static defaultProps = {
    name: '',
    descr: '',
    actions: [], // Array<ReactNode>,
    baseInfo: [],
  }

  renderAction = actions => {
    if (!actions.length) return null

    return actions.map(item => item)
  }

  renderBaseInfo = baseInfo => <NemoBaseInfo dataSource={baseInfo} key={Math.random()} />

  render() {
    const {
      name, descr, actions, baseInfo, tag,
    } = this.props
    return (
      <div>
        <div className="detail-header">
          <div>
            <div className="detail-name">
              {name || '--'}
              <span className="ml10">{ tag }</span>
            </div>
            <div className="detail-descr">{descr}</div>
          </div>
          <div />
          <div>
            {
              this.renderAction(actions)
            }
          </div>
        </div>
        <div className="detail-base-info">
          {
            this.renderBaseInfo(baseInfo)
          }
        </div>
      </div>
    )
  }
}
