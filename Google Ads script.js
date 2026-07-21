var ADHEALTH_CONSULTANT_NAME = "Jurre";
var ADHEALTH_SPREADSHEET_URL =
  "https://docs.google.com/spreadsheets/d/1siQcbqKS9sh1IdBcWs1lz32Xkj5UueOyHeEwX3dTLWc/edit?gid=1718322055#gid=1718322055";
var ADHEALTH_SCRIPT_URL =
  "https://raw.githubusercontent.com/Netprofiler/AdHealth/refs/heads/main/AdHealth%20script%20V3.js";

function adHealthListProducts(merchantId, args) {
  var id = String(merchantId).trim();
  args = args || {};

  if (typeof MerchantApiProducts !== "undefined") {
    var response = MerchantApiProducts.Accounts.Products.list(
      "accounts/" + id,
      args,
    );
    return {
      api: "merchant",
      products: response.products || [],
      nextPageToken: response.nextPageToken,
    };
  }

  if (typeof ShoppingContent !== "undefined") {
    var legacyArgs = {
      pageToken: args.pageToken,
      maxResults: Math.min(args.maxResults || args.pageSize || 250, 250),
    };
    var legacy = ShoppingContent.Products.list(id, legacyArgs);
    return {
      api: "shopping_content",
      products: legacy.resources || [],
      nextPageToken: legacy.nextPageToken,
    };
  }

  throw new Error(
    "Enable Merchant API Products or Shopping Content in Advanced APIs.",
  );
}

function adHealthListProductStatuses(merchantId, args) {
  if (typeof ShoppingContent === "undefined") {
    throw new Error("Enable Shopping Content in Advanced APIs.");
  }
  return ShoppingContent.Productstatuses.list(
    String(merchantId).trim(),
    args || {},
  );
}

function main() {
  // Ads Scripts only request OAuth scopes for code in this file, not eval'd
  // code from GitHub. These lines ensure spreadsheet and email access.
  SpreadsheetApp.openByUrl(ADHEALTH_SPREADSHEET_URL);
  MailApp.getRemainingDailyQuota();

  var response = UrlFetchApp.fetch(ADHEALTH_SCRIPT_URL, {
    muteHttpExceptions: true,
  });

  if (response.getResponseCode() !== 200) {
    throw new Error("Error fetching script: " + response.getContentText());
  }

  eval(response.getContentText());
  new adHealthCheck(ADHEALTH_SPREADSHEET_URL, ADHEALTH_CONSULTANT_NAME);
}
