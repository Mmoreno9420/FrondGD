# 📁 Sistema de Gestión de Archivos - Gestiones

## Descripción General

Este documento describe el sistema de gestión de archivos para las gestiones en GestiaSoft. El sistema permite subir, almacenar y gestionar archivos PDF asociados a cada gestión.

---

## 📂 Estructura de Carpetas

Los archivos se organizan de la siguiente manera:

```
DocsGestiones/
├── 1/                    # Carpeta para la gestión con ID 1
│   ├── documento1.pdf
│   ├── documento2.pdf
│   └── ...
├── 2/                    # Carpeta para la gestión con ID 2
│   ├── reporte.pdf
│   └── ...
└── ...
```

Cada gestión tiene su propia carpeta identificada por su ID único.

---

## 🔧 Servicios Disponibles

### `fileService.js`

Ubicación: `src/services/fileService.js`

#### Funciones Principales:

### 1. `uploadGestionFiles(gestionId, files)`

Sube archivos a la carpeta de una gestión específica.

**Parámetros:**
- `gestionId` (number): ID de la gestión
- `files` (Array): Array de archivos a subir

**Formato de archivos:**
```javascript
[
  {
    file: File,              // Archivo real del navegador
    documentName: string,    // Nombre del documento
    documentType: string,    // Tipo: 'informe', 'evidencia', etc.
    description: string      // Descripción opcional
  }
]
```

**Ejemplo de uso:**
```javascript
import { uploadGestionFiles } from 'services/fileService';

const files = [
  {
    file: pdfFile,
    documentName: "Reporte Mensual",
    documentType: "informe",
    description: "Reporte del mes de octubre"
  }
];

const result = await uploadGestionFiles(123, files);
```

---

### 2. `createGestionFolder(gestionId)`

Crea la carpeta para una gestión si no existe.

**Parámetros:**
- `gestionId` (number): ID de la gestión

**Ejemplo de uso:**
```javascript
await createGestionFolder(123);
// Crea: DocsGestiones/123/
```

---

### 3. `getGestionFiles(gestionId)`

Obtiene la lista de archivos de una gestión.

**Parámetros:**
- `gestionId` (number): ID de la gestión

**Retorna:**
```javascript
[
  {
    id: 1,
    name: "documento.pdf",
    type: "application/pdf",
    size: 1024000,
    uploadDate: "2024-01-15T10:30:00",
    uploadedBy: "Usuario",
    path: "DocsGestiones/123/documento.pdf"
  }
]
```

---

### 4. `deleteGestionFile(gestionId, fileId)`

Elimina un archivo específico.

**Parámetros:**
- `gestionId` (number): ID de la gestión
- `fileId` (number): ID del archivo

---

### 5. `downloadGestionFile(gestionId, fileId)`

Descarga un archivo específico.

**Parámetros:**
- `gestionId` (number): ID de la gestión
- `fileId` (number): ID del archivo

**Retorna:** Blob del archivo

**Ejemplo de uso:**
```javascript
const blob = await downloadGestionFile(123, 456);
const url = window.URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = 'documento.pdf';
link.click();
```

---

### 6. `validateFiles(files, options)`

Valida archivos antes de subirlos.

**Parámetros:**
- `files` (Array): Array de archivos a validar
- `options` (Object): Opciones de validación
  - `maxSize` (number): Tamaño máximo en bytes (default: 10MB)
  - `allowedTypes` (Array): Tipos MIME permitidos (default: ['application/pdf'])
  - `maxFiles` (number): Número máximo de archivos (default: 10)

**Retorna:**
```javascript
{
  valid: boolean,
  errors: Array<string>
}
```

**Ejemplo de uso:**
```javascript
const validation = validateFiles(files, {
  maxSize: 10 * 1024 * 1024,  // 10MB
  allowedTypes: ['application/pdf'],
  maxFiles: 5
});

if (!validation.valid) {
  console.error('Errores de validación:', validation.errors);
}
```

---

## 🔄 Flujo de Trabajo

### Crear Gestión con Archivos

1. **Usuario completa el formulario** de nueva gestión
2. **Usuario selecciona archivos PDF** en el drag & drop
3. **Usuario presiona "Guardar"**
4. **Sistema valida** los archivos
5. **Sistema crea la gestión** en la base de datos
6. **Sistema obtiene el ID** de la gestión creada
7. **Sistema crea la carpeta** `DocsGestiones/{gestionId}/`
8. **Sistema sube los archivos** a la carpeta
9. **Sistema muestra notificación** de éxito

### Editar Gestión y Agregar Archivos

1. **Usuario abre gestión** en modo edición
2. **Usuario selecciona archivos adicionales**
3. **Usuario presiona "Guardar"**
4. **Sistema valida** los archivos
5. **Sistema actualiza la gestión**
6. **Sistema sube archivos adicionales** a `DocsGestiones/{gestionId}/`
7. **Sistema muestra notificación** de éxito

---

## ✅ Validaciones Implementadas

### Validaciones en Frontend

