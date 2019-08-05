import ReactDOM from 'react-dom'
import Frame from '../frame'
import Hello from './hello'
import ConfigColumns from './config-columns'
import WrapWarnRule from './warn-rule-warp'
import './hello.styl'

ReactDOM.render(
  <Frame>
    {/* <WrapWarnRule />
    <ConfigColumns /> */}
    <Hello />
  </Frame>, document.getElementById('root')
)
