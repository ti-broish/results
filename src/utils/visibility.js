const hasElectionDayEnded = (meta) => {
  if (!meta?.endOfElectionDayTimestamp) {
    return false
  }

  return new Date() > new Date(meta.endOfElectionDayTimestamp)
}

export const shouldAllowSendingProtocols = (meta) => hasElectionDayEnded(meta)

export const shouldShowOfficialStreaming = hasElectionDayEnded

// Only show results, when they are available and after election day end
export const shouldShowResults = (results, meta) => {
  if (!results) return false

  return results.length > 0 && shouldAllowSendingProtocols(meta)
}
