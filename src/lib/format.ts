export const numberFormat = (num: number | string | undefined | null) => {
  if (!num) return '0'
  const formatter = new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  })
  return formatter.format(Number(num))
}

export const formatAddress = (str: string, leftLen = 12, rightLen = 12) => {
  if (str.length > leftLen) {
    return str.slice(0, Math.floor(leftLen / 2)) + '...' + str.slice(-Math.floor(rightLen / 2))
  }
  return str
}
