const format = function (number, n, x, s, c) {
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
    num = parseFloat(number).toFixed(Math.max(0, ~~n))

  return (c ? num.replace('.', c) : num).replace(
    new RegExp(re, 'g'),
    '$&' + (s || ',')
  )
}

const pad = function (num) {
  var s = String(num)
  while (s.length < 2) {
    s = '0' + s
  }
  return s
}

const formatCount = function (number) {
  return format(number, 0, 3, ' ', ',')
}

const formatPercentage = function (number) {
  return format(100 * number, 2, 3, ' ', ',')
}

const formatDateTime = function (dateTime) {
  return formatTime(dateTime) + ', ' + formatDate(dateTime)
}

const formatTime = function (dateTime) {
  const date = new Date(dateTime)
  return pad(date.getHours()) + ':' + pad(date.getMinutes())
}

const formatDate = function (dateTime) {
  const date = new Date(dateTime)

  return (
    formatDay(date.getDate()) +
    ' ' +
    month(date.getMonth()) +
    ' ' +
    date.getFullYear()
  )
}

const formatDay = function (d) {
  if (d >= 10 && d <= 20) return d + '-ти'

  switch (d % 10) {
    case 1:
      return d + '-ви'
      break
    case 2:
      return d + '-ри'
      break
    case 7:
    case 8:
      return d + '-ми'
      break
    default:
      return d + '-ти'
      break
  }
}

const month = function (monthStr) {
  switch (monthStr) {
    case 0:
      return 'януари'
      break
    case 1:
      return 'февруари'
      break
    case 2:
      return 'март'
      break
    case 3:
      return 'април'
      break
    case 4:
      return 'май'
      break
    case 5:
      return 'юни'
      break
    case 6:
      return 'юли'
      break
    case 7:
      return 'август'
      break
    case 8:
      return 'септември'
      break
    case 9:
      return 'октомври'
      break
    case 10:
      return 'ноември'
      break
    case 11:
      return 'декември'
      break
  }
}

module.exports = {
  formatCount,
  formatPercentage,
  formatDateTime,
}
