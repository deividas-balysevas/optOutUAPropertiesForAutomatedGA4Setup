function optOutUAProperties() {
  const ss = SpreadsheetApp.openById('CHANGE VALUE');
  const sheet = ss.getSheetByName('CHANGE VALUE');

  const accounts = Analytics.Management.Accounts.list().getItems();
  const ga4RequestDelay = 500;

  accounts.forEach(account => {
    const accountId = account.getId();
    const accountName = account.getName();
    Logger.log(`Account Name: ${accountName}, Account ID: ${accountId}`);
    sheet.appendRow([accountName, accountId]);

    const properties = Analytics.Management.Webproperties.list(accountId).getItems();

    properties.forEach(property => {
      const internalPropertyId = property.getInternalWebPropertyId();
      Logger.log(internalPropertyId)
      try {
        const x = AnalyticsAdmin.Properties.setAutomatedGa4ConfigurationOptOut({
          property: `properties/${internalPropertyId}`,
          optOut: false
        });
        Utilities.sleep(ga4RequestDelay);
        console.log(`Automated GA4 configuration opt-out is set for property ${internalPropertyId}`);
        sheet.appendRow([accountName, accountId, internalPropertyId, 'Automated GA4 configuration opt-out set to false']);
      } catch (e) {
        console.error(`Error updating property ${internalPropertyId}: ${e.message}`);
        sheet.appendRow([accountName, accountId, internalPropertyId, `Error updating property: ${e.message}`]);
      }

      try {
        const y = AnalyticsAdmin.Properties.fetchAutomatedGa4ConfigurationOptOut({
          property: `properties/${internalPropertyId}`
        });
        Utilities.sleep(ga4RequestDelay);
        console.log(`Automated GA4 configuration opt-out status for property ${internalPropertyId}: ${y.getOptOut()}`);
        sheet.appendRow([accountName, accountId, internalPropertyId, `Automated GA4 configuration opt-out status: ${y.getOptOut()}`]);
      } catch (e) {
        console.error(`Error fetching opt-out status for property ${internalPropertyId}: ${e.message}`);
        sheet.appendRow([accountName, accountId, internalPropertyId, `Error fetching opt-out status: ${e.message}`]);
      }
    });
  });
}
