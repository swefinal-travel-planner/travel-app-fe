export const formatAttribute = (attr: string) => {
  if (!attr) return ''

  // Check if the spotType starts with an emoji
  // Emoji typically consists of 1-2 Unicode characters followed by a space
  const emojiRegex = /^(\p{Emoji})/u

  // Remove the emoji prefix if it exists
  let formatted = attr.replace(emojiRegex, '')

  // Replace ellipses (3 periods) with a single space
  formatted = attr.replace(/\.\.\./g, ' ')

  // Replace any other special characters with a space
  // This regex matches any character that is not a letter, number, or space
  formatted = formatted.replace(/[^\w\s]/g, ' ')

  // Remove extra spaces (multiple spaces to single space)
  formatted = formatted.replace(/\s+/g, ' ').trim()

  return formatted
}
