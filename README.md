# Misión Diagnóstico · Informática 4.º

Quiz interactivo para el diagnóstico de Informática de 4.º de primaria (Colegio de
Cervantes). Los alumnos responden 20 reactivos en una página divertida guiada por
DonBOT 🤖 y obtienen su resultado al instante. Publicado en GitHub Pages con el
GitHub de Don Profesor (`donprofesor4-maker`).

## Archivos

| Archivo | Descripción |
|---|---|
| `index.html` | Quiz autónomo (vanilla JS, sin dependencias, confeti incluido 🎉) |
| `apps-script.gs` | Código para Google Apps Script (guardar respuestas en una hoja) |

## Página viva

- HTTPS: `https://donprofesor4-maker.github.io/diagnostico-4to-primaria/`

## Estado actual (conectado)

- Web app Apps Script: "Misión Diagnóstico 4to" (deploy v2, acceso Cualquier usuario)
- Hoja: "Diagnóstico Informática 4to" → pestaña `Respuestas`
- `SCRIPT_URL` en `index.html` ya apunta al `/exec` (el flujo E2E está probado:
  envío `text/plain` → doPost → fila en `Respuestas` → pantalla "¡Listo, gracias!")

## Cómo conectar la hoja de respuestas (Google Sheets)

1. Abre [script.google.com](https://script.google.com), crea un proyecto nuevo y
   pega el contenido de `apps-script.gs` en `Code.gs`.
2. Crea (o abre) el Google Sheet donde quieres las respuestas.
   Si creas el Apps Script **desde la hoja** (Extensiones > Apps Script), quedan
   vinculados automáticamente.
3. **Implementar > Nueva implementación > App web**:
   - **Ejecutar como:** Yo (tu cuenta)
   - **Acceso:** Cualquier usuario (incluso anónimo) — los alumnos no necesitan
     cuenta de Google.
4. Copia la URL que termina en `/exec` y pégala en `index.html` en
   `var SCRIPT_URL = "";` (que quede como `var SCRIPT_URL = "https://script.google.com/macros/s/.../exec";`).
5. Sube el cambio: `git add index.html && git commit && git push`.

> Si `SCRIPT_URL` está vacía, el quiz igual funciona: el alumno descarga un
> respaldo `.json` y se lo entrega a la profe.

## Análisis de resultados (pandas)

```python
import pandas as pd

SHEET_ID = "1wwJlmFvbqBqhcpGmK5LAU2H8dJNTggrCzU43gY6LCEE"
url = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Respuestas"
df = pd.read_csv(url)

print("Alumnos por grupo:")
print(df["grupo"].value_counts())
print("\nPromedio de aciertos por grupo:")
print(df.groupby("grupo")["aciertos"].mean())

freq = df[[f"r{i}" for i in range(1, 21)]].apply(pd.value_counts)
print("\nRespuestas más comunes por reactivo:")
print(freq.T)
```

## Desplegar cambios

```bash
git add -A && git commit -m "..." && git push
```

GitHub Pages publica automáticamente desde la rama `main`.