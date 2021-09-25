import input from './input.json'

/**
 * Print days of a given month
 * @param month 1-12
 * @param days 1-(28-31)
 */
const printDaysOfMonth = (month: number) => {
  const first = new Date(2021, month - 1) // Date API months range 0-11
  const last = new Date(2021, month, 0) // Day 0 gives last day of previous month

  const current = first
  while (current <= last) {
    console.log(current.toLocaleDateString('fi-FI'))
    current.setDate(current.getDate() + 1)
  }
}

printDaysOfMonth(input.prop2)
