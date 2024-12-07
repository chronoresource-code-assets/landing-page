const SHEET_NAMES = {
  CONTACT: 'Chrono Resource Form Responses',
  ENTHUSIASTS: 'Chrono Resource Enthusiasts',
  BUSINESS: 'Chrono Resource Business'
}

const scriptProp = PropertiesService.getScriptProperties()

function initialSetup() {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  scriptProp.setProperty('key', activeSpreadsheet.getId())
  
  // Setup Contact Form sheet
  setupSheet(SHEET_NAMES.CONTACT, [
    'timestamp', 'name', 'email', 'country', 'userType', 'message'
  ])

  // Setup Enthusiasts sheet
  setupSheet(SHEET_NAMES.ENTHUSIASTS, [
    'timestamp', 'name', 'email', 'country', 'collectionSize', 
    'collectionValue', 'appFeatures'
  ])

  // Setup Business sheet
  setupSheet(SHEET_NAMES.BUSINESS, [
    'timestamp', 'companyName', 'email', 'country', 'businessType', 
    'otherBusinessTypeText', 'appFeatures'
  ])
}

function setupSheet(sheetName, headers) {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  
  // Get or create the sheet
  let sheet = activeSpreadsheet.getSheetByName(sheetName)
  if (!sheet) {
    sheet = activeSpreadsheet.insertSheet(sheetName)
  }
  
  // Create headers if they don't exist or sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    // Format header row
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold')
    sheet.setFrozenRows(1)
  }
}

function doPost(e) {
  // Debug logging
  Logger.log('Request content type: ' + (e.postData ? e.postData.type : 'none'));
  Logger.log('Request parameters: ' + JSON.stringify(e.parameter));
  Logger.log('Request postData: ' + (e.postData ? e.postData.contents : 'none'));

  // Handle CORS preflight requests
  if (e.postData && e.postData.type === "application/json") {
    try {
      const data = JSON.parse(e.postData.contents);
      Logger.log('Parsed JSON data: ' + JSON.stringify(data));
      e.parameter = data;
    } catch (error) {
      Logger.log('Error parsing JSON: ' + error.message);
    }
  }

  const lock = LockService.getScriptLock()
  lock.tryLock(10000)

  try {
    const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
    const formType = e.parameter.formType || 'contact' // Default to contact form for backward compatibility

    Logger.log('Form type: ' + formType);
    Logger.log('Parameters after processing: ' + JSON.stringify(e.parameter));

    let sheetName, requiredFields
    switch(formType) {
      case 'enthusiast':
        sheetName = SHEET_NAMES.ENTHUSIASTS
        requiredFields = ['name', 'email', 'country', 'collectionSize', 'collectionValue']
        break
      case 'business':
        sheetName = SHEET_NAMES.BUSINESS
        requiredFields = ['companyName', 'email', 'country', 'businessType']
        break
      default: // contact form
        sheetName = SHEET_NAMES.CONTACT
        requiredFields = ['name', 'email', 'country', 'userType', 'message']
    }

    Logger.log('Selected sheet: ' + sheetName);
    Logger.log('Required fields: ' + JSON.stringify(requiredFields));

    const sheet = doc.getSheetByName(sheetName)
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    const nextRow = sheet.getLastRow() + 1

    Logger.log('Headers: ' + JSON.stringify(headers));

    // Validate required fields
    for (const field of requiredFields) {
      if (!e.parameter[field]) {
        Logger.log('Missing required field: ' + field);
        throw new Error(`Missing required field: ${field}`)
      }
    }

    // Map the data according to headers
    const newRow = headers.map(header => {
      if (header === 'timestamp') {
        return new Date()
      }
      // Special handling for business type
      if (header === 'otherBusinessTypeText') {
        return e.parameter.businessType === 'others' ? e.parameter[header] : ''
      }
      const value = e.parameter[header] || '';
      Logger.log(`Mapping header ${header} to value: ${value}`);
      return value;
    })

    Logger.log('New row data: ' + JSON.stringify(newRow));
    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow])

    return ContentService
      .createTextOutput(JSON.stringify({ 
        'result': 'success', 
        'row': nextRow,
        'formType': formType 
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', 'https://chronoresource-code-assets.github.io')
      .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type')

  } catch (error) {
    Logger.log('Error: ' + error.message);
    Logger.log('Stack: ' + error.stack);
    return ContentService
      .createTextOutput(JSON.stringify({ 
        'result': 'error', 
        'error': error.message || 'Unknown error occurred',
        'parameters': e.parameter  // This helps debug what data was received
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', 'https://chronoresource-code-assets.github.io')
      .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type')

  } finally {
    lock.releaseLock()
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ 'result': 'error', 'message': 'GET not supported' }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', 'https://chronoresource-code-assets.github.io')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader('Access-Control-Allow-Origin', 'https://chronoresource-code-assets.github.io')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type')
    .setHeader('Access-Control-Max-Age', '3600');
}