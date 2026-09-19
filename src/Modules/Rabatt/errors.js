// Nadiia's custom error classes

//The base class for all custom errors in the Nadiia module.
export class ModuleError extends Error {
  constructor(message) {
    super(message);
    this.name = "ModuleError";
  }
}

//Thrown when input data to the module is invalid or does not meet the expected criteria.
export class ValidationError extends ModuleError {
  constructor(message, field = null) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

//Thrown when a campaign code is not recognized or does not exist in the system.
export class UnknownCampaignError extends ModuleError {
  constructor(discountCode) {
    super(
      `Kampanjkoden "${discountCode}" är okänd. Kontrollera stavningen och försök igen.`,
    );
    this.name = "UnknownCampaignError";
    this.discountCode = discountCode;
  }
}

//Thrown when a campaign is not active due to being outside its valid date range.
export class CampaignIsNotActiveError extends ModuleError {
  constructor(discountCode, currentDate = new Date(), startDate, endDate) {
    const from = startDate
      ? new Date(startDate).toISOString().slice(0, 10)
      : "okänt datum";
    const to = endDate
      ? new Date(endDate).toISOString().slice(0, 10)
      : "okänt datum";

    super(
      `Kampanjen "${discountCode}" är inte aktiv. Den gäller från ${from} till ${to}. Kontrollera kampanjens start- och slutdatum.`,
    );
    this.name = "CampaignIsNotActiveError";
    this.discountCode = discountCode;
    this.currentDate = currentDate;
    this.campaignStartDate = startDate;
    this.campaignEndDate = endDate;
  }
}

//Thrown when an API request fails or returns an error response.
export class ApiError extends ModuleError {
  constructor(message, statusCode = null) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}
