function optOutUAProperties() {
  const ss = SpreadsheetApp.openById('CHANGE_VALUE');
  const sheet = ss.getActiveSheet();
  sheet.clearContents();
  sheet.appendRow(["Account Name", "Account ID", "Tracking ID", "Property ID", "Opt-Out Status"]);

  const accounts = Analytics.Management.Accounts.list().getItems();
  const ga4RequestDelay = 500;

  accounts.forEach(account => {
    const accountId = account.getId();
    const accountName = account.getName();
    Logger.log(`Account Name: ${accountName}, Account ID: ${accountId}`);
    
    const webProperties = Analytics.Management.Webproperties.list(accountId).getItems();
    webProperties.forEach(property => {
      const internalPropertyId = property.getInternalWebPropertyId();
      const trackingId = property.getId();
      Logger.log(`Property ID: ${internalPropertyId}, Tracking ID: ${trackingId}`);
      try {
        const x = AnalyticsAdmin.Properties.setAutomatedGa4ConfigurationOptOut({
          property: `properties/${internalPropertyId}`,
          optOut: true
        });
        Utilities.sleep(ga4RequestDelay);
        console.log(`Automated GA4 configuration opt-out is set for property ${internalPropertyId}`);
        sheet.appendRow([accountName, accountId, trackingId, internalPropertyId, "Opted Out"]);
      } catch (e) {
        console.error(`Error updating property ${internalPropertyId}: ${e.message}`);
        sheet.appendRow([accountName, accountId, trackingId, internalPropertyId, "Error"]);
      }
  
      try {
        const y = AnalyticsAdmin.Properties.fetchAutomatedGa4ConfigurationOptOut({
          property: `properties/${internalPropertyId}`
        });
        Utilities.sleep(ga4RequestDelay);
        const status = y.getOptOut() ? "Opted Out" : "Opted In";
        //Generates double values in Google Sheet thus no point of double checking the status
        //console.log(`Automated GA4 configuration opt-out status for property ${internalPropertyId}: ${status}`);
        //sheet.appendRow([accountName, accountId, trackingId, internalPropertyId, status]);
      } catch (e) {
        console.error(`Error fetching opt-out status for property ${internalPropertyId}: ${e.message}`);
        sheet.appendRow([accountName, accountId, trackingId, internalPropertyId, "Error"]);
      }
    });
  });
}
