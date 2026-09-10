// Nadiia's custom error classes

//ToDo: create alla messages in swedish.

//The base class for all custom errors in the Nadiia module.
export class ModuleError extends Error {
  constructor(message) {
    super(message);
    this.name = "ModuleError";
  }
}

//Thrown when indate to the module is invalid or does not meet the expected criteria.
export class ValidationError extends ModuleError {
  constructor(message, field = null) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

//Thrown when a campaign code is not recognized or does not exist in the system.
export class UnknownCampaignError extends ModuleError {
  constructor(code) {
    super(
      `Kampanjkeden "${code}" är okänd. Kontrollera stavningen och försök igen.`,
    );
    this.name = "UnknownCampaignError";
    this.code = code;
  }
}

//Thrown when a campaign is not active due to being outside its valid date range.
export class CampaignNotActiveError extends ModuleError {
  constructor(code, currentDate, startDate, endDate) {
    super(
      `Kampanjen "${code}" är inte aktiv. Den var giltig från ${startDate} till ${endDate}. Kontrollera kampanjens start- och slutdatum.`,
    );
    this.name = "CampaignNotActiveError";
    this.code = code;
    this.currentDate = currentDate;
    this.campaignStartDate = startDate;
    this.campaignEndDate = endDate;
  }
}

//Thrown when an API request fails or returns an error response.
export class ApiError extends ModuleError {
  constructor(message, statusCode) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}
