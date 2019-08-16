import React from 'react'
import PropTypes from 'prop-types'
import {Modal, Form, Cascader} from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {span: 5},
  wrapperCol: {span: 19},
  colon: false,
}

// 所属类目弹框
export default class ModalCateSelect extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired, //
    options: PropTypes.array.isRequired, // 下拉框选择项
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  }

  render() {
    const {
      visible,
      options,
      onOk,
      onCancel,
    } = this.props

    return (
      <Modal
        title="选择所属类目"
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
        width={520}
      >
        <FormItem
          {...formItemLayout}
          label="所属类目"
        >
          <Cascader
            options={options}
            style={{width: 360}}
            placeholder="请选择"
          />
        </FormItem>
      </Modal>
    )
  }
}
