# Rabatt module (DiscountCampaigns)

## Modulens syfte

Modulen räknar ut vad kunden ska betala när kampanjer gäller.
Det tar emot varukorgen, en eventuell rabattkod och totalsumman, och returnerar slutpris,total besparing och vilka kampanjer som användes. Totalsumman inclusive moms finns redan i varukorgen.

Alla rabatter räknas från varukorgens totalsumma utan moms, eftersom vi använder en databas med dollar som ursprunglig valuta.
Det beräknas på samma sätt som det görs i USA och skulle vara olagligt i Sverige, men jag tycker att det inte är det viktigaste i ett lärandesyfte.

## Klassernas roller

CampaignModule är basklassen med det alla kampanjer delar. ProductCampaign ärver därifrån och lägger till vilka produkter kampanjer gäller för(det fanns två produktkampanjer i en av versionerna).

Det finns tre klasser:

1. BuyXPayForYDiscount, med regeln "Köp X, betala för Y - de billigaste varorna blir gratis.
2. PercentageDiscount, med regeln "Procent på hela korgen, kräver kod".
3. ThresholdDiscount, med regeln "Handla över ett belopp, få avdrag".

campaignFactory() skapar rätt klass utifrån type, så resten av koden aldrig behöver veta vilken typ det är.

# Så räknas kampanjerna

Först produktrabatterna: procenten sänker styckpriset på varje vara, sedan räknas köp X betala för Y på de sänkta priserna.
Tröskelrabatten prövas sist på summan som blev kvar.

Procent kombineras med köp X betala för Y, och köp X betala för Y med tröskel - men aldrig procent med tröskel.

## Felhantering

Alla egna fel ärver ModuleError och används inom modulen.

## Motivering av designval

Arv används för att slippa upprepa datum- och kodlogik i tre klasser. Kampanjer häntas bara när korgen kan använda dem:
köp X betala för Y hoppas över om korgen har färre än MIN_BUY_X varor, procentkampanjer bara när en kod angetts.
Alla belopp avrundas till två decimaler i varje steg, eftersom flyttal annars ger små fel som syns i kassan.
