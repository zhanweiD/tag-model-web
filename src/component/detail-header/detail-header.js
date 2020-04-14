import {Component} from 'react'
import PropTypes from 'prop-types'
import NemoBaseInfo from '@dtwave/nemo-base-info'

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
      name, descr, actions, baseInfo, tag, btnMinWidth,
    } = this.props

    const btnStyle = btnMinWidth ? {
      minWidth: `${btnMinWidth}px`,
    } : null

    return (
      <div>
        <div className="detail-header">
          <div>
            <div className="detail-name">
              {name || '--'}
              <span className="ml10">{ tag }</span>
            </div>
            
            {
              descr ? <div className="detail-descr">{`描述：${descr}`}</div> : null
            }
           
          </div>
          <div />
          <div style={btnStyle} className="far">
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
