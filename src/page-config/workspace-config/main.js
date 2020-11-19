
/**
 * @description 系统环境配置
 */

import {useEffect, useState} from 'react'
// import {FormOutlined} from '@ant-design/icons'
import {Button, Popconfirm, Modal, Table, Badge} from 'antd'
import {ExclamationCircleOutlined} from '@ant-design/icons'
import {projectProvider, Authority} from '../../component'
import ConfigModal from './modal'
import SourceModal from './source-modal'
import io from './io'
import {successTip, errorTip, Time} from '../../common/util'

const WorkspaceConfig = ({projectId}) => {
  const [config, changeConfig] = useState({})
  const [visible, changeVisible] = useState(false)
  const [workspace, changeWorkspace] = useState([])
  const [isAdd, changeIsAdd] = useState(true)

  const [sourceVisible, setSourceVisible] = useState(false)
  const [dataType, changeDataType] = useState([])
  const [dataSource, changedataSource] = useState([])

  // 获取初始化配置
  async function getWorkspace() {
    try {
      const res = await io.getWorkspace({
        projectId,
      })
      changeConfig(res)
    } catch (error) {
      errorTip(error.message)
    }
  }

  // 获取环境列表
  async function getWorkspaceList() {
    try {
      const res = await io.getWorkspaceList({
        projectId,
      })
      let workspaceList = []
      if (res) {
        workspaceList = res || []
      }
      changeWorkspace(workspaceList)
    } catch (error) {
      errorTip(error.message)
    }
  }

  // 初始化项目
  async function initProject(params) {
    try {
      const res = await io.initProject({
        ...params,
        projectId,
      })
  
      if (res) {
        successTip('初始化成功')
        changeVisible(false)
        getWorkspace()
      }
    } catch (error) {
      errorTip(error.message)
    }
  }

  // 修改初始化配置
  async function updateWprkspace(params) {
    try {
      const res = await io.updateWprkspace({
        ...params,
        id: config.id,
        projectId,
      })
  
      if (res) {
        getWorkspace()
        successTip('修改成功')
        changeVisible(false)
        changeIsAdd(true)
      }
    } catch (error) {
      errorTip(error.message)
    }
  }

  useEffect(() => {
    getWorkspace(projectId)
  }, [projectId])

  const editClick = () => {
    changeVisible(true)
    changeIsAdd(false)
    getWorkspaceList()
  }

  const onCancel = () => {
    changeVisible(false)
    changeIsAdd(true)
  }

  const onCreate = params => {
    changeIsAdd(true)
    initProject(params)
  }

  const onUpdate = params => {
    updateWprkspace(params)
  }

  const columns = [
    {
      title: '数据源名称',
      dataIndex: 'storageName',
    }, {
      title: '数据源类型',
      dataIndex: 'storageType',
    }, {
      title: '描述',
      dataIndex: 'descr',
    }, {
      title: '添加时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: text => <Time timestamp={text} />,
    }, {
      title: '使用状态',
      key: 'status',
      dataIndex: 'status',
      render: text => (text ? <Badge color="#108ee9" text="使用中" /> : <Badge color="#d9d9d9" text="未使用" />),
    }, {
      title: '操作',
      dataIndex: 'aa',
    },
  ]

  const showAddModal = () => {
    setSourceVisible(true)
  }
  
  const selectDataType = type => {
    getDataSource(type)
  }

  // 获取数据源
  async function getDataSource(type) {
    const res = await io.getDataSource({
      projectId,
      dataStorageType: type,
    })

    const result = res || []

    changedataSource(result)
  }
 
  // 获取数据源类型
  async function getDataTypeSource() {
    const res = await io.getDataTypeSource({
      projectId,
    })

    const result = res || []

    changeDataType(result)
  }

  useEffect(() => {
    getDataTypeSource()
  }, [])

  return (
    <div>
      <div className="content-header">环境配置</div> 
      <div className="header-page p24 config-work">
        <div className="FBH FBJB">
          <div className="env-config-item">
            <div className="env-config-label">环境：</div>
            <div className="env-config-value">
              <span className="mr16">{config.workspaceName}</span>
            </div>
          </div>
          <Authority authCode="tag_config:environment_config[u]">
            <Button type="primary" onClick={editClick}>编辑</Button>
          </Authority>
        </div>
        <div className="mt24">
          <div style={{color: 'rgba(0,0,0,0.45)'}}>目的源：</div>
          <Button type="primary" className="mt8" onClick={showAddModal}>添加目的源</Button>
          <Table
            className="mt8"
            dataSource={[]}
            columns={columns}
            pagination={false}
          />
        </div>
      </div>
      <ConfigModal 
        visible={visible}
        isAdd={isAdd}
        config={config}
        workspace={workspace}
        onCancel={onCancel}
        onCreate={onCreate}
        onUpdate={onUpdate}
        projectId={projectId}
      />
      <SourceModal 
        visible={sourceVisible}
        dataType={dataType}
        dataSource={dataSource}
        projectId={projectId}
        selectDataType={selectDataType}
        onCancel={() => setSourceVisible(false)}
      />
    </div>
  )
}

export default projectProvider(WorkspaceConfig)
