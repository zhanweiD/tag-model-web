import {Component} from 'react'
import {
  observable, action, computed,
} from 'mobx'
import {observer} from 'mobx-react'
import {
  Table, Spin, Checkbox, Modal,
} from 'antd'
import {NoData, AuthBox} from '../../component'

const {confirm} = Modal

@observer
export default class DataSource extends Component {
  @observable checkAll = false
  @observable indeterminate = false

  columns = [{
    title: '所属分类',
    dataIndex: 'objTypeName',
  }, {
    title: '对象名称',
    dataIndex: 'objName',
  }, {
    title: '所属类目',
    dataIndex: 'catName',
  }, {
    title: '标签名称',
    dataIndex: 'tagName',
  }, {
    title: '标签英文名',
    dataIndex: 'tagEnName',
  }, {
    title: '目的字段',
    dataIndex: 'filedName',
  }]

  @computed get selectLen() {
    const {store: {dbSourcSelectList}} = this.props
    return dbSourcSelectList.filter(item => item).length
  }


  @action onItemSelect(index, e) {
    const {store: {dbSourcSelectList}} = this.props
    const value = e.target.checked
    dbSourcSelectList[index] = value

    if (this.selectLen) {
      // 全选
      if (this.selectLen === dbSourcSelectList.length) {
        this.checkAll = true
        this.indeterminate = false
        return
      }

      // 非全选
      this.checkAll = false
      this.indeterminate = true
    } else {
      // 全不选
      this.checkAll = false
      this.indeterminate = false
    }
  }

  // 控制全选
  @action onAllSelect(e) {
    const {store} = this.props
    const value = e.target.checked

    this.checkAll = value
    this.indeterminate = false

    store.dbSourcSelectList = Array.from({length: store.dbSourcSelectList.length}, () => value)
  }

  // 批量移除
  @action remove = () => {
    const {store} = this.props
    const {sourceData, dbSourcSelectList} = store

    const list = []

    // 筛选选中项
    dbSourcSelectList.forEach((item, index) => {
      if (item) list.push(sourceData.data[index])
    })


    const delTableList = []
    const storageIdList = []
    // 筛选参数
    list.forEach(item => {
      delTableList.push(item.tableName)
      storageIdList.push(item.storageId)
    })

    const params = {
      delTableList,
      storageIdList,
    }
 
    const that = this
    confirm({
      title: '确认移除 ？',
      content: '将会移除选择的目的数据源',
      onOk() {
        store.dbSourceDel(params)
        that.checkAll = false
        that.indeterminate = false
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  render() {
    const {
      store: {
        sourceData, dbSourcSelectList, info, functionCodes,
      }, onClick,
    } = this.props

    const noDataConfig = {
      code: 'asset_tag_project_occ_data_source',
      noAuthText: '您暂无添加目的数据源的权限',
      btnText: '添加目的数据源',
      btnDisabled: info.used,
      onClick: () => onClick(),
      isLoading: sourceData.loading,
      myFunctionCodes: functionCodes,
    }

    return (
      <div className="data-source p16">
        <Spin spinning={sourceData.loading}>
          {
            sourceData.data.length ? (
              <div className="bgf p24">
                <div className="FBH FBJ FBAC mb16">
                  <AuthBox 
                    code="asset_tag_project_occ_data_source" 
                    myFunctionCodes={functionCodes}
                    isButton={false}
                  >                           
                    <Checkbox 
                      checked={this.checkAll}
                      indeterminate={this.indeterminate}
                      onChange={e => this.onAllSelect(e)}
                      disabled={info.used}
                    >
                    全选
                    </Checkbox>
                  </AuthBox>
                  <div>
                    <AuthBox 
                      code="asset_tag_project_occ_data_source" 
                      myFunctionCodes={functionCodes}
                      className="mr8" 
                      disabled={!this.selectLen || info.used}
                      onClick={this.remove}
                    >                           
                      批量移除数据源
                    </AuthBox>
                    {/* 点击“配置数据服务”按钮，跳转至服务管理页面 */}
                    <a 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      href="/service/index.html#/api"
                    >
                      <AuthBox 
                        myFunctionCodes={functionCodes}
                        code="asset_tag_project_occ_data_source" 
                        type="primary"
                      >
                     
                      配置数据服务
                     
                      </AuthBox>
                    </a>
                  </div>
                </div>
                {
                  dbSourcSelectList.map((item, index) => (
                    <div className="mb48">
                      <div className="mb24 FBH FBJ FBAC">
                        <div className="fs14">
                          <AuthBox 
                            myFunctionCodes={functionCodes}
                            code="asset_tag_project_occ_data_source"
                            isButton={false}
                          >  
                            <Checkbox 
                              checked={item}
                              disabled={info.used}
                              onChange={v => this.onItemSelect(index, v)}
                            />
                          </AuthBox>
                          <span className="mr48">
                            目的数据源：
                            {sourceData.data[index].sourceName}
                          </span>
                          <span>
                            目的数据表：
                            {sourceData.data[index].tableName}
                          </span>
                        </div>
                      </div>
                      <Table 
                        columns={this.columns} 
                        // loading={sourceData.loading}
                        dataSource={sourceData.data[index].details.slice()} 
                        pagination={false}
                      />
                      <div className="total-box">
                        合计
                        {sourceData.data[index].total}
                        条记录
                      </div>
                    </div>
                  )) }
              </div>
            ) : <NoData {...noDataConfig} />
          }
        </Spin>
      </div>
    )
  }
}
