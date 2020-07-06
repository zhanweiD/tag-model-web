import OnerFrame from '@dtwave/oner-frame' 

import CommonTag from './tab'

export default () => {
  const ctx = OnerFrame.useFrame()
  const projectId = ctx.useProjectId()

  return (
    <CommonTag projectId={projectId} />
  )
}
