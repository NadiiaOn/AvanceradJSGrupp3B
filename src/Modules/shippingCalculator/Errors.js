// code = custom error code för det specifika felet
// details = extra information om felet, t.ex. vilka fält som var ogiltiga, eller vilken transportör som inte kunde nås.
export class ShippingModuleError extends Error {
  constructor(message, { code = 'SHIPPING_MODULE_ERROR', details = {} } = {}) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
  }
}

// Kastas när paketets vikt/mått är ogiltiga t.ex (saknas, negativa, ej numeriska).
export class InvalidParcelError extends ShippingModuleError {
  constructor(message, details) {
    super(message, { code: 'INVALID_PARCEL', details });
  }
}

// Kastas EN GÅNG, när destinationen är ofullständig/trasig
// (t.ex. land eller postnummer saknas helt). Stoppar hela processen.
export class InvalidDestinationError extends ShippingModuleError {
  constructor(message, details) {
    super(message, { code: 'INVALID_DESTINATION', details });
  }
}

// Kastas när /api/carriers inte kan nås.
export class CarrierFetchError extends ShippingModuleError {
  constructor(message, details) {
    super(message, { code: 'CARRIER_FETCH_FAILED', details });
  }
}

// Kastas när ALLA transportörer har hoppats över (t.ex. ingen täcker destinationen)
export class NoCarriersAvailableError extends ShippingModuleError {
  constructor(message, details) {
    super(message, { code: 'NO_CARRIERS_AVAILABLE', details });
  }
}

// Kastas PER TRANSPORTÖR, inne i en enskild prisstrategi t.ex. ZoneBasedPricing,
// när destinationen i sig är giltig men just DEN transportören inte kör dit.
// Fångas i en loop och gör att bara den transportören hoppas över alltså inte hela anropet.
export class UnsupportedDestinationError extends ShippingModuleError {
  constructor(message, details) {
    super(message, { code: 'UNSUPPORTED_DESTINATION', details });
  }
}