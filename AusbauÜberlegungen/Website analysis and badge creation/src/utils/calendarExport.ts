export interface CalendarEventParams {
  title: string
  description: string
  location: string
  startDate?: Date
  endDate?: Date
  durationHours?: number
}

export function formatGoogleCalendarDate(date: Date): string {
  return date.toISOString().replace(/-|:|.\d+/g, '')
}

export function createGoogleCalendarUrl(params: CalendarEventParams): string {
  const start = params.startDate || new Date(Date.now() + 24 * 60 * 60 * 1000)
  const duration = params.durationHours || 3
  const end = params.endDate || new Date(start.getTime() + duration * 60 * 60 * 1000)

  const startStr = formatGoogleCalendarDate(start)
  const endStr = formatGoogleCalendarDate(end)

  const details = `${params.description}\n\n📍 Coordinates & Route via Scratch'n'Travel\n🔗 https://scratchntravel.com`

  const url = new URL('https://calendar.google.com/calendar/render')
  url.searchParams.set('action', 'TEMPLATE')
  url.searchParams.set('text', `🧭 Scratch'n'Travel: ${params.title}`)
  url.searchParams.set('dates', `${startStr}/${endStr}`)
  url.searchParams.set('details', details)
  url.searchParams.set('location', params.location)

  return url.toString()
}

export function downloadIcsFile(params: CalendarEventParams) {
  const start = params.startDate || new Date(Date.now() + 24 * 60 * 60 * 1000)
  const duration = params.durationHours || 3
  const end = params.endDate || new Date(start.getTime() + duration * 60 * 60 * 1000)

  const pad = (n: number) => (n < 10 ? '0' + n : n)
  const toIcsDate = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`

  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Scratch n Travel//Trip Planner//DE',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:snt-${Date.now()}@scratchntravel.com`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:🧭 Scratch'n'Travel: ${params.title}`,
    `DESCRIPTION:${params.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${params.location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' })
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.setAttribute('download', `scratchntravel-${params.title.toLowerCase().replace(/\s+/g, '-')}.ics`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
