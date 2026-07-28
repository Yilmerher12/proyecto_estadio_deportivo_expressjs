# Estadio Deportivo — Mis entregas de `bc-expressjs`

> **Programa:** Tecnólogo en Análisis y Desarrollo de Software (ADSO)  
> **Institución:** SENA  
> **Aprendiz:** Yilmer Hernández Camargo  
> **Ficha:** 3228970  

---

## Presentación del Proyecto

Este repositorio documenta el progreso, entrega y evolución de mis actividades prácticas para el **Bootcamp de Express.js** durante el presente trimestre. 

Para fomentar un aprendizaje práctico y diversificado, el bootcamp asigna un dominio de negocio único a cada aprendiz. En mi caso, el proyecto gira en torno a la gestión e infraestructura lógica de un **Estadio Deportivo**, simulando las operaciones de backend necesarias para coordinar eventos masivos (partidos, conciertos, espectáculos) y sus servicios asociados.

---

## Entidades del Dominio

El sistema se estructura conceptualmente alrededor de cuatro entidades principales:

| Módulo | Descripción | Casos de Uso Principales |
| :--- | :--- | :--- |
| **events** | Gestión de programación para partidos, conciertos u otros espectáculos masivos. | Crear fechas, definir aforos y consultar estado de eventos. |
| **seats** | Representación física y distribución de las zonas del estadio. | Asignación de sectores, filas y numeración de asientos. |
| **tickets** | Proceso de reserva, venta y validación para el acceso al recinto. | Control de disponibilidad, compra y emisión de entradas. |
| **concessions** | Gestión de comercios internos y servicios de consumo dentro del estadio. | Catálogo de productos, control de inventario y órdenes. |

*Nota: La implementación de cada módulo se aborda de forma progresiva según los requerimientos entregables de cada semana.*

---

## Estructura y Navegación del Repositorio

El código fuente del proyecto no se almacena centralizado en la rama principal, sino estructurado mediante **ramas por entregable (`feature branches`)**:

* **`main`**: Funciona exclusivamente como portada, documentación general y punto de entrada al repositorio.
* **`week-XX`**: Ramas independientes para cada entrega semanal (ejemplo: `week-01`, `week-02`). Cada una contiene la implementación del código funcional, pruebas y configuraciones correspondientes a ese módulo.

```text
bc-expressjs/
├──  README.md (Rama: main - Portada principal)
└── [Ramas de trabajo]
    ├── 🌿 week-01 (Fundamentos y proyecto crudo en node.js)
    ├── 🌿 week-02 (Rutas, controladores y manejo de datos)
    └── 🌿 week-0...