# El Sommelier Server

Backend de El Sommelier RD: expone un endpoint de chat con IA (Azure OpenAI) y persistencia de consultas/vinos en Supabase.

## Requisitos

- Node.js 18+
- Un proyecto de Supabase con las tablas `consultas_sommelier` y `vinos_escaneados`
- Un recurso de Azure OpenAI con un deployment activo

## Instalación

```bash
npm install
cp .env.example .env
```

Completa `.env` con tus credenciales (ver comentarios en `.env.example`).

## Arranque

```bash
npm start
```

El servidor falla con un mensaje claro si falta alguna variable de entorno requerida.

## Endpoints

| Método | Ruta                     | Descripción                                      |
|--------|--------------------------|---------------------------------------------------|
| GET    | `/api/health`            | Chequeo de disponibilidad                          |
| POST   | `/api/sommelier`         | Chat con el Sommelier de Cabecera (Azure OpenAI)   |
| POST   | `/api/guardar-consulta`  | Guarda una consulta en Supabase                    |
| GET    | `/api/vinos`             | Lista hasta 20 vinos escaneados                    |
