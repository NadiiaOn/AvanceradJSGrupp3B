/**
 * Formulärgeneratorn validerar mot descriptorn (required, min/max, typ) innan run anropas. Modulen ska ändå tåla ogiltig indata utan att krascha.
 */
export const descriptor = {
  id: 'shipping-quote',
  title: 'Fraktoffert',
  description: 'Beräknar och sorterar fraktofferter för en varukorg från flera transportörer.',
  fields: [
    { name: 'weightKg', label: 'Vikt (kg)', type: 'number', required: true, min: 0.01, max: 1000 },
    { name: 'lengthCm', label: 'Längd (cm)', type: 'number', required: true, min: 1, max: 300 },
    { name: 'widthCm', label: 'Bredd (cm)', type: 'number', required: true, min: 1, max: 300 },
    { name: 'heightCm', label: 'Höjd (cm)', type: 'number', required: true, min: 1, max: 300 },
    {
      name: 'destinationCountry',
      label: 'Mottagarland',
      type: 'select',
      required: true,
      options: [
        { value: 'SE', label: 'Sverige' },
        { value: 'NO', label: 'Norge' },
        { value: 'DK', label: 'Danmark' },
        { value: 'FI', label: 'Finland' },
        { value: 'DE', label: 'Tyskland' },
        { value: 'FR', label: 'Frankrike' },
        { value: 'PL', label: 'Polen' },
        { value: 'GB', label: 'Storbritannien' },
        { value: 'US', label: 'USA' },
      ],
    },
    {
      name: 'carrierIds',
      label: 'Begränsa till specifika transportörer',
      type: 'multiselect',
      required: false,
      optionsSource: 'carriers',
    },
  ],
};