/**
 * Web app compartido para diagnósticos de Computación (1.º y 2.º secundaria, 4.º y 6.º primaria).
 * Detecta el campo "grado" en el JSON y escribe en la pestaña correspondiente:
 *   - "4to" → pestaña "Respuestas"
 *   - "6to" → pestaña "Respuestas" (misma que 4.º); guarda sus 30 respuestas y la
 *     columna "grado" (= "6to", posición 4) para separarla después.
 *   - "2do" → pestaña "Respuestas 2do Sec"
 *   - "1ro" → pestaña "Respuestas 1ro Sec"
 *   - "3ro" → pestaña "Respuestas 3ro Sec"
 *
 * Implementar como: Implementar > Nueva implementación > App web
 *   - Ejecutar como: Yo (tu cuenta)
 *   - Acceso: Cualquier usuario
 * Copia la URL que termina en /exec y pégala en index.html (SCRIPT_URL).
 */

var CAMPOS_4TO = ["timestamp","nombre","grupo","r1","r2","r3","r4","r5","r6","r7","r8","r9","r10",
  "r11","r12","r13","r14","r15","r16","r17","r18","r19","r20","aciertos"];

var CAMPOS_2DO = ["timestamp","nombre","grupo","grado","r1","r2","r3","r4","r5","r6","r7","r8","r9","r10",
  "r11","r12","r13","r14","r15","r16","r17","r18","r19","r20","r21","r22","r23","r24","r25","r26","r27","r28","r29","r30","aciertos"];

// 6.º: mismo esquema que el 2.º (30 respuestas + grado en posición 4), para
// que guarde TODAS sus respuestas y se separe por la columna "grado".
var CAMPOS_6TO = CAMPOS_2DO;

// 1.º: mismo esquema que el 2.º (30 respuestas + grado en posición 4).
var CAMPOS_1RO = CAMPOS_2DO;
var CAMPOS_3RO = CAMPOS_2DO;

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var data = JSON.parse(e.postData.contents);
    var grado = data.grado || "4to";

    var ss = SpreadsheetApp.getActiveSpreadsheet();
var sheetName = (grado === "1ro") ? "Respuestas 1ro Sec" :
                    (grado === "2do") ? "Respuestas 2do Sec" :
                    (grado === "3ro") ? "Respuestas 3ro Sec" : "Respuestas";
    var sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
    var campos = (grado === "1ro") ? CAMPOS_1RO :
                 (grado === "2do") ? CAMPOS_2DO :
                 (grado === "3ro") ? CAMPOS_3RO :
                 (grado === "6to") ? CAMPOS_6TO : CAMPOS_4TO;

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(campos);
    }

    var row = campos.map(function(k){ return data[k] !== undefined ? data[k] : ''; });
    row[0] = new Date();
    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ok:true, grado:grado}))
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
  return ContentService.createTextOutput('Diagnóstico activo (1.º, 2.º y 3.º sec, 4.º y 6.º primaria). Usa POST.');
}
