# Viktor Gustafsson - Valuta / Moms

## Syfte

Modulen konverterar priser mellan tre valutor, USD(som vi satt som grundvaluta), SEK och EUR och beräknar svensk moms beroende på 3 olika varukategorier vilken är 6% på böcker, 12% livsmedel och 25% på resterande. Modulen är byggd för att inte kunna blanda ihop belopp i olika valutor av misstag.

## Klasser

Modulen består av fyra samverkande klasser. `index.js` är själva huvudklassen och är den som fördelar allt. Det är även den enda som pratar med de tre andra klasserna.

### ExchangeRateService

Hämtar och cachar växelkurser asynkront från `/api/currency`. Cachen är en instansvariabel som håller kursen i 3 minuter innan en ny hämtning görs. Huvudklassen anropar `getRate()` varje gång ett pris ska konverteras till en annan valuta.

### Money

Money skapar ett objekt av priset och valutan, där den automatiskt validerar om priset och valutan stämmer, skapar därefter en ny instans efter varje konvertering istället för att skriva över det. Genomgående i modulen skapas nya instanser istället för att befintliga objekt ändras. Både Money.convertTo() och Vat:s metoder (addTax(), getTaxAmount()) tar emot ett Money-objekt och returnerar ett helt nytt, istället för att ändra det inskickade objektet. Det gör att ett Money-objekt aldrig oväntat ändras någon annanstans i koden, vilket minskar risken för buggar där ett pris plötsligt är fel valuta eller fel belopp utan att man vet varför.

### Vat

Räknar ut momsen beroende på vilken kategori produkten tillhör. Tar emot ett Money-objekt och en kategori från Huvudklassen och returnerar ett nytt Money-objekt med eller utan moms pålagd (beroende på metod).

### CurrencyVatModule (Index)

Huvudklassen innehåller en descriptor med 5st olika metoder där det är beskrivet vad varje metod behöver för input och output.
`run()` - Metoden för att få ett konverterat pris inklusive moms som är formaterat.
`getRawPrice()` - Metoden för att få ett rått konverterat pris.
`getFormattedTax()` - Metoden för att få moms konverterat efter en viss valuta som är formaterat.
`getTaxRawAmount()` - Metoden för att få ut moms konverterat men ej formaterat.
`formatAmount()` - Metoden för att formatera om ett rått värde till att bli en läsbar sträng.

### Designval

Jag har valt komposition istället för arv för att klasserna jag har skapat inte har en "är en" relation till varandra. Huvudklassen är inte en typ av Money, Vat eller ExchangeRateService, den behöver bara komma åt deras funktionalitet. Därför skapar jag instanser av dessa i konstruktorn, så jag kan komma åt och använda dom i Huvudklassen.

Jag valde att hårdkoda både valutorna och momssatserna. Momssatserna är lagstadgade som inte förändras, därför finns det ingen anledning att hämta dom dynamiskt varje gång. Valutorna har vi bestämt i gruppen och de har inte heller någon data som förändras, till skillnad från växelkurserna som behöver hämtas då de varierar.

Jag har byggt fem olika metoder i `index.js`, eftersom kundvagnen behöver kunna visa priser på olika sätt, exklusive moms, inklusive moms och bara momsbelopp för sig. Flera av metoderna finns i två varianter, en som returnerar formaterad text och en som returnerar ett rått tal. Anledningen är att jag upptäckte att formaterad text inte går att summera ihop eftersom plustecknet bara slår ihop texten istället för att addera talen, därför behövde jag de råa talen så jag kunde slå ihop dessa och sedan kalla på en format metod som gjorde om det till en sträng.
