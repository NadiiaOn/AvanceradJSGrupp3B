# InventoryModule

## Syfte

InventoryModule ansvarar för lagerhantering i Fakestore. Modulen hanterar olika typer av lagerförändringar, som beställningar (ORDER), försäljningar (SALE) och lagerjusteringar (ADJUSTMENTINCREASE och ADJUSTMENTDECREASE).

Modulen kan hämta en lageröversikt för produkterna och registrera nya lagerförändringar. Lagerförändringarna sparas via API och produktens aktuella lagersaldo uppdateras. Modulen använder även försäljningshistoriken för att beräkna försäljningstakt och bestämma om en produkt behöver beställas på nytt.

## Klassernas roller

### InventoryModule

- **`InventoryModule.js`**: är modulens publika ingång och ansvarar för modulkontraktet genom descriptor och metoden run(). Den validerar även inkommande värden innan en operation genomförs. Modulen sparar en egen historik över vilka av modulens metoder som har körts.
  InventoryModule använder InventoryService för att utföra själva lagerhanteringen.

- **`InventoryService.js`**: InventoryService innehåller den huvudsakliga logiken för lagerhanteringen och ansvarar även för kommunikationen med API-anrop. Den hämtar produkter och lagerhistorik, skapar InventoryItem-objekt och kopplar lagerförändringar till rätt produkt. När en ny lagerförändring registreras uppdaterar servicen både lagerhistoriken och produktens aktuella lagersaldo.

- **`InventoryItem.js`**: representerar lagerinformationen för en produkt. Klassen innehåller produktens lagersaldo och en lista över produktens lagerförändringar. Den ansvarar bland annat för att beräkna total försäljning, försäljningstakt, beställningspunkt och om produkten behöver beställas på nytt.

- **`InventoryChange.js`**: representerar en enskild lagerförändring. Den innehåller information om vilken produkt som ändrats, vilken typ av förändring det är, kvantiteten samt tidpunkt för förändringen. Den kan även innehålla information om en försäljning genom `saleInfo`.

### Error-klasser

- **`InventoryValidationError`**: används vid felaktiga indata eller ogiltiga lagerförändringar.
- **`InventoryNotFoundError`**: används när en produkt inte kan hittas.
- **`InventoryOperationError`**: används när en lageroperation misslyckas vid kommunikation med API.

## Relation mellan klasserna

    InventoryModule
          |
    InventoryService
          |
          |----> InventoryItem
          |           |
          |           |----> InventoryChange
          |
          |----> API

`InventoryModule` använder sig av InventoryService, som i sin tur skapar och arbetar med `InventoryItem` och `InventoryChange`.

## Komposition vs arv

Jag valde komposition istället för arv eftersom klasserna representerar olika delar av lagerhanteringen och inte är specialiseringar av varandra.

`InventoryService` är till exempel inte en typ av `InventoryItem`, utan arbetar med `InventoryItem`. På samma sätt representerar `InventoryChange` en lagerhändelse som `InventoryItem` kan innehålla.

Genom komposition får varje klass ett tydligt ansvar och klasserna kan samarbeta utan att behöva ärva från varandra. Det gör även att de olika delarna kan testas separat.

Jag blev även påmind om vår tidigare kurs i Spring, där vi byggde API:er. Jag insåg att jag kunde använda en liknande ansvarsfördelning här, där InventoryModule fungerar som ingång och InventoryService hanterar den huvudsakliga logiken.

## Varför InventoryModule är en instans

`InventoryModule` behöver vara en instans eftersom den sparar informationen mellan anrop genom sin `history`.

När en metod körs sparas metodens namn och tidpunkt i historiken:

```js
this.history.push({
  method: "getInventoryReport",
  timestamp: new Date(),
});
```

Historiken finns därför kvar på samma InventoryModule-instans mellan olika anrop. Klassen har även en instans av InventoryService som den använder för att utföra lageroperationerna.

## Modulkontrakt

```js
export default class InventoryModule {
  static descriptor = { ... };

  constructor() {
    this.inventoryService = new InventoryService();
    this.history = [];
  }

  async run(values) { ... }
}
```

## Alla relevanta filer

    src
     |--> Modules
     |     |--> Inventory
     |     |     |--> index.js
     |     |     |--> InventoryModule.js
     |     |     |--> InventoryService.js
     |     |     |--> InventoryItem.js
     |     |     |--> InventoryChange.js
     |     |     |
     |     |     |--> errors
     |     |     |      |--> InventoryNotFoundError.js
     |     |     |      |--> InventoryOperationError.js
     |     |     |      |--> InventoryValidationError.js
     |     |     |
     |     |     |--> tests
     |     |           |--> InventoryChange.test.js
     |     |           |--> InventoryItem.test.js
     |     |           |--> InventoryModule.test.js
     |     |           |--> InventoryService.test.js
     |     |
     |--> api
     |     |--> fetchProducts.js
     |     |--> inventory.js
     |     |--> products.js
     |     |
     |--> context
     |     |----> InventoryContext.jsx
     |     |
     |--> pages
     |     |----> InventoryPage.jsx
     |     |----> Checkout.jsx
     |     |----> Navbar.jsx

## Tester:

    Testerna ligger i "src\Modules\Inventory\tests" och körs via Vitest i terminalen:
    Relevanta filer för InventoryModule:
    src/Modules/Inventory/tests/InventoryChange.test.js
    src/Modules/Inventory/tests/InventoryItem.test.js
    src/Modules/Inventory/tests/InventoryService.test.js
    src/Modules/Inventory/tests/InventoryModule.test.js
    ```
    npm test
    ```
    Eller, för att testa individuella filer:
    ```
    npm test <relevant path tex: src/Modules/Inventory/tests/InventoryModule.test.js>
    ```