- ✅ **Tipo de archivo:** Solo PDF
- ✅ **Tamaño máximo:** 10MB por archivo
- ✅ **Número máximo:** 10 archivos por operación
- ✅ **Nombre del documento:** Obligatorio
- ✅ **Tipo de documento:** Obligatorio (informe, evidencia, factura, etc.)

### Validaciones en Backend (a implementar)

- ✅ Verificar existencia de carpeta
- ✅ Crear carpeta si no existe
- ✅ Validar extensión de archivo
- ✅ Validar tamaño de archivo
- ✅ Sanitizar nombres de archivo
- ✅ Guardar metadatos en base de datos

---

## 📊 Estructura de Base de Datos (Sugerida)

```sql
CREATE TABLE gestion_archivos (
    archivo_id SERIAL PRIMARY KEY,
    gestion_id INTEGER NOT NULL,
    nombre_original VARCHAR(255) NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    tipo_documento VARCHAR(50),
    descripcion TEXT,
    ruta_archivo VARCHAR(500) NOT NULL,
    tamano_bytes INTEGER,
    tipo_mime VARCHAR(100),
    usuario_subida_id INTEGER,
    fecha_subida TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (gestion_id) REFERENCES gestiones(gestion_id),
    FOREIGN KEY (usuario_subida_id) REFERENCES usuarios(usuario_id)
);
```

---

## 🔐 Seguridad

### Medidas Implementadas:

1. **Validación de tipo de archivo** en frontend
2. **Validación de tamaño** en frontend
3. **Sanitización de nombres** antes de guardar
4. **Carpetas separadas** por gestión

### Medidas Recomendadas para Backend:

1. **Verificación de extensión real** del archivo (no solo MIME type)
2. **Escaneo antivirus** de archivos subidos
3. **Límite de cuota** por usuario/gestión
4. **Permisos de acceso** basados en roles
5. **Registro de auditoría** de subidas/descargas

---

## 🌐 API Endpoints (Backend)

### Subir Archivos
```
POST /api/adjuntos/manage
Content-Type: multipart/form-data

Body:
- file: Archivo PDF
- metadata: JSON string con la siguiente estructura:
  {
    "accion": 1,
    "user_id": 101,
    "data": {
      "gestion_id": 123,
      "adjunto_id": 0,
      "workflow_id": 2,
      "nombre_archivo": "documento.pdf",
      "ruta_archivo": "",
      "tipo_mime": "application/pdf",
      "unidad_id": 1
    }
  }

Nota: La carpeta DocsGestiones/{gestion_id}/ se crea automáticamente en el backend.
```

### Listar Archivos
```
GET /api/gestiones/:gestionId/archivos
```

### Descargar Archivo
```
GET /api/gestiones/:gestionId/archivos/:fileId/download
```

### Eliminar Archivo
```
DELETE /api/gestiones/:gestionId/archivos/:fileId
```

---

## 📝 Notas Importantes

1. **Carpeta base:** La carpeta `DocsGestiones/` debe existir en el servidor y tener permisos de escritura

2. **Nombres de archivo:** Se recomienda usar el formato:
   - `{gestionId}_{timestamp}_{nombreOriginal}.pdf`
   - Ejemplo: `123_1634567890_reporte.pdf`

3. **Permisos de carpeta:** Las carpetas deben tener permisos 755 o similares

4. **Backup:** Se recomienda implementar backup automático de la carpeta `DocsGestiones/`

5. **Límites del servidor:** Verificar límites de PHP/Node.js:
   - `upload_max_filesize`
   - `post_max_size`
   - `max_file_uploads`

---

## 🐛 Manejo de Errores

### Errores Comunes:

| Error | Causa | Solución |
|-------|-------|----------|
| "Solo se permiten archivos PDF" | Tipo de archivo incorrecto | Verificar que el archivo sea PDF |
| "Excede el tamaño máximo" | Archivo muy grande | Reducir tamaño o aumentar límite |
| "Error al crear carpeta" | Permisos insuficientes | Verificar permisos del servidor |
| "Error al subir archivos" | Conexión interrumpida | Reintentar la operación |

---

## 🔄 Flujo en `Gestiones.js`

```javascript
handleGestionSave(gestionData) {
  // 1. Crear gestión
  result = await createGestion(gestionData);
  gestionId = result.gestion_id;
  
  // 2. Si hay archivos
  if (gestionData.archivos.length > 0) {
    // 3. Validar archivos
    validation = validateFiles(gestionData.archivos);
    
    if (!validation.valid) {
      throw new Error(validation.errors);
    }
    
    // 4. Crear carpeta
    await createGestionFolder(gestionId);
    
    // 5. Subir archivos
    await uploadGestionFiles(gestionId, gestionData.archivos);
  }
  
  // 6. Recargar grid
  await fetchGestiones();
}
```

---

## 📞 Contacto y Soporte

Para más información sobre el sistema de archivos, consultar con el equipo de desarrollo.

---

**Última actualización:** Octubre 2024
**Versión:** 1.0.0

