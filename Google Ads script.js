// --- Config ---
var ADHEALTH_CONSULTANT_NAME = "Jurre";
var ADHEALTH_SPREADSHEET_URL =
  "https://docs.google.com/spreadsheets/d/1siQcbqKS9sh1IdBcWs1lz32Xkj5UueOyHeEwX3dTLWc/edit?gid=1718322055#gid=1718322055";
var ADHEALTH_SCRIPT_URL =
  "https://raw.githubusercontent.com/Netprofiler/AdHealth/refs/heads/main/AdHealth%20script%20V3.js";
var ADHEALTH_SHOPPING_CONTENT_SUNSET = "2026-08-18";
var ADHEALTH_MERCHANT_API_GLOBALS = ["MerchantApiProducts", "Products"];

// --- Runtime state ---
var adHealthShoppingContentWarned_ = false;

function adHealthMerchantProductsService_() {
  for (var i = 0; i < ADHEALTH_MERCHANT_API_GLOBALS.length; i++) {
    try {
      var service = eval(ADHEALTH_MERCHANT_API_GLOBALS[i]);
      if (service && service.Accounts && service.Accounts.Products) {
        return service;
      }
    } catch (e) {}
  }
  return null;
}

function adHealthWarnShoppingContentFallback_() {
  if (adHealthShoppingContentWarned_) {
    return;
  }
  adHealthShoppingContentWarned_ = true;
  Logger.log(
    "WARNING: AdHealth is using the deprecated Shopping Content API (ShoppingContent). " +
      "Google shuts it down on " +
      ADHEALTH_SHOPPING_CONTENT_SUNSET +
      ". Migrate to Merchant API Products when available in Google Ads Scripts.",
  );
}

function adHealthListProducts(merchantId, args) {
  var id = String(merchantId).trim();
  var service = adHealthMerchantProductsService_();

  if (service) {
    var response = service.Accounts.Products.list("accounts/" + id, args || {});
    return {
      api: "merchant",
      products: response.products || [],
      nextPageToken: response.nextPageToken,
    };
  }

  if (typeof ShoppingContent !== "undefined") {
    adHealthWarnShoppingContentFallback_();
    var legacyArgs = args || {};
    if (legacyArgs.pageSize && !legacyArgs.maxResults) {
      legacyArgs.maxResults = legacyArgs.pageSize;
    }
    var legacy = ShoppingContent.Products.list(id, legacyArgs);
    return {
      api: "shopping_content",
      products: legacy.resources || [],
      nextPageToken: legacy.nextPageToken,
    };
  }

  throw new Error(
    "No Merchant Center products API available. Enable Merchant API Products or Shopping Content in Advanced APIs.",
  );
}

function adHealthListProductStatuses(merchantId, args) {
  if (typeof ShoppingContent === "undefined") {
    throw new Error("ShoppingContent is not available.");
  }
  adHealthWarnShoppingContentFallback_();
  return ShoppingContent.Productstatuses.list(
    String(merchantId).trim(),
    args || {},
  );
}

function main() {
  var response = UrlFetchApp.fetch(ADHEALTH_SCRIPT_URL, {
    muteHttpExceptions: true,
  });

  Logger.log("HTTP Response Code: " + response.getResponseCode());

  if (response.getResponseCode() === 200) {
    eval(response.getContentText());
    Logger.log("Completed");
    new adHealthCheck(ADHEALTH_SPREADSHEET_URL, ADHEALTH_CONSULTANT_NAME);
  } else {
    Logger.log("Error fetching script: " + response.getContentText());
  }
}
