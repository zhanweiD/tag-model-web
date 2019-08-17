import {Component} from 'react'
import {observable, action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Upload, Icon, Button} from 'antd'
import {withRouter} from 'react-router-dom'
import {errorTip} from '../common/util'
import store from './store-tag-import'

const {Dragger} = Upload

@observer
class StepTwo extends Component {
  @observable fileName = ''
  @observable uploadContent = false

  @action beforeUpload = file => {
    const isLt10M = file.size / 1024 / 1024 < 100
    if (!isLt10M) {
      errorTip('文件不能大于100MB!')
    }
    return isLt10M
  }

  @action changeUploadStatus = info => {
    const fileInfo = info.file
    if (fileInfo.status === 'uploading') return
    if (fileInfo.status === 'done') {
      if (fileInfo.response.success) {
        this.fileName = fileInfo.originFileObj.name
        this.uploadContent = fileInfo.response.content
      } else {
        errorTip(fileInfo.response.message)
      }
    } else if (fileInfo.status === 'error') {
      errorTip(fileInfo.response.message)
    }
  }

  @action handleRemove = () => {
    store.previewDataHead.clear()
    store.previewDataList.clear()
  }

  @action goBack = () => {
    store.currStep = 0
    this.fileName = ''
    this.uploadContent = false
  }

  componentWillUnmount() {
    this.goBack()
  }

  render() {
    const {pathPrefix} = window.__onerConfig
    const uploadProps = {
      name: 'file',
      // multiple: true,
      action: `${pathPrefix}/upload/tag`,
      accept: '.xlsx, .xls, .csv, text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      onChange: info => this.changeUploadStatus(info),
      beforeUpload: file => this.beforeUpload(file),
      onRemove: file => this.handleRemove(file),
    }
    return (
      <div style={{width: '500px'}}>
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
          <p className="ant-upload-hint">支持扩展名：.xlsx/.xls/.csv</p>
        </Dragger>

        <div className="FBH FBJB pt4">
          <span>{this.fileName}</span>
          <a onClick={() => {
            window.open(`${pathPrefix}/file/download/api/v1/be_tag/import/template/download`)
          }}>点击下载模版</a>
        </div>
        

        <div className="fac mt48">
          <Button
            size="large"
            className="mr12"
            onClick={this.goBack}
          >
            上一步
          </Button>
          <Button
            type="primary"
            size="large"
            disabled={!this.fileName}
            onClick={() => store.getPreviewData(toJS(this.uploadContent))}
          >
            下一步
          </Button>
        </div>
      </div>
    )
  }
}
export default withRouter(StepTwo)
