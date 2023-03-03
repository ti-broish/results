const fakeResults = (deviation, voters, parties) => {
  const results = []
  let turnout = Math.random() * 0.1 - 0.05 + 0.6

  let partyAverages = {
    0: 0.1,
    1: 0.01,
    4: 0.2,
    5: 0.01,
    9: 0.09,
    11: 0.12,
    18: 0.05,
    21: 0.01,
    24: 0.02,
    28: 0.25,
    29: 0.1,
  }

  let votesSum = 0

  parties.forEach((party) => {
    results.push(party.id)
    const multiplier = 1 - deviation + deviation * 2 * Math.random()
    const votes = multiplier * partyAverages[party.id] * voters * turnout
    results.push(Math.floor(votes))
    votesSum += Math.floor(votes)
  })

  if (votesSum > voters * turnout) {
    turnout += (votesSum - voters * turnout) / voters
    turnout *= 1 + 0.05 * Math.random()
  }

  return { results, voters, turnout }
}

export const populateWithFakeResults = (data, parties) => {
  if (data.stats) {
    const deviation =
      data.type === 'election'
        ? 0.15
        : data.type === 'electionRegion'
        ? 0.4
        : 0.15
    const { results, voters, turnout } = fakeResults(
      deviation,
      10000 + 10000 * Math.random(),
      parties
    )
    data.stats.midRisk = Math.floor(Math.random() * data.stats.sectionsCount)
    const highRisk =
      Math.floor(Math.random() * data.stats.sectionsCount) - data.stats.midRisk
    data.stats.highRisk = highRisk > 0 ? highRisk : 0
    data.stats.populated = Math.floor(Math.random() * data.stats.sectionsCount)
    data.stats.sectionsWithResults = Math.floor(
      Math.random() * data.stats.sectionsCount
    )
    data.results = results
    data.stats.voters = voters
    data.stats.validVotes = voters * turnout
    data.stats.violationsCount =
      Math.random() < 0.3 ? 0 : 10 + 1000 * Math.random()
  }
  if (data.nodes)
    data.nodes.forEach((node) => populateWithFakeResults(node, parties))
  return data
}
