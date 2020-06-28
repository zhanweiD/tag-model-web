

/**
 * @description 项目组件
 */

// import {Component, useEffect} from 'react'
import OnerFrame from '@dtwave/oner-frame'
import NoData from '../no-data'
// import Loading from '../loading'

export default PageComponent => {
  function ProjectProvider(props) {
    const ctx = OnerFrame.useFrame()
    const projectId = ctx.useProjectId()

    const noProjectDataConfig = {
      text: '没有任何项目，去创建项目吧！',
    }
    
    if (!projectId) {
      return (
        <NoData
          {...noProjectDataConfig}
        />
      )
    }

    return (
      <div style={{height: '100%'}}>
        <PageComponent key={projectId} projectId={projectId} {...props} />
      </div>
    )
  }
  return ProjectProvider
}

// /**
//  * @description 项目组件
//  */

// import {Component} from 'react'
// import {action} from 'mobx'
// import {observer} from 'mobx-react'

// import NoData from '../no-data'
// import Loading from '../loading'
// import BackConfig from './back-config'
// import ConfigModal from './configModal'
// import store from './store'
// import './main.styl'

// @observer
// export default PageComponent => {
//   class ProjectProvider extends Component {
//     @action openModal = () => {
//       store.visible = true
//       // store.getDataTypeSource()
//     }
//     // 跳转到项目列表
//     goProjectList = () => {
//       window.location.href = `${window.__keeper.pathHrefPrefix || '/'}/project`
//     }

//     renderNodata = () => {
//       const {spaceInfo} = window
//       const {initVisible} = store
//       // const noProjectDataConfig = {
//       //   btnText: '去创建项目',
//       //   onClick: this.goProjectList,
//       //   text: '没有任何项目，去项目列表页创建项目吧！',
//       //   code: 'asset_tag_project_add',
//       //   noAuthText: '没有任何项目',
//       // }
//       const noDataConfig = {
//         btnText: '去初始化',
//         onClick: () => this.openModal(),
//         text: '初始化',
//       }
//       // console.log(spaceInfo, spaceInfo.finish, spaceInfo.projectList.length)
//       if (spaceInfo && spaceInfo.finish && !spaceInfo.projectList.length) {
//         return (
//           // <NoData
//           //   {...noProjectDataConfig}
//           // />
//           initVisible ? (
//             <NoData
//               {...noDataConfig}
//             />
//           ) : (
//             <BackConfig store={store} />
//           )
//         )
//       }
//       return <Loading mode="block" height={200} />
//     } 
//     componentWillMount() {
//       const {spaceInfo} = window
//       store.projectId = spaceInfo && spaceInfo.projectId

//       // store.hasInit()
//     }
    
//     render() {
//       const {spaceInfo} = window
//       return (
//         <div style={{height: '100%'}} className="config">
//           {
//             spaceInfo && spaceInfo.projectId && spaceInfo.projectList && spaceInfo.projectList.length && false
//               ? (
//                 <PageComponent {...this.props} />
//               ) : this.renderNodata()
//           }
//           <ConfigModal store={store} />
//         </div>
//       )
//     }
// }
// return ProjectProvider
// }
