// ==========================================
// Market Vision - Google Apps Script
// ==========================================
// INSTRUCTIONS:
// 1. Paste this entire code into Code.gs
// 2. Save
// 3. First, run "testWrite" to verify it works
// 4. Then Deploy > Manage deployments > Edit > New version > Deploy

// TEST FUNCTION - Run this manually to check sheet access
function testWrite() {
  var doc = SpreadsheetApp.openById('1OTxmOcZOAuYmXpveL-OYF0sTKurdEKqr6NOCY9iK-Io');
  var sheet = doc.getSheetByName('Sheet1');
  sheet.appendRow([
    new Date(),
    'TEST NAME',
    '25',
    'Mumbai',
    'test@email.com',
    '9876543210',
    'Coding',
    '2 years',
    'TradingView',
    'Web Developer',
    '5',
    'Yes',
    'To learn and grow',
    'Build portfolio',
    'github.com/test',
    'Yes'
  ]);
  Logger.log('Test row written successfully!');
}

// FORM HANDLER - This receives the form data
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.openById('1OTxmOcZOAuYmXpveL-OYF0sTKurdEKqr6NOCY9iK-Io');
    var sheet = doc.getSheetByName('Sheet1');

    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp','Full Name','Age','City/Country','Email','Phone','Skills','Experience','Tools','Role','Hours Daily','Consistent','Why Join','Goals','Portfolio','Serious']);
    }

    // Write data using appendRow (simplest and most reliable method)
    sheet.appendRow([
      new Date(),
      e.parameter.fullName || '',
      e.parameter.age || '',
      e.parameter.city || '',
      e.parameter.email || '',
      e.parameter.phone || '',
      e.parameter.skills || '',
      e.parameter.experience || '',
      e.parameter.tools || '',
      e.parameter.role || '',
      e.parameter.hours || '',
      e.parameter.consistent || '',
      e.parameter.whyJoin || '',
      e.parameter.goals || '',
      e.parameter.portfolio || '',
      e.parameter.serious || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({'result':'success'}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({'result':'error','error':error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
