import {useEffect, useState} from 'react'
import OnerFrame from '@dtwave/oner-frame' 

import CommonTagCopy from './tab'

console.log(2)
export default () => {
  console.log(2)
  const ctx = OnerFrame.useFrame()
  const projectId = ctx.useProjectId()
  useEffect(() => {
    ctx.useProject(false)
    ctx.useSider(true)
  }, [projectId])

  return (
    <div>
      <CommonTagCopy key={projectId} projectId={projectId} />
    </div>
  )
}
