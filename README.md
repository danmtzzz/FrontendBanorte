# 🧠 Co-Piloto Financiero – Reto Banorte

*Co-Piloto Financiero* es una aplicación web de análisis financiero desarrollada para el *Reto Banorte: MCP Financiero*.
Permite a usuarios *personales* y *PYMEs* cargar sus registros financieros en formato Excel, procesarlos y obtener un análisis detallado con *recomendaciones generadas por IA (OpenAI)*.

---

## 🚀 Características Principales

* *Carga de archivos Excel (.xlsx)* con registros financieros.
* *Análisis descriptivo* de ingresos, egresos y patrones financieros.
* *Proyecciones y visualizaciones* interactivas.
* *Recomendaciones personalizadas* generadas por un modelo de IA (OpenAI).
* Arquitectura *desacoplada Frontend–Backend*, para máxima flexibilidad y escalabilidad.

---

## 🧩 Arquitectura General del Proyecto

El sistema se compone de dos módulos principales:

### *Frontend (Cliente)*

* Construido en *React (Vite)*.
* Utiliza *Axios* para peticiones HTTP y *Recharts* para visualización de datos.
* Interfaz intuitiva y adaptable.
* Desplegado en:
  👉 *[http://141.148.66.152/](http://141.148.66.152/)*

### *Backend (Servidor MCP)*

* Desarrollado con *FastAPI (Python)*.
* Procesa los datos usando *Pandas*.
* Se comunica con *OpenAI* para generar análisis inteligentes y recomendaciones.
* Implementado como un *MCP (Model Context Protocol)* que centraliza la lógica de negocio, el procesamiento de datos y la interacción con APIs externas.
* Desplegado en:
  👉 *[http://129.213.136.1/](http://129.213.136.1/)*

---

## 🔁 Flujo de Datos y Arquitectura

1. *Usuario (Cliente):* Abre la aplicación web de React en su navegador.
2. *Carga de Archivo:* El usuario selecciona un archivo Excel y presiona *“Aceptar y Analizar”*.
3. *Petición HTTP (POST):* React envía el archivo al servidor mediante *Axios*.
4. *Backend (FastAPI):*

   * El endpoint /api/v1/analisis/financiero/ recibe la petición.
   * Se procesa el Excel con *Pandas* (limpieza, análisis y categorización).
5. *Llamada a la IA (OpenAI):*

   * El backend genera un prompt con el resumen del análisis.
   * Se envía a *OpenAI, que devuelve **recomendaciones en texto (Markdown/HTML)*.
6. *Respuesta del MCP:*

   * Se agrupan los resultados del análisis y las recomendaciones en un *JSON*.
7. *Frontend (React):*

   * Recibe el JSON.
   * Muestra un *<BarChart>* con los gastos e ingresos.
   * Presenta las *recomendaciones de IA* generadas por OpenAI.

---

## 🧰 Tecnologías Utilizadas

| Capa                | Tecnología    | Descripción                                          |
| ------------------- | ------------- | ---------------------------------------------------- |
| *Frontend*        | React + Vite  | Interfaz moderna y rápida                            |
|                     | Axios         | Comunicación con el backend                          |
|                     | Recharts      | Gráficas dinámicas e interactivas                    |
| *Backend*         | FastAPI       | Framework ligero y rápido para APIs                  |
|                     | Pandas        | Procesamiento y análisis de datos                    |
|                     | OpenAI API    | Generación de recomendaciones con IA                 |
| *Infraestructura* | VM en la nube | Despliegue remoto del frontend y backend (puerto 80) |

---

## ⚙ Guía de Ejecución (Desarrollo Local)

### 🔸 Prerrequisitos

Asegúrate de tener instalado:

* *Node.js* (v18 o superior)
* *Python* (v3.10 o superior)
* *Git*

---

## 🖥 1. Backend (Servidor MCP – FastAPI)

El backend debe ejecutarse primero, ya que el frontend depende de él para obtener datos.

bash
# 1. Clonar el repositorio del backend
git clone <URL_DEL_REPOSITORIO_BACKEND>
cd <carpeta-backend>

# 2. (Opcional) Crear un entorno virtual
python -m venv venv

# Activar el entorno virtual
# En Windows:
.\venv\Scripts\activate
# En Linux/Mac:
source venv/bin/activate

# 3. Instalar dependencias
pip install -r requirements.txt
# Asegúrate de que incluya: fastapi, uvicorn, pandas, openai, etc.

# 4. Ejecutar el servidor
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload


📡 El backend estará disponible en:
*[http://127.0.0.1:8000](http://127.0.0.1:8000)*

---

## 💻 2. Frontend (Cliente – React)

En una nueva terminal:

bash
# 1. Clonar el repositorio del frontend
git clone <URL_DEL_REPOSITORIO_FRONTEND>
cd <carpeta-frontend>

# 2. Instalar dependencias
npm install

# 3. Ejecutar la aplicación
npm run dev


🌐 La aplicación se abrirá en tu navegador en:
*[http://localhost:5173](http://localhost:5173)*

---

## ⚠ Nota Importante

Si estás ejecutando el *backend localmente* (en localhost:8000),
asegúrate de **actualizar la variable backendUrl** en el archivo
UploadView.jsx para que apunte a:

js
const backendUrl = "http://127.0.0.1:8000/";


En producción, debe apuntar a la IP del servidor:

js
const backendUrl = "http://129.213.136.1/";


---

## 🧾 Créditos

Proyecto desarrollado para el *Reto Banorte – MCP Financiero*
Equipo: Co-Piloto Financiero
Arquitectura: Frontend + MCP Backend + IA (OpenAI)

🌐 *Frontend:* [http://141.148.66.152/](http://141.148.66.152/)
🖥 *Backend:* [http://129.213.136.1/](http://129.213.136.1/)
