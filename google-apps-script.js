// ==========================================
// Market Vision - Google Apps Script (FINAL)
// ==========================================

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    Logger.log("doPost triggered");
    Logger.log("Raw parameters: " + JSON.stringify(e.parameter));

    var doc = SpreadsheetApp.openById('1OTxmOcZOAuYmXpveL-OYF0sTKurdEKqr6NOCY9iK-Io');
    var sheet = doc.getSheetByName('Sheet1');

    Logger.log("Sheet found: " + sheet.getName());

    // Add headers if sheet is completely empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp','Full Name','Age','City','Email','Phone',
        'Skills','Experience','Tools','Role','Hours',
        'Consistent','Why Join','Goals','Portfolio','Serious'
      ]);
      Logger.log("Headers added");
    }

    var rowData = [
      new Date(),
      e.parameter.fullName   || '',
      e.parameter.age        || '',
      e.parameter.city       || '',
      e.parameter.email      || '',
      e.parameter.phone      || '',
      e.parameter.skills     || '',
      e.parameter.experience || '',
      e.parameter.tools      || '',
      e.parameter.role       || '',
      e.parameter.hours      || '',
      e.parameter.consistent || '',
      e.parameter.whyJoin    || '',
      e.parameter.goals      || '',
      e.parameter.portfolio  || '',
      e.parameter.serious    || ''
    ];

    Logger.log("Row to write: " + JSON.stringify(rowData));
    sheet.appendRow(rowData);
    Logger.log("Row written successfully!");

    // Send email notification
    try {
      MailApp.sendEmail(
        Session.getActiveUser().getEmail(),
        'New Market Vision Application from ' + (e.parameter.fullName || 'Unknown'),
        'Name: ' + e.parameter.fullName + '\nEmail: ' + e.parameter.email + '\nRole: ' + e.parameter.role
      );
    } catch(mailErr) {
      Logger.log("Email failed (non-critical): " + mailErr);
    }

    return ContentService
      .createTextOutput(JSON.stringify({'result':'success','row': sheet.getLastRow()}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log("CRITICAL ERROR: " + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({'result':'error','error':error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Run this once manually to test sheet access
function testWrite() {
  var doc = SpreadsheetApp.openById('1OTxmOcZOAuYmXpveL-OYF0sTKurdEKqr6NOCY9iK-Io');
  var sheet = doc.getSheetByName('Sheet1');
  sheet.appendRow([new Date(),'Test Name','25','Mumbai','test@email.com','9876543210','Coding','2 years','TradingView','Educator','5','Yes','To grow','Build portfolio','github.com','Yes']);
  Logger.log('testWrite OK!');
}
