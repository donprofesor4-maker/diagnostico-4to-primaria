/**
 * Recibe las respuestas del diagnóstico de 4.º y las guarda en la hoja "Respuestas".
 * Implementar como: Implementar > Nueva implementación > App web
 *   - Ejecutar como: Yo (tu cuenta)
 *   - Acceso: Cualquier usuario
 * Copia la URL que termina en /exec y pégala en index.html (SCRIPT_URL).
 */

var CAMPOS = ["timestamp","nombre","grupo","r1","r2","r3","r4","r5","r6","r7","r8","r9","r10",
  "r11","r12","r13","r14","r15","r16","r17","r18","r19","r20","aciertos"];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Respuestas') || ss.insertSheet('Respuestas');

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(CAMPOS);
    }

    var data = JSON.parse(e.postData.contents);
    var row = CAMPOS.map(function(k){ return data[k] !== undefined ? data[k] : ''; });
    row[0] = new Date();
    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ok:true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ok:false, error:String(err)}))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput('Diagnóstico 4.º activo. Usa POST.');
}