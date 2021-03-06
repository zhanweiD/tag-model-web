import intl from 'react-intl-universal'
import { action, runInAction, observable, toJS } from 'mobx'
import { CycleSelect } from '@dtwave/uikit'
import { cycleSelectMap } from '../util'
import { successTip, failureTip, errorTip, listToTree } from '../../common/util'
import io from './io'

export default class Store {
  constructor(rootStore) {
    this.rootStore = rootStore
    this.codeStore = rootStore.codeStore
    this.listStore = rootStore.listStore
  }

  projectId
  @observable loading = false
  @observable drawerVisible = false
  @observable drawerType
  @observable currentStep = 0

  @observable paramsForm = null
  @observable drawerThreeForm = null

  @observable schemeDetail = {}

  @action.bound closeDrawer() {
    this.drawerVisible = false
    this.destory()
  }

  @action.bound destory() {
    this.codeStore.isRuned = false
    this.currentStep = 0
    this.drawerType = undefined
    this.schemeDetail = {}
    this.submitLoading = false
    this.searchKey = undefined

    this.codeStore.runStatusMessage = {
      status: '',
      message: '',
      download: false,
    }

    this.codeStore.runLoading = false
    this.codeStore.tableData = [
      {
        title: intl
          .get('ide.src.page-process.schema-list.store-code.fu5tdj8j9k7')
          .d('运行日志'),
        resultId: 'running_log',
      },
    ]
  }

  // 上一步
  @action.bound lastStep() {
    this.currentStep = this.currentStep - 1
  }

  // 下一步
  @action.bound nextStep() {
    this.currentStep = this.currentStep + 1
  }

  // ************************* 方案详情 start ************************* //

  @action async getSchemeDetail(params, cb) {
    this.loading = true
    try {
      const res = await io.getSchemeDetail({
        projectId: this.projectId,
        ...params,
      })

      runInAction(() => {
        const data = res

        if (res.scheduleType === 1) {
          // 转为cron表达式（调度时间）
          const expression = CycleSelect.cronSrialize(res.scheduleExpression)

          // 调度周期
          data.period = cycleSelectMap[expression.cycle]
          // 调度时间
          data.periodTime = expression.time
        }

        this.schemeDetail = { ...this.schemeDetail, ...data }
        if (cb) cb(res)
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }

  @action async getSchemeConfigInfo(params, cb) {
    this.loading = true
    try {
      const res = await io.getSchemeConfigInfo({
        projectId: this.projectId,
        ...params,
      })

      runInAction(() => {
        this.schemeDetail = { ...this.schemeDetail, ...res }
        if (cb) cb(res)
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }
  // ************************* 方案详情 end ************************* //

  // ************************* 基础信息 start ************************* //
  @observable objList = []
  // @observable objName
  // @observable objId
  // @observable obj = [] // 用于第三步 主标签配置
  @observable objDetail = {}

  // 基础信息
  @observable oneForm = {}
  @observable oneStepSuccess = false

  @action async getObjList() {
    try {
      const res = await io.getObjList({
        projectId: this.projectId,
      })

      runInAction(() => {
        this.objList = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 获取 对象详情
   */
  @action async getObjDetail(params, cb) {
    try {
      const res = await io.getObjDetail({
        projectId: this.projectId,
        ...params,
      })

      runInAction(() => {
        if (cb) cb(res)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 重名校验
   */
  @action async checkName(params, cb) {
    try {
      const res = await io.checkName({
        projectId: this.projectId,
        ...params,
      })

      if (res.isExit) {
        cb(
          intl
            .get(
              'ide.src.page-manage.page-aim-source.source-list.store.o07pkyecrw'
            )
            .d('名称已存在')
        )
      } else {
        cb()
      }
    } catch (e) {
      errorTip(e.message)
    }
  }
  // ************************* 基础信息 end *************************** //

  // ************************* 函数树 & 标签树 start ************************* //
  @observable treeLoading = false

  @observable searchKey = undefined
  @observable expandAll = false
  @observable treeData = [] // 类目树数据
  @observable promptData = {} // code自定义提示
  @observable searchExpandedKeys = [] // 关键字搜索展开的树节点

  @action findParentId(id, data, expandedKeys) {
    data.forEach(item => {
      if (item.parentId !== 0 && item.id === id) {
        expandedKeys.push(item.parentId)
        this.findParentId(item.parentId, data, this.searchExpandedKeys)
      }
    })
  }

  listToPrompt(data, objEnName) {
    const newData = _.cloneDeep(data)
    return newData.map(item => {
      if (item.type === 0) {
        return objEnName.push(item.enName)
      }
      if (item.children) {
        this.listToPrompt(item.children, objEnName)
      }
    })
  }

  /**
   * @description 获取 逻辑配置-标签树
   */
  @action async getTagTree(cb) {
    this.treeLoading = true
    try {
      const res = await io.getTagTree({
        projectId: this.projectId,
        searchKey: this.searchKey,
      })

      runInAction(() => {
        this.treeLoading = false
        this.searchExpandedKeys.clear()

        let data = res

        // 判断是否进行搜索
        if (this.searchKey) {
          data = res.map(item => {
            // 关键字搜索定位
            if (this.searchKey && item.name.includes(this.searchKey)) {
              this.findParentId(item.id, res, this.searchExpandedKeys)
            }
            return item
          })
        }

        this.treeData = listToTree(data)
        const obj = {}
        this.treeData.forEach(item => {
          if (item.children) {
            this.listToPrompt(item.children, (obj[item.enName] = []))
          }
        })
        this.promptData = obj
        if (cb) cb()
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.treeLoading = false
      })
    }
  }

  /**
   * @description 获取 逻辑配置-函数树
   */
  @action async getFunTree() {
    this.treeLoading = true
    try {
      const res = await io.getFunTree({
        projectId: this.projectId,
      })

      runInAction(() => {
        // this.treeData = listToTree(res)
        this.treeData = res.map(d => ({
          id: d,
          aId: d,
          name: d,
          parentId: 0,
        }))
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.treeLoading = false
      })
    }
  }

  // ************************* 函数树 & 标签树 end ************************* //

  /**
   * @description 方案保存
   */
  @action async saveSchema(p, type, cb) {
    const params = this.getSaveParams()

    try {
      const res = await io.saveSchema({
        ...p,
        ...params,
        projectId: this.projectId,
      })

      runInAction(() => {
        if (res) {
          // 处于第一步
          if (this.currentStep === 0) {
            successTip(
              intl
                .get(
                  'ide.src.page-process.schema-list.store-drawer.hqdi7wxgw36'
                )
                .d('保存成功')
            )
            this.closeDrawer()
            this.listStore.getList({
              currentPage: 1,
              pageSize: 10,
            })
          }

          // 处于第二步
          if (this.currentStep === 1) {
            successTip(
              intl
                .get(
                  'ide.src.page-process.schema-list.store-drawer.hqdi7wxgw36'
                )
                .d('保存成功')
            )
            this.closeDrawer()
            this.listStore.getList({
              currentPage: 1,
              pageSize: 10,
            })
          }

          // 处于第二步 点❌保存
          if (this.currentStep === 2 && type === 'close') {
            successTip(
              intl
                .get(
                  'ide.src.page-process.schema-list.store-drawer.hqdi7wxgw36'
                )
                .d('保存成功')
            )
            this.closeDrawer()
            this.listStore.getList({
              currentPage: 1,
              pageSize: 10,
            })
          }

          // 处于第三步 点击下一步保存
          if (this.currentStep === 2 && type === 'next') {
            successTip(
              intl
                .get(
                  'ide.src.page-process.schema-list.store-drawer.hqdi7wxgw36'
                )
                .d('保存成功')
            )
            this.schemeDetail.id = res
            this.listStore.getList({
              currentPage: 1,
              pageSize: 10,
            })

            this.nextStep()
          }

          if (cb) cb()
        } else {
          failureTip(
            intl
              .get('ide.src.page-process.schema-list.store-drawer.ba6ox0mh9e')
              .d('保存失败')
          )
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 保存方案入參处理
  @action.bound getSaveParams() {
    const {
      id,
      objId,
      name,
      descr,
      source,
      parameterMappingKeys,
      fieldInfo,
      mainTagMappingKeys,
      isPartitioned,
      partitionMappingKeys,
      scheduleType,
      scheduleExpression,
    } = this.schemeDetail

    const fieldInfoFilter =
      fieldInfo &&
      fieldInfo.map(d => {
        const data = { ...d }
        delete data.disabled
        delete data.objId
        return data
      })

    const params = {
      projectId: this.projectId,
      objId,
      name,
      descr: descr || undefined,
      source,
      parameterMappingKeys: parameterMappingKeys || undefined,
      fieldInfo: fieldInfoFilter,
      mainTagMappingKeys,
      isPartitioned,
      partitionMappingKeys: partitionMappingKeys || undefined,
      scheduleType,
      scheduleExpression: scheduleExpression || undefined,
    }

    if (id) {
      params.id = id
    }

    return params
  }

  @observable submitLoading = false

  // 提交方案
  @action async submitScheme(params) {
    this.submitLoading = true
    try {
      const res = await io.submitScheme({
        projectId: this.projectId,
        ...params,
      })

      runInAction(() => {
        if (res === 1) {
          successTip(
            intl
              .get(
                'ide.src.page-manage.page-tag-sync.sync-detail.main.yf96acx8evb'
              )
              .d('提交成功')
          )
          this.closeDrawer()
          this.listStore.getList({
            currentPage: 1,
            pageSize: 10,
          })
        } else {
          failureTip(
            intl
              .get(
                'ide.src.page-manage.page-tag-sync.sync-detail.main.2n0b3tsdnkb'
              )
              .d('提交失败')
          )
          this.closeDrawer()
          this.listStore.getList({
            currentPage: 1,
            pageSize: 10,
          })
        }
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.submitLoading = false
      })
    }
  }
}
