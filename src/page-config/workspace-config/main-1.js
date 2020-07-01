import {Component, Fragment} from 'react'
import {observer, inject} from 'mobx-react'
import store from './store'
import {ModalForm, projectProvider} from '../../component'
import './main.styl'

@observer
class WorkspaceConfig extends Component {
  constructor(props) {
    super(props)
    store.projectId = props.projectId
    store.getWorkspace()
  }

  formItemLayout = () => {
    return ({
      labelCol: {span: 2},
      wrapperCol: {span: 18},
      colon: false,
    })
  }

  selectContent = () => {
    const {
      workspace,
    } = store
    return [{
      label: '环境',
      key: 'type',
      initialValue: workspace.workspaceName,
      disabled: true,
      // control: {
      //   options: dataTypeSource,
      // },
      component: 'select',
    }]
  }
  render() {
    const formConfig = {
      labelAlign: 'left',
      selectContent: this.selectContent(),
      formItemLayout: this.formItemLayout(),
    }

    return (
      <div className="back-config">
        <div className="cloud-config">
          <p className="config-title">环境配置</p>
          <ModalForm {...formConfig} />
        </div>
      </div>
    )
  }
}
export default projectProvider(WorkspaceConfig)
