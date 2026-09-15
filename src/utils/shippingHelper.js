// För att summera vikt och volym, parcel.js förväntar sig bara EN vikt samt
// ETT värde för width, height och length.
export function buildParcelValues(cartItems) {
  const totalWeightKg = cartItems.reduce(
    (sum, item) => sum + item.weight * item.quantity,
    0
  );

  const totalVolumeCm3 = cartItems.reduce(
    (sum, item) =>
      sum +
      item.dimensions.width * item.dimensions.height * item.dimensions.depth * item.quantity,
    0
  );

  const cubeSide = Math.cbrt(totalVolumeCm3);

  return {
    weightKg: totalWeightKg,
    lengthCm: cubeSide,
    widthCm: cubeSide,
    heightCm: cubeSide,
  };
}
