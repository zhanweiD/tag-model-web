import {useEffect} from 'react'
import OnerFrame from '@dtwave/oner-frame' 

import CommonTag from './tab'

export default () => {
  const ctx = OnerFrame.useFrame()
  const projectId = ctx.useProjectId()

  useEffect(() => {
    ctx.useProject(true)
  }, [projectId])

  return (
    <CommonTag key={projectId} projectId={projectId} />
  )
}
