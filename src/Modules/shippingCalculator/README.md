# SHIPPINGCALCULATOR

## Syfte

Modulen räknar ut och sorterar fraktofferter för produkterna i en varukorg. Man skickar in vikt, mått och en destination och modulen frågar tre transportörer (hämtas asynkront från /api/carriers/) vad det skulle kosta att skicka ett paket dit. Resultatet är en lista sorterad med den billigaste först (förvald i checkout). Transportörerna har tre olika prismodeller, vikt, volym och zon.

## Alla klasser och hur det hänger ihop

```
ShippingQuoteModule (index.js)
  └── has a  → ShippingQuoteService
        └── has many → Carrier
              └── has a → pricingStrategy (en av tre nedan)
                    - WeightBasedPricing
                    - VolumetricPricing
                    - ZoneBasedPricing

Parcel      <- skickas som data mellan klasserna, ägs inte av någon
Errors.js   <- ShippingModuleError + fem underklasser (arv)r
```

- **`Parcel`** : håller koll på paketets vikt och mått, och räknar ut
  volym, volymvikt och debiterbar vikt (`max(faktisk vikt, volymvikt)`).
  Den vet ingenting om pris eller transportörer utan den bara skickas
  som argument mellan `ShippingQuoteService`, `Carrier` och
  prisstrategierna, ingen klass äger den permanent.

- **`Carrier`** : är en transportör med id, namn, leveranstid och har
  en prisstrategi injicerad som den använder för att räkna ut ett
  pris. `Carrier.fromApiData(raw)` är en statisk metod som
  bygger rätt strategi utifrån vad `pricingType` är i API-svaret.

- Prisstrategierna (`WeightBasedPricing`, `VolumetricPricing`,
  `ZoneBasedPricing`) har alla samma metod: `calculate(parcel,destination)`. De vet ingenting om `Carrier`.

- **`ShippingQuoteService`** : sköter själva flödet: hämtar
  transportörer (med cache), frågar varje transportör om en offert,
  hoppar över de som inte täcker destinationen istället för att
  krascha, sorterar resultatet och loggar förfrågan.

- **`ShippingQuoteModule`** : (`index.js`) är modulens enda ingång
  utåt. Den validerar indata, bygger `Parcel` och destination,
  skickar vidare till `ShippingQuoteService` och paketerar svaret.

- **`Errors.js`** : en basklass, `ShippingModuleError`, och fem
  underklasser för olika typer av fel, så att man kan visa
  tydligare felmeddelanden istället för att bara krascha.

## Varför komposition istället för arv för prismodellerna

De tre prismodellerna är egentligen ganska olika (vikt, volym, zon),
och flera transportörer skulle kunna dela exakt samma prislogik. Jag
funderade först på att låta `Carrier` ärva från något i stil med
`WeightBasedCarrier`, men insåg att det skulle låsa fast varje
transportör vid en enda prismodell för alltid, och om jag senare
ville lägga till något som express-frakt hade jag fått en helt egen
underklass för varje kombination.

Istället får `Carrier` sin prisstrategi injicerad – den bryr sig bara
om att objektet har en `calculate`-metod, inte vilken klass det
faktiskt är (duck typing). Det gör att:

- Jag kan lägga till en ny prismodell som en helt ny klass, utan att
  röra `Carrier` alls. `fromApiData` är den enda platsen som
  faktiskt behöver veta vilka klasser som finns.
- Prisstrategierna går att testa helt separat från `Carrier`.

- `Errors.js` är byggd med arv istället, för att felklasserna faktiskt
  **är** specialiseringar av samma sak `InvalidParcelError` är
  verkligen ett fel i modulen, inte bara "kopplad till" ett. Det gör
  att man kan fånga fel brett (`instanceof ShippingModuleError`) eller
  specifikt, beroende på vad man behöver.

`Parcel` är varken det ena eller det andra den byggs en gång i
`index.js` och skickas bara som ett vanligt argument genom
`getQuotes → calculateQuote → calculate`. Ingen klass sparar den som
ett eget fält.

## Varför modulen är en instans

`ShippingQuoteService` bär två saker mellan anrop:

- **`carrierCache`** : transportörsdatan cachas i 60 sekunder, så
  att man slipper göra ett nytt anrop varje gång någon vill
  ha en offert.
- **`quoteHistory`** : en logg över tidigare offertförfrågningar,
  går att läsa via `module.quoteHistory`.
- Om modulen bara bestod av statiska funktioner skulle det inte finnas
  något ställe att spara den här datan mellan anrop. Varje anrop
  skulle börja om helt från noll. Instansen skapas en gång, centralt,
  i `Modules/moduleMaker.js`, så att cache och historik delas oavsett
  vilken sida i appen som anropar `run()`.

## Modulkontrakt

```js
export default class ShippingQuoteModule {
  static descriptor = { ... };
  constructor() {}                        // no-arg
  async run(values, context) { ... }      // gör ett riktigt async-anrop mot /api/carriers
}
```

`context.fetch` och `context.apiBaseUrl` går att skicka in (t.ex från tester), men med default på riktig `fetch` och
`/api/carriers`. Det gör att jag kan testa servicen utan att göra
riktiga nätverksanrop. I appen räcker det att skriva `run(values)`
utan `context`.

## API-ägarskap

Modulen äger och läser `/carriers` i `db.json`. Ingen annan modul i
projektet ska använda den.

## Felhantering

Alla fel modulen kastar ärver `ShippingModuleError`, har `.code` och
`.message` på svenska:

- `InvalidParcelError` : ogiltig vikt eller mått
- `InvalidDestinationError` : mottagarland saknas
- `CarrierFetchError` gick inte att nå `/api/Carriers/`
- `NoCarriersAvailableError` : ingen transportör täckte destinationen
- `UnsupportedDestinationError` : kastas per transportör internt, så
  att en enskild transportör som inte täcker destinationen inte
  stoppar hela förfrågan

## Tester

Testerna ligger i `tests/` och körs med Vitest:

```
npm test
```

20 tester som täcker: volym/viktsberäkning, alla tre
prismodellerna, sortering, cache tester, historik, samt
felhantering
