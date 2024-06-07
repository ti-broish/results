export const shouldAllowSendingProtocols = (meta) => {
  if (!meta?.endOfElectionDayTimestamp) {
    return false
  }

  return new Date() > new Date(meta.endOfElectionDayTimestamp)
}
