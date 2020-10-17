import {useEffect, useState} from 'react'
import OnerFrame from '@dtwave/oner-frame' 
import store from './store'

import CommonTag from './tab'

export default () => {
  const ctx = OnerFrame.useFrame()
  const projectId = ctx.useProjectId()
  useEffect(() => {
    store.getProjects(isProject => {
      ctx.useProject(isProject)
    })
    ctx.useSider(true)
  }, [projectId])

  return (
    <div>
      <CommonTag key={projectId} projectId={projectId} />
    </div>
  )
}
