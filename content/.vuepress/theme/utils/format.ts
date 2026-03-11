const dateFormatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

export const formatDate = (date: Date | string): string =>
  dateFormatter.format(typeof date === 'string' ? new Date(date) : date)

export const slugify = (text: string): string =>
  text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
