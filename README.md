# Impostor 🕵️‍♂️

Juego de deducción social.

## Objetivo del Juego

El objetivo es que un grupo de jugadores descubra quiénes son los impostores. A cada jugador se le asigna un rol en secreto. Los jugadores "inocentes" reciben una palabra secreta dentro de una categoría, mientras que los "impostores" no conocen la palabra.

Luego, todos discuten y, basándose en la conversación, los jugadores inocentes deben identificar a los impostores, y los impostores deben intentar adivinar la palabra o pasar desapercibidos para no ser descubiertos. 

## Roles Especiales

* **"Cómplice"**: Un jugador que sabe quién es el impostor y cuyo objetivo es ayudarlo a no ser descubierto.
* **"Distraído"**: Un jugador que recibe una palabra ligeramente diferente a la de los demás (por ejemplo, "Naranja" en lugar de "Mandarina"), lo que podría llevar a que lo confundan con un impostor.

## Tecnologías Utilizadas

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## Estructura del Proyecto

*   `index.html`: Archivo principal que contiene la estructura de la aplicación de una sola página.
*   `css/style.css`: Estilos personalizados que complementan a TailwindCSS.
*   `js/database.js`: Contiene el objeto `wordsDB` con todas las categorías y palabras para el juego.
*   `js/distraido.js`: Define un objeto `wordsDB_distraido` con listas de palabras ligeramente desplazadas para la lógica del rol "Distraído".
*   `js/main.js`: El núcleo de la aplicación. Maneja la lógica del juego, los turnos, la asignación de roles y las actualizaciones de la interfaz.
*   `js/fireflies.js`: Script para generar un fondo animado de luciérnagas.
*   `README.md`: Este archivo.
