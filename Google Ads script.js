function adHealthShoppingProductsList(merchantId, args) {
  return ShoppingContent.Products.list(String(merchantId), args || {});
}

function adHealthShoppingProductstatusesList(merchantId, args) {
  return ShoppingContent.Productstatuses.list(String(merchantId), args || {});
}

function main() {
  var yourName = "Jurre";
  var spreadsheetUrl =
    "https://docs.google.com/spreadsheets/d/1siQcbqKS9sh1IdBcWs1lz32Xkj5UueOyHeEwX3dTLWc/edit?gid=1718322055#gid=1718322055"; // Replace with your spreadsheet URL
  var spreadsheet = SpreadsheetApp.openByUrl(spreadsheetUrl);
  var shortUrl = spreadsheetUrl;

  var scriptfile_name =
    "https://raw.githubusercontent.com/Netprofiler/AdHealth/refs/heads/main/AdHealth%20script%20V3";
  var response = UrlFetchApp.fetch(scriptfile_name, {
    muteHttpExceptions: true,
  });

  Logger.log("HTTP Response Code: " + response.getResponseCode());

  if (response.getResponseCode() === 200) {
    var scriptFile_raw = response.getContentText();
    eval(scriptFile_raw);
    Logger.log("Completed");
    var script = new adHealthCheck(spreadsheetUrl, yourName);
  } else {
    Logger.log("Error fetching script: " + response.getContentText());
  }
}
