import {useEffect, useState} from 'react'
import OnerFrame from '@dtwave/oner-frame' 

import CommonTag from './tab'

console.log(1)

export default () => {
  const ctx = OnerFrame.useFrame()
  const projectId = ctx.useProjectId()
  useEffect(() => {
    // console.log(projectId)
    if (projectId) {
      ctx.useProject(true)
    } else {
      ctx.useProject(false)
    }
    // ctx.useProject(true)
    ctx.useSider(true)
  }, [projectId])

  return (
    <div>
      <CommonTag key={projectId} projectId={projectId} />
    </div>
  )
}
