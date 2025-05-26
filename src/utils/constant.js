
export const paymentData = {
  accomodation: 'lodging',
  vehicle: 'rent',
  activity: 'activity',
  service: 'service',
  transportation: 'transportation',
  paymentMethod: {
    EXT: 'EXT',
    TROPIPAY: 'Tropipay',
  },
  currency: [
    { code: "USD", label: "Dólar estadounidense" },
    { code: "CUP", label: "Peso cubano" },
    { code: "EUR", label: "Euro" }
  ],
  productTypeFilter: [
    { id: 'AL', value: 'lodging', label: 'Accommodation' },
    { id: 'RE', value: 'rent', label: 'Vehicle' },
    { id: 'AC', value: 'activity', label: 'Activity' },
    { id: 'SE', value: 'service', label: 'Service' },
    { id: 'TR', value: 'transportation', label: 'Transportation' },
    { id: 'EX', value: 'EXT', label: 'EXT' }
  ]
}

/*export const paymentDataLabel = {
  accomodation: 'Accommodation',
  vehicle: 'Vehicle',
  activity: 'Activity',
  service: 'Service',
  transportation: 'Transportation',
  EXT: 'EXT',
}

export const paymentDataIcon = {
  accomodation: 'hotel',
  vehicle: 'car',
  activity: 'activity',
  service: 'service',
  transportation: 'transportation',
  EXT: 'EXT',
}

export const paymentDataColor = {
  accomodation: '#FFB800',
  vehicle: '#FFB800',
  activity: '#FFB800',
  service: '#FFB800',
  transportation: '#FFB800',
  EXT: '#FFB800',
}

export const paymentDataColorHover = {
  accomodation: '#FFB800',
  vehicle: '#FFB800',
  activity: '#FFB800',
  service: '#FFB800',
  transportation: '#FFB800',
  EXT: '#FFB800',
} */
