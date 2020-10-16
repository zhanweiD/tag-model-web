import {useEffect, useState} from 'react'
import OnerFrame from '@dtwave/oner-frame' 

import CommonTagCopy from './tab'

export default () => {
  const ctx = OnerFrame.useFrame()
  ctx.useProject(false)
  ctx.useSider(true)
  // const projectId = ctx.useProjectId()
  const projectId = null
  console.log(3)
  // useEffect(() => {
  //   ctx.useProject(false)
  //   ctx.useSider(true)
  // }, [projectId])

  return (
    <div>
      <CommonTagCopy key={projectId} projectId={projectId} />
    </div>
  )
}
