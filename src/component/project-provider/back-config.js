import intl from 'react-intl-universal'
import {Component, Fragment} from 'react'
import {observer, inject} from 'mobx-react'
import ModalForm from '../modal-form'

@inject('store')
@observer
class BackConfig extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
    // this.store.getEntityPage()
  }

  formItemLayout = () => {
    return {
      labelCol: {span: 2},
      wrapperCol: {span: 18},
      colon: false,
    }
  }

  selectContent = () => {
    const {dataTypeSource = [], environment} = this.store
    return [
      {
        label: intl
          .get('ide.src.component.project-provider.back-config.q1r9bbokqf9')
          .d('环境'),
        key: 'type',
        initialValue: environment,
        disabled: true,
        control: {
          options: dataTypeSource,
        },

        component: 'select',
      },
    ]
  }
  render() {
    const formConfig = {
      labelAlign: 'left',
      selectContent: this.selectContent(),
      formItemLayout: this.formItemLayout(),
      wrappedComponentRef: form => {
        this.form = form ? form.props.form : form
      },
    }

    return (
      <div className="back-config">
        <div className="cloud-config">
          <p className="config-title">
            {intl
              .get('ide.src.component.project-provider.back-config.jxcvund1fi')
              .d('环境配置')}
          </p>
          <ModalForm {...formConfig} />
        </div>
      </div>
    )
  }
}
export default BackConfig
