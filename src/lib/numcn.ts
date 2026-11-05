// 金額轉中文大寫
export function toChineseCapital(num: number): string {
  if (!isFinite(num) || num < 0) return ''
  if (num === 0) return '零元整'
  const digits = '零壹貳參肆伍陸柒捌玖'
  const units = ['', '拾', '佰', '仟']
  const bigUnits = ['', '萬', '億', '兆']
  let integer = Math.floor(num)
  const cents = Math.round((num - integer) * 100)
  const jiao = Math.floor(cents / 10)
  const fen = cents % 10

  let result = ''
  let unitIdx = 0
  if (integer === 0) result = ''
  while (integer > 0) {
    const section = integer % 10000
    if (section > 0) {
      let secStr = ''
      let s = section
      let u = 0
      let zeroPending = false
      while (s > 0) {
        const d = s % 10
        if (d === 0) {
          zeroPending = secStr.length > 0
        } else {
          secStr = digits[d] + units[u] + (zeroPending ? '零' : '') + secStr
          zeroPending = false
        }
        s = Math.floor(s / 10)
        u++
      }
      result = secStr + bigUnits[unitIdx] + (result && !result.startsWith('零') && section < 1000 ? '零' : '') + result
    } else if (result) {
      result = result.startsWith('零') ? result : '零' + result
    }
    integer = Math.floor(integer / 10000)
    unitIdx++
  }
  result = result.replace(/零+/g, '零').replace(/零$/, '')
  if (result) result += '元'
  if (jiao === 0 && fen === 0) return result + '整'
  if (jiao > 0) result += digits[jiao] + '角'
  else if (result && fen > 0) result += '零'
  if (fen > 0) result += digits[fen] + '分'
  return result
}
