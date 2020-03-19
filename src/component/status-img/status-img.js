import {Component} from 'react'

const empty = require('../../icon/status-empty.svg')
const success = require('../../icon/status-success.svg')
const waiting = require('../../icon/status-waiting.svg')
const error = require('../../icon/status-fail.svg')
const authError = require('../../icon/status-auth-fail.svg')


const getImgSource = (status = 'empty') => {
  let result = ''
  switch (status) {
    case 'empty':
      result = empty
      break
    case 'success':
      result = success
      break
    case 'waiting':
      result = waiting
      break
    case 'error':
      result = error
      break
    case 'authError':
      result = authError
      break
    default:
      result = empty
      break
  }
  return result
}

class StatusImg extends Component {
  render() {
    const minHeight = this.props.height || 155
    const imgSrc = getImgSource(this.props.status)
    const imgWidth = this.props.imgWidth || 200
    return (
      <div className="status-img FBV FBJC FBAC" style={{minHeight: `${minHeight}px`}}>
        <div className="FBV FBJC FBAC">
          <img src={imgSrc} alt="有错误" width={`${imgWidth}px`} />
          {this.props.title 
            ? (
              <p style={{
                textAlign: 'center', fontSize: '14px', marginTop: '10px', marginBottom: '-5px',
              }}
              >
                {this.props.title}

              </p>
            )
            : null
          }
          <span className="status-tip">{this.props.tip}</span>
        </div>
      </div>
    )
  }
}

export default StatusImg
