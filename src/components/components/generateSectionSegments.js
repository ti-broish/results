// ----------------------------------------------------------------------------
// Const
// ----------------------------------------------------------------------------

const RISKS = [
  {
    displayName: `Висок риск`,
    name: `High`,
    color: `#9C1414`,
  },
  {
    displayName: `Среден риск`,
    name: `Medium`,
    color: `#F7B00D`,
  },
  {
    displayName: `Нисък риск`,
    name: `Low`,
    color: `#0a7399`,
  },
]

const POPULATED_CATEGORIES = [
  {
    displayName: `Покрити секции`,
    name: `populated`,
    color: `#0a7399`,
  },
  {
    displayName: `Непокрити секции`,
    name: `nonPopulated`,
    color: `#9C1414`,
  },
]

const PROCESSED_CATEGORIES = [
  {
    displayName: `Обработени секции`,
    name: `processed`,
    color: `#0a7399`,
  },
  {
    displayName: `Необработени секции`,
    name: `unProcessed`,
    color: `#9C1414`,
  },
]

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

const mapCountAndPercentage = (items, percentage, count) => {
  return items.map((item) => {
    item.percentage = percentage[item.name]
    item.count = count[item.name]

    return item
  })
}

export const generateRisks = ({ highRisk, midRisk, sectionsCount }) => {
  const percentage = {
    High: highRisk / sectionsCount,
    Medium: midRisk / sectionsCount,
    Low: (sectionsCount - (highRisk + midRisk)) / sectionsCount,
  }

  const count = {
    High: highRisk,
    Medium: midRisk,
    Low: sectionsCount - (highRisk + midRisk),
  }

  return mapCountAndPercentage(RISKS, percentage, count)
}

export const generatePopulated = ({ populated, sectionsCount }) => {
  const percentage = {
    populated: populated / sectionsCount,
    nonPopulated: (sectionsCount - populated) / sectionsCount,
  }

  const count = {
    populated: populated,
    nonPopulated: sectionsCount - populated,
  }

  return mapCountAndPercentage(POPULATED_CATEGORIES, percentage, count)
}

export const generateProcessed = ({ sectionsWithResults, sectionsCount }) => {
  const percentage = {
    processed: sectionsWithResults / sectionsCount,
    unProcessed: (sectionsCount - sectionsWithResults) / sectionsCount,
  }

  const count = {
    processed: sectionsWithResults,
    unProcessed: sectionsCount - sectionsWithResults,
  }

  return mapCountAndPercentage(PROCESSED_CATEGORIES, percentage, count)
}
