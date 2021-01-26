import intl from 'react-intl-universal'

/**
 * @description 系统环境配置
 */

import {useEffect, useState} from 'react'
import {Button, Popconfirm, Modal, Table, Badge} from 'antd'
import _ from 'lodash'
import {projectProvider, Authority} from '../../component'
import ConfigModal from './modal'
import SourceModal from './source-modal'
import io from './io'
import {successTip, errorTip, Time} from '../../common/util'

const useFetch = (ioFunc, params, afterFetch = () => {}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState(null)
  const [refetchIndex, setRefetchIndex] = useState(0)

  const refetch = () => setRefetchIndex(index => index + 1)

  useEffect(() => {
    setIsLoading(true)

    const fetchData = async () => {
      try {
        const res = await ioFunc(params)

        setData(res)
        setIsLoading(false)
        afterFetch(res)
      } catch (error) {
        console.error(error.message)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [refetchIndex])

  return [data, isLoading, refetch]
}

const useSingleFetch = (ioFunc, params, afterFetch = () => {}) => {
  const fetchData = async () => {
    try {
      const res = await ioFunc(params)
      afterFetch(res)
    } catch (error) {
      console.error(error.message)
    }
  }

  fetchData()
}

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
        successTip(
          intl
            .get('ide.src.component.project-provider.store.2qjw8hay0zb')
            .d('初始化成功')
        )
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
        successTip(
          intl
            .get('ide.src.page-config.workspace-config.main.j2n3mkaqsw')
            .d('修改成功')
        )
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

  const [tableDatas, isLoading, refetch] = useFetch(
    io.listStorage,
    {
      projectId,
    },
    datas => {
      console.log(datas)
    }
  )

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
      title: intl
        .get('ide.src.page-config.workspace-config.main.nwdqfz5kwj')
        .d('数据源名称'),
      dataIndex: 'storageName',
    },
    {
      title: intl
        .get('ide.src.page-config.workspace-config.main.1b0l5lpgghm')
        .d('数据源类型'),
      dataIndex: 'storageType',
      render: text => {
        const target = _.find(dataType, e => e.type === text)
        if (target) {
          return target.name
        }
        return ''
      },
    },
    {
      title: intl
        .get('ide.src.component.modal-stroage-detail.main.lyqo7nv5t9h')
        .d('描述'),
      dataIndex: 'descr',
    },
    {
      title: intl
        .get('ide.src.page-config.workspace-config.main.dd9xgr2e3he')
        .d('添加时间'),
      dataIndex: 'createTime',
      key: 'createTime',
      render: text => <Time timestamp={text} />,
    },
    {
      title: intl
        .get('ide.src.page-config.workspace-config.main.4eyw4o6e3dr')
        .d('使用状态'),
      dataIndex: 'isUsed',
      render: text => (text ? (
        <Badge
          color="#108ee9"
          text={intl
            .get('ide.src.page-config.workspace-config.main.ztbqzsc34bb')
            .d('使用中')}
        />
      ) : (
        <Badge
          color="#d9d9d9"
          text={intl.get('ide.src.component.tag.tag.ogvpoe5m3bg').d('未使用')}
        />
      )),
    },
    {
      title: intl
        .get('ide.src.page-common.approval.approved.main.1tcpwa6mu1')
        .d('操作'),
      render: (text, record) => (record.isUsed ? (
        <Authority authCode="tag_config:environment_config[u]">
          <span className="disabled">
            {intl
              .get('ide.src.page-config.workspace-config.main.i53j7u2d9hs')
              .d('移除')}
          </span>
        </Authority>
      ) : (
        <Authority authCode="tag_config:environment_config[u]">
          <Popconfirm
            placement="topRight"
            title={intl
              .get('ide.src.page-config.workspace-config.main.8rob11wp0c')
              .d('你确定要移除该数据源吗？')}
            onConfirm={() => removeStorage(record.storageId)}
          >
            <a>
              {intl
                .get('ide.src.page-config.workspace-config.main.i53j7u2d9hs')
                .d('移除')}
            </a>
          </Popconfirm>
        </Authority>
      )),
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

  const addStorage = params => {
    useSingleFetch(
      io.addStorage,
      {
        projectId,
        ...params,
      },
      res => {
        setSourceVisible(false)
        refetch()
        successTip(
          intl
            .get('ide.src.page-config.workspace-config.main.91qopphasx')
            .d('添加成功')
        )
      }
    )
  }

  const removeStorage = storageId => {
    useSingleFetch(
      io.removeStorage,
      {
        projectId,
        storageId,
      },
      res => {
        successTip(
          intl
            .get('ide.src.page-config.workspace-config.main.e6ux8lx1pde')
            .d('移除成功')
        )
        refetch()
      }
    )
  }

  return (
    <div>
      <div className="content-header">
        {intl
          .get('ide.src.component.project-provider.back-config.jxcvund1fi')
          .d('环境配置')}
      </div>
      <div className="header-page p24 config-work">
        <div className="FBH FBJB">
          <div className="env-config-item">
            <div className="env-config-label">
              {intl
                .get('ide.src.page-config.workspace-config.main.vx86ea6qotd')
                .d('环境：')}
            </div>
            <div className="env-config-value">
              <span className="mr16">{config.workspaceName}</span>
            </div>
          </div>
          <Authority authCode="tag_config:environment_config[u]">
            <Button type="primary" onClick={editClick}>
              {intl
                .get('ide.src.component.label-item.label-item.slnqvyqvv7')
                .d('编辑')}
            </Button>
          </Authority>
        </div>
        <div>
          {/* <div style={{color: 'rgba(0,0,0,0.45)'}}>目的源：</div> */}
          <Authority authCode="tag_config:environment_config[u]">
            <Button type="primary" className="mt8" onClick={showAddModal}>
              {intl
                .get('ide.src.page-config.workspace-config.main.bfslcmhzzgi')
                .d('添加目的源')}
            </Button>
          </Authority>
          <Table
            loading={isLoading}
            className="mt8"
            dataSource={tableDatas}
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
        tableDatas={tableDatas}
        projectId={projectId}
        selectDataType={selectDataType}
        onOk={addStorage}
        onCancel={() => setSourceVisible(false)}
      />
    </div>
  )
}

export default projectProvider(WorkspaceConfig)
