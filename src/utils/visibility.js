const hasElectionDayEnded = (meta) => {
  if (!meta?.endOfElectionDayTimestamp) {
    return false
  }

  return new Date() > new Date(meta.endOfElectionDayTimestamp)
}

const isNearElectionDayEnd = (meta) => {
  if (!meta?.endOfElectionDayTimestamp) {
    return false
  }

  const tenMinutesBefore =
    new Date(meta.endOfElectionDayTimestamp).getTime() - 10 * 60 * 1000
  return new Date().getTime() > tenMinutesBefore
}

export const shouldAllowSendingProtocols = (meta) => hasElectionDayEnded(meta)

export const shouldShowOfficialStreaming = isNearElectionDayEnd

// Only show results, when they are available and after election day end
export const shouldShowResults = (results, meta) => {
  return false
  if (!results) return false

  return results.length > 0 && shouldAllowSendingProtocols(meta)
}
