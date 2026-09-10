import HistoryCard from "./historyCard";

const InventoryHistory = ({ history }) => {
  const orders = history.filter((change) => change.type === "ORDER");

  const sales = history.filter((change) => change.type === "SALE");

  const adjustmentIncreases = history.filter(
    (change) => change.type === "ADJUSTMENTINCREASE",
  );

  const adjustmentDecreases = history.filter(
    (change) => change.type === "ADJUSTMENTDECREASE",
  );

  return (
    <div className="grid grid-cols-4 gap-4">
      <div>
        <p>Orders</p>
        <div className="flex flex-col h-60 gap-2 border-2 rounded-lg overflow-y-scroll">
          {orders.map((order) => {
            return <HistoryCard key={order.id} changes={order} />;
          })}
        </div>
      </div>

      <div>
        <p>Sales</p>
        <div className="flex flex-col h-60 gap-2 p-1 border rounded-lg overflow-y-scroll">
          {sales.map((order) => {
            return <HistoryCard key={order.id} changes={order} />;
          })}
        </div>
      </div>

      <div>
        <p>Adjustments +</p>
        <div className="flex flex-col h-60 gap-2 p-1 border rounded-lg overflow-y-scroll">
          {adjustmentIncreases.map((order) => {
            return <HistoryCard key={order.id} changes={order} />;
          })}
        </div>
      </div>

      <div>
        <p>Adjustments -</p>
        <div className="flex flex-col h-60 gap-2 p-1 border rounded-lg overflow-y-scroll">
          {adjustmentDecreases.map((order) => {
            return <HistoryCard key={order.id} changes={order} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default InventoryHistory;
