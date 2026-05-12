# AdHealth Project

## Deployment

Het script wordt live gezet via GitHub. Een Google Ads script haalt `AdHealth script V3` op via de raw GitHub URL en voert het uit met `eval()`:

```javascript
var scriptfile_name = "https://raw.githubusercontent.com/Netprofiler/AdHealth/refs/heads/main/AdHealth%20script%20V3";
var response = UrlFetchApp.fetch(scriptfile_name, {muteHttpExceptions: true});
if (response.getResponseCode() === 200) {
  eval(response.getContentText());
  var script = new adHealthCheck(spreadsheetUrl, yourName);
}
```

**"Zet live" betekent: commit en push naar `main` op GitHub.** De productieomgeving leest direct van `main`.

Spreadsheet: `https://docs.google.com/spreadsheets/d/1siQcbqKS9sh1IdBcWs1lz32Xkj5UueOyHeEwX3dTLWc/edit`
