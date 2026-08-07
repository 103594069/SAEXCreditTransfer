export const PARTNER_INSTITUTIONS = [
  { id: 'pi-toronto', name: 'University of Toronto', country: 'Canada' },
  { id: 'pi-nus', name: 'National University of Singapore', country: 'Singapore' },
  { id: 'pi-manchester', name: 'University of Manchester', country: 'United Kingdom' },
  { id: 'pi-cbs', name: 'Copenhagen Business School', country: 'Denmark' },
  { id: 'pi-uam', name: 'Universidad Autónoma de Madrid', country: 'Spain' },
  { id: 'pi-ucb', name: 'University of California, Berkeley', country: 'United States' },
]

export function institutionById(id) {
  return PARTNER_INSTITUTIONS.find((i) => i.id === id)
}
