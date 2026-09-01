# Modul Kontrakt Grupp 3B

- Medlemmar: Nadiia, Victor, Herman & Joel.

## Moduler som finnas i projektet:

1. Kampanjmotor
   Domänkrav: Hantera minst tre kampanjtyper (procentrabatt, tröskelrabatt “handla för X få Y kr rabatt”, “köp X betala för Y”) som kan kombineras på en varukorg enligt regler modulen definierar (ordning/stapling). Kampanjkoder valideras asynkront mot /api/campaigns. Resultat: prisspecifikation (ordinarie pris, rabatter per kampanj, slutpris).
   Exempelklasser: Cart (rader, totals) · Discount med varianter per kampanjtyp · PriceCalculator (kombinerar kampanjer, producerar specifikation).

2. Fraktberäknare
   Domänkrav: Beräkna fraktoffert för en varukorg utifrån vikt, volym och destination för minst tre transportörer med olika prismodeller (t.ex. viktbaserad, zonbaserad, volymvikt = max av faktisk och volymetrisk vikt). Transportörsdata hämtas asynkront från /api/carriers. Resultat: sorterad offertlista.
   Exempelklasser: Parcel (vikt/mått/volymvikt) · Carrier med olika prismodeller · ShippingQuoteService (frågar transportörer, sorterar offerter).

3. Lagermodul
   Domänkrav: Hantera lagersaldo som härleds ur lagerhändelser (inleverans, försäljning, justering) och varna när saldo når beställningspunkt enligt regler (t.ex. beställningspunkt beroende av försäljningstakt). Läser och skriver mot /api/inventory — modulen är projektets tyngsta API-konsument. Resultat: saldorapport med varningar.
   Exempelklasser: StockItem (artikel, beställningspunkt) · StockMovement (händelse med typ/antal/tid) · InventoryService (API-kommunikation, saldoberäkning, rapport).

4. Valuta & moms
   Domänkrav: Konvertera priser mellan minst tre valutor med kurser som hämtas asynkront från /api/rates och cachas i modulen, samt beräkna svensk moms per varukategori (25 % standard, 12 % livsmedel, 6 % böcker). Belopp i olika valutor får inte kunna blandas av misstag. Resultat: formaterat pris inkl. moms i vald valuta.
   Exempelklasser: ExchangeRateClient (async + cache) · TaxTable (momsregler) · Money (värdeobjekt: belopp + valuta, convert(), addTax(), skyddar mot valutablandning).

## Lärarens Checklista:

### 1. Modulform (given): Varje modul default-exporterar en klass (fingerat exempel):

    import Product from "./Product";

    export default class PriceFormatterModule {

    static descriptor = {
      name: "PriceFormatter",
      methodsAndInputs: [
        {
          method: 'productsFromDb',
          input: ['productsFromDB - an array of products from the db'],
          output: 'an array of Product instances with getters for price formatting'
        }
      ]
    };

    makeInstances(productsFromDB) {
      return productsFromDB.map(x => new Product(x));
    }

}

### 2. Descriptor-schema (gruppens beslut, inom tak): Tillåtna fälttyper: number, text, select, boolean — inga nästlade strukturer. Attribut per fält: key, label, type, required, samt min/max (number) och options (select). Output-hintar: se punkt 3.

### 3. Resultatformer (givna): run returnerar ett objekt med kind och tillhörande data. Descriptorns output-attribut anger vilken form modulen returnerar, och resultatets kind ska matcha den:

    { kind: "value", label, value, unit? }
    { kind: "table", columns: [...], rows: [[...]] }
    { kind: "list", items: [...] }

### 4. Felkonvention (given): Moduler signalerar fel genom att kasta Error (eller gemensam ModuleError) med begripligt meddelande på svenska; React-skalet fångar och visar felet. Moduler får aldrig returnera undefined eller svälja fel tyst.

### 5. Valideringsansvar (gruppens formulering): Formulärgeneratorn validerar mot descriptorn (required, min/max, typ) innan run anropas. Modulen ska ändå tåla ogiltig indata utan att krascha.

### 6. Struktur (given): src/modules/<namn>/index.js är modulens enda publika ingång; interna klasser fritt därunder. Inga React-importer i moduler.

### 7. API-ägarskap (gruppens beslut): Vilka endpoints i db.json varje modul äger respektive läser, så att datamodellen inte krockar.

## Vår Checklista:

### 1. Utgår från deras exempel.

### 2. Descriptor-schema

    static descriptor = {
      name: "Namnet på modulen i PascalCase dvs CurrencyTax"
      methodsAndInputs: [
        {
          method: 'productsFromDb',
         input: ['productsFromDB - an array of products from the db'],
         output: 'an array of Product instances with getters for their specific use'
        }
      ]
    }

Fortsättning följer efter frågestund med läraren...

### 3.

### 4.

### 5.

### 6.

### 7.
