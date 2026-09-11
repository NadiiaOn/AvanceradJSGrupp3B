import HistoryCard from "./HistoryCard";

const InventoryHistory = ({ history }) => {
  const orders = history.filter((change) => change.type === "ORDER");

  const sales = history.filter((change) => change.type === "SALE");

  const adjustmentIncreases = history.filter(
    (change) => change.type === "ADJUSTMENTINCREASE",
  );

  const adjustmentDecreases = history.filter(
    (change) => change.type === "ADJUSTMENTDECREASE",
  );

  const colorCodes = ["#2B6CB5", "#479C4B", "#F1C20C", "#AC022E"];

  if (history === null || history === undefined || history.length == 0) {
    return <p>Ingen historik att hämta..</p>;
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Orders */}
      <div>
        <p
          className="text-center italic text-lg font-semibold mb-2 border-b-2"
          style={{ borderColor: colorCodes[0] }}
        >
          Orders
        </p>
        <div className="flex flex-col h-60 gap-2 border-2 rounded-lg overflow-y-scroll">
          {orders.map((order) => {
            return (
              <HistoryCard
                key={order.id}
                changes={order}
                colorCode={colorCodes[0]}
              />
            );
          })}
        </div>
      </div>

      {/* Sales */}
      <div>
        <p
          className="text-center italic text-lg font-semibold mb-2 border-b-2"
          style={{ borderColor: colorCodes[1] }}
        >
          Sales
        </p>
        <div className="flex flex-col h-60 gap-2 p-1 border rounded-lg overflow-y-scroll">
          {sales.map((order) => {
            return (
              <HistoryCard
                key={order.id}
                changes={order}
                colorCode={colorCodes[1]}
              />
            );
          })}
        </div>
      </div>

      {/* Adjustments Increase */}
      <div>
        <p
          className="text-center italic text-lg font-semibold mb-2 border-b-2"
          style={{ borderColor: colorCodes[2] }}
        >
          Adjustments +
        </p>
        <div className="flex flex-col h-60 gap-2 p-1 border rounded-lg overflow-y-scroll">
          {adjustmentIncreases.map((order) => {
            return (
              <HistoryCard
                key={order.id}
                changes={order}
                colorCode={colorCodes[2]}
              />
            );
          })}
        </div>
      </div>

      {/* Adjustments Decrease */}
      <div>
        <p
          className="text-center italic text-lg font-semibold mb-2 border-b-2"
          style={{ borderColor: colorCodes[3] }}
        >
          Adjustments -
        </p>
        <div className="flex flex-col h-60 gap-2 p-1 border rounded-lg overflow-y-scroll">
          {adjustmentDecreases.map((order) => {
            return (
              <HistoryCard
                key={order.id}
                changes={order}
                colorCode={colorCodes[3]}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InventoryHistory;
