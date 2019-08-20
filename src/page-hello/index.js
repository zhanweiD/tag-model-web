import ReactDOM from 'react-dom'
import Frame from '../frame'
import Hello from './hello'
import ConfigColumns from './config-columns'
import WrapWarnRule from './warn-rule-warp'
import './hello.styl'
import NestForm from './nest-form';

ReactDOM.render(
  <Frame>
    {/* <WrapWarnRule />
    <ConfigColumns /> */}
    <Hello />
    <NestForm />
  </Frame>, document.getElementById('root')
)
