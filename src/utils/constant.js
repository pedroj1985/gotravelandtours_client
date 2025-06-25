
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

export const orderStatusList = {
  open: 'Open',
  confirmed: 'Confirmed',
  accepted: 'Accepted',
  rejected: 'Rejected',
  autorized: 'Autorized',
  close: 'Close',
  closed: 'Closed',
  pending: 'Pending',
  cancel: 'Cancel',
  cm: 'CM',
}
