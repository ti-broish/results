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

  return RISKS.map((risk) => {
    risk.percentage = percentage[risk.name]
    risk.count = count[risk.name]

    return risk
  })
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

  return POPULATED_CATEGORIES.map((category) => {
    category.percentage = percentage[category.name]
    category.count = count[category.name]

    return category
  })
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

  return PROCESSED_CATEGORIES.map((category) => {
    category.percentage = percentage[category.name]
    category.count = count[category.name]

    return category
  })
}
