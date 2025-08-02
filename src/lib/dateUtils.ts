// Format date to user's local timezone
export const formatToLocalTime = (dateString: string): string => {
  const date = new Date(dateString)
  
  // Format to user's local timezone
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  })
}

// Format date for grouping (just the date part)
export const formatDateForGrouping = (dateString: string): string => {
  const date = new Date(dateString)
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
