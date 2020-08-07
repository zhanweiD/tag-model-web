import {useEffect} from 'react'
import OnerFrame from '@dtwave/oner-frame' 

import Main from './project-tag'

export default () => {
  const ctx = OnerFrame.useFrame()
  const projectId = ctx.useProjectId()

  useEffect(() => {
    ctx.useProject(true)
    ctx.useSider(true)
  }, [projectId])

  return (
    <Main key={projectId} projectId={projectId} />
  )
}
