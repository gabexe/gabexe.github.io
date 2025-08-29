# Impostor

Juego de deducción social.

## Objetivo del Juego

El objetivo es que un grupo de jugadores descubra quiénes son los impostores. A cada jugador se le asigna un rol en secreto. Los jugadores "inocentes" reciben una palabra secreta dentro de una categoría, mientras que los "impostores" no conocen la palabra.

Luego, todos discuten y, basándose en la conversación, los jugadores inocentes deben identificar a los impostores, y los impostores deben intentar adivinar la palabra o pasar desapercibidos para no ser descubiertos. 

## Roles Especiales

* **"Cómplice"**: Un jugador que sabe quién es el impostor y cuyo objetivo es ayudarlo a no ser descubierto.
* **"Distraído"**: Un jugador que recibe una palabra ligeramente diferente a la de los demás (por ejemplo, "Naranja" en lugar de "Mandarina"), lo que podría llevar a que lo confundan con un impostor.

## Tecnologías Utilizadas

*   **HTML5**: Para la estructura de la aplicación.
*   **TailwindCSS**: Para el diseño y los estilos de la interfaz.
*   **JavaScript (ES6+)**: Para toda la lógica del juego e interactividad.

## Estructura del Proyecto

*   `index.html`: Archivo principal que contiene la estructura de la aplicación de una sola página.
*   `css/style.css`: Estilos personalizados que complementan a TailwindCSS.
*   `js/database.js`: Contiene el objeto `wordsDB` con todas las categorías y palabras para el juego.
*   `js/distraido.js`: Define un objeto `wordsDB_distraido` con listas de palabras ligeramente desplazadas para la lógica del rol "Distraído".
*   `js/main.js`: El núcleo de la aplicación. Maneja la lógica del juego, los turnos, la asignación de roles y las actualizaciones de la interfaz.
*   `js/fireflies.js`: Script para generar un fondo animado de luciérnagas.
*   `README.md`: Este archivo.

## To-do
- [ ] Arreglar opciones que no se guardan: (numero de jugadores e impostores)
