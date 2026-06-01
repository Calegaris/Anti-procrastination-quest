# Anti-Procrastination Quest

Choose your language / Selecciona tu idioma:
*   [English Version](#-anti-procrastination-quest-english)
*   [Versión en Español](#-anti-procrastination-quest-español)

---

# 🇺🇸 Anti-Procrastination Quest (English)

Welcome to **Anti-Procrastination Quest**! An interactive web productivity application that gamifies your daily tasks, turning your responsibilities and study routines into an exciting, retro-themed Role-Playing Game (RPG). Register your hero, select a class, create custom missions, and earn experience (XP) to level up and defeat procrastination.

This project was developed as an academic integration project and strictly complies with all educational guidelines and requirements.

---

## 🛡️ Table of Contents
1. [General Description and Purpose](#-general-description-and-purpose)
2. [Team Members](#-team-members)
3. [Project Navigation (Pages)](#-project-navigation-pages)
4. [Technologies Used](#-technologies-used)
5. [Detailed LocalStorage Usage](#-detailed-localstorage-usage)
6. [Project Structure](#-project-structure)
7. [Main Features and Game Logic](#-main-features-and-game-logic)
8. [Responsive Design and Styling](#-responsive-design-and-styling)
9. [Instructions for Local Execution](#-instructions-for-local-execution)
10. [Deployment and Repository Links](#-deployment-and-repository-links)
11. [Accessibility Considerations (A11y)](#-accessibility-considerations-a11y)
12. [Summary of AI Usage](#-summary-of-ai-usage)
13. [Academic Requirements Fulfillment](#-academic-requirements-fulfillment)
14. [Portfolio & Presentation Highlights](#-portfolio--presentation-highlights)

---

## 📝 General Description and Purpose

The core purpose of **Anti-Procrastination Quest** is to battle procrastination by applying **gamification** techniques to time and task management. The human brain naturally responds to immediate reward systems; this project leverages this biological mechanism by transforming routine study, work, wellness, or cleaning tasks into "quests" that reward players with experience points (XP).

By structuring productivity as a retro role-playing game, users experience a continuous sense of progression. The system encourages consistency and active habits through class-specific multipliers, fostering a healthy and organized routine.

---

## 👥 Team Members

The platform's design and full-stack development were executed by:
*   **Luis Ángel Calegari** 
*   **Agustín D'Esposito**

---

## 🧭 Project Navigation (Pages)

The application features a smooth navigation flow divided into three main pages:

1.  **Welcome & Onboarding Page (`/index.html`):** 
    The entry gateway. If no active session is found, it allows users to register a hero name and choose a starting class. Clicking on class cards (Warrior or Mage) opens an interactive modal showing the hero's visual evolution path and detailed bonus specifications. Returning heroes are automatically redirected to the Dashboard.
2.  **Character Dashboard (`/pages/dashboard.html`):** 
    The hero's central hub. It renders the dynamic character banner featuring the hero's evolved avatar, name, current level, RPG title, and a graphical XP progression bar. Active quests are displayed below, allowing users to complete them with a single click to claim XP rewards.
3.  **Missions Guild Board (`/pages/missions.html`):** 
    The guild board where players create custom quests. The left column features a creation form with advanced real-time validation and a **Live Card Preview** that updates in real-time. The preview dynamically calculates the quest's rarity (Common, Uncommon, Rare, Epic, Legendary) and XP payout based on difficulty and frequency inputs. The right column renders the full quest log with advanced combined filtering and dynamic action buttons based on quest state.

---

## 🛠️ Technologies Used

To guarantee clean, highly maintainable, and performant code, we opted for a dependency-free architecture (**Vanilla Web Stack**):

*   **Semantic HTML5:** Native structural tags (`<main>`, `<header>`, `<nav>`, `<section>`, `<article>`, `<button>`) to optimize SEO indexability and support screen-reading technologies.
*   **Vanilla CSS3:** A design system built on CSS variables (`variables.css`), smooth keyframe animations, glassmorphism blur effects, and fluid layouts powered by CSS Grid and Flexbox.
*   **Modular ES6+ JavaScript:** Client-side architecture separated into focused utility modules (Storage, RPG Engine, DOM Interaction, and page controllers).
*   **LocalStorage API:** Complete client-side persistence of user profiles and quest states, ensuring flawless state recovery across page reloads.

---

## 💾 Detailed LocalStorage Usage

State persistence is managed on the client side via the `window.localStorage` API through `storage.js`. Two JSON keys are utilized:

### 1. User Key (`apq_user`)
Saves the active player's profile object.
*   **JSON Schema:**
    ```json
    {
      "name": "Aragorn",
      "class": "warrior",
      "level": 3,
      "experience": 45,
      "streak": 0
    }
    ```
*   **Usage:** Used to render the dynamic banner, calculate levels, apply class passive modifiers based on the current day, and handle onboarding redirects.

### 2. Missions Key (`apq_missions`)
Saves an array of custom quest objects created by the player.
*   **JSON Schema:**
    ```json
    [
      {
        "id": "m_1717208930412",
        "name": "Study React for 1 hour",
        "description": "Review basic hooks and complete the practical lab.",
        "category": "estudio",
        "difficulty": "medio",
        "cooldown": 24,
        "rarity": "Poco Común",
        "exp": 120,
        "estado": "activa",
        "status": "active"
      }
    ]
    ```
*   **Usage:** Used to populate lists on both the dashboard and the guild page. Missions are persisted in exactly 3 unified states:
    *   `activa` / `active`: Available to complete on the board or dashboard.
    *   `inactiva` / `inactive`: Inactive/cooldown state (e.g. cooldown finished or legacy "vencida"). Can be reactivated.
    *   `completada` / `completed`: Already completed during the session.
    
    Actions on mission cards dynamically change based on their current state:
    *   **Active (`activa`):** Shows "Complete" (`Completar`) and "Delete" (`Eliminar`) buttons.
    *   **Inactive (`inactiva`):** Shows "Reactivate" (`Reactivar`) and "Delete" (`Eliminar`) buttons.
    *   **Completed (`completada`):** Shows only the "Delete" (`Eliminar`) button.

The `Storage` module encapsulates all read/write operations within safe `try-catch` blocks and exposes helper routines like `isMissionNameUnique(name)` for case-insensitive duplicate prevention.

---

## 📂 Project Structure

The repository is organized cleanly, keeping styles, scripts, and static resources separated logically:

```text
anti-procrastination-quest/
│
├── index.html                    # Welcome, login, and class selection (Root)
├── README.md                     # Official project documentation (Combined EN/ES)
├── informe-ia.md                 # Academic report on AI usage
├── .gitignore                    # Git ignore rule specifications
│
└── assets/                       # Static resources
    ├── avatares/                 # Evolved hero sprites
    │   ├── guerrero/             # Warrior sprites (nivel_1 to nivel_4)
    │   └── mago/                 # Mage sprites (nivel_1 to nivel_4)
    │
    ├── css/                      # Stylesheets
    │   ├── variables.css         # Design system tokens, variables, and typography
    │   ├── global.css            # Base resets and global body settings
    │   ├── layout.css            # Application shells and navigation layouts
    │   ├── components.css        # Buttons, inputs, cards, and modal components
    │   └── pages/                # Page-specific styling
    │       ├── login.css         # Onboarding page CSS
    │       ├── dashboard.css     # Main dashboard CSS and XP bar glow
    │       └── missions.css      # Guild board form, live card, and lists
    │
    └── js/                       # JavaScript modules
        ├── storage.js            # LocalStorage utility wrapper and operations
        ├── progression.js        # RPG progression engine, experience math, and multipliers
        ├── ui.js                 # DOM cache manager, modal, toasts, and lightbox controls
        ├── character-banner.js   # Character banner renderer, responsive sprites, and SVGs
        ├── main.js               # Welcome page controller and onboarding rules
        └── pages/                # Page-specific control flows
            ├── dashboard.js      # Dashboard controller (active lists)
            └── missions.js       # Missions guild controller (form events, filters, and actions)
 
```

---

## 🔮 Main Features and Game Logic

### 1. Interactive Onboarding & Class Selection
*   **Onboarding Validation:** Guarantees player names are between 1 and 30 characters, updating an interactive char counter (`0/30`) and reporting context-aware input errors.
*   **Evolution Showcase Modal:** Clicking on any class triggers a custom modal showcasing the class's aesthetic development (spanning 4 visual evolutions: *Novice, Veteran, Champion, Master*) and outlining their active day multipliers.

### 2. Missions Guild Form & Live Card Preview
*   **Custom Quest Registry:** Users specify Name, Description, Category (Study, Work, Cleaning, Wellness, Creativity), Difficulty (Easy, Medium, Hard, Epic), and Cooldown.
*   **Live Preview Card:** As the user writes in the form, the card updates dynamically in real-time:
    *   Synchronizes name and description texts.
    *   Displays the corresponding category emoji.
    *   Derives card rarity based on the difficulty and cooldown settings.
    *   Updates card styles, box shadows, and borders to match rarity colors (*Common, Uncommon, Rare, Epic, Legendary*).
    *   Calculates and projects the exact XP yield.
*   **Case-Insensitive Duplicate Prevention:** Cross-references the input name with saved active quests in real-time, disabling submission if a collision is found.

### 3. Advanced Filtering & State Interactions
*   **Unified State Badge System:** Mission cards display explicit color-coded badges indicating their visual state (`activa` in green, `inactiva` in gray, `completada` in blue).
*   **Chained Dual Filters:** The board features side-by-side dropdown filters for **State** (Active, Inactive, Completed, All) and **Category** (Study, Health/Habits, Personal/Home, Work, Fun, All). Filters act cumulatively to narrow down the displayed list instantly without visual lag, rendering detailed empty states when no missions match the criteria.
*   **Contextual Actions:** Completing active missions immediately increases player experience and shifts their state to `completada`. Inactive missions can be reactivated back to `activa`.
*   **Redesigned Delete Modal:** A modern, centered overlay confirmation dialog for deletion. Features balanced layout styling, a clear warning warning message, equal-height actions ("Cancelar" and "Confirmar"), and a close "X" button correctly aligned in the top-right corner.

### 4. Progression Engine & RPG Logic
*   **Incremental XP Thresholds:** Raising the hero's level requires increasingly more XP per level, controlled by an exponential progression curve:
    *   **Level 1:** 100 XP
    *   **Level 2:** 250 XP
    *   **Level 3:** 400 XP
    *   **Level 4:** 600 XP
    *   **Level 5:** 900 XP
    *   **Level 6:** 1200 XP
    *   **Level 7:** 1600 XP
    *   **Level 8:** 2000 XP
    *   **Level 9:** 2500 XP
    *   **Level 10 (MAX LEVEL):** Reaches maximum capacity, hiding the XP track and displaying a glowing "MAX LEVEL" sign.
*   **Day-Dependent Class Passive Modifiers:**
    *   **Warrior (Consistency):** Earns a **1.25x XP** multiplier for completing tasks from Monday to Friday.
    *   **Mage (Burst Focus):** Earns a **1.75x XP** multiplier for completing tasks on Saturdays and Sundays.
*   **Sequential Notification Dispatcher (Toasts):** When completing a task, the system adds experience, checks for levels, updates state, and launches non-overlapping visual notifications sequentially:
    1.  *Toast 1:* "Mission completed! You earned +125 XP."
    2.  *Toast 2 (On Level Up):* "🎉 LEVEL UP! You are now Level X (RPG Title)."

### 5. Visual Polish & Resilient Architecture
*   **Retro Lightbox Zoom:** Clicking on character avatars or evolution chain sprites opens a fullscreen dark-backdrop lightbox overlay featuring escape-key dismissals and responsive captions.
*   **Initials SVG Avatar Generator:** If local avatar image assets fail to load, the script generates a base64 vector SVG avatar showing the player's capital initials over a retro dark and gold background.

---

## 📱 Responsive Design and Styling

The UI is designed to feel like a modern, gamified app with pixel-perfect touches and subtle cyberpunk glows:

*   **Premium Color Palettes:** Harmonious dark tones (`#171A21`, `#222630`) highlighted by gold accents (`#D4AF37`) and color-coded rarity systems.
*   **Fluid CSS Grid & Flexbox:** View layouts automatically adjust to viewports. On desktops, the missions guild page features a spacious side-by-side view; on smaller screens, it collapses cleanly into a single, scrollable column.
*   **App-Like Mobile Navigation ("Bottom Nav"):** On mobile displays, the classic desktop headers hide, replaced by an ergonomic floating bottom navigation menu, making actions accessible with a single thumb.

---

## ⚙️ Instructions for Local Execution

Since this project is built entirely on native web APIs, **it requires no build steps, bundlers, or package installations**.

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/Calegaris/Anti-procrastination-quest.git
    ```
2.  **Launch a Local Web Server:**
    *   *Option A (Recommended):* Use the **Live Server** extension in VS Code (right-click `index.html` and select *Open with Live Server*).
    *   *Option B (Python Server):* Run this command inside the project root:
        ```bash
        python -m http.server 8000
        ```
        Then, navigate to [http://localhost:8000](http://localhost:8000) in your web browser.
3.  **A Note on `file://` Protocols:** Although double-clicking `index.html` to open it in a browser works, running the app on a local port is highly recommended to avoid LocalStorage isolation conflicts and browser routing errors.

---

## 🔗 Deployment and Repository Links

*   **Live Production Link:** [Anti-Procrastination Quest on GitHub Pages](https://calegaris.github.io/Anti-procrastination-quest/)
*   **Source Code Repository:** [Anti-Procrastination Quest on GitHub](https://github.com/Calegaris/Anti-procrastination-quest)

---

## ♿ Accessibility Considerations (A11y)

The application was designed to ensure compatibility and ease of use for users of all abilities:

*   **Semantic Structure & ARIA:** Strict usage of native structural tags, accompanied by aria roles (`role="dialog"`, `role="region"`, `aria-labelledby`, and `aria-live="polite"` for sequential toasts and dynamic list updates).
*   **Dynamic Alt Tags:** Image descriptions are updated programmatically to describe the player's hero name, class, and level.
*   **Keyboard Friendliness:** Modal views and the image lightbox support `Escape` key listeners to allow rapid dismissals.
*   **High Contrast:** Legible font sizes and high-contrast light texts over solid dark backgrounds, using highly readable fonts (*Inter* and *Fira Code*).

---

## 🤖 Summary of AI Usage

Throughout the development of **Anti-Procrastination Quest**, the team utilized AI tools (specifically LLM-based coding assistants) under an interactive **technical co-piloting** model. The complete, detailed documentation regarding prompts, assistance areas, corrections, and group resolutions can be found in the official academic [AI Usage Report (informe-ia.md)](informe-ia.md).

Key areas of assistance include:
1.  **XP Progression Curve Design:** Assisted in defining the mathematical XP progression thresholds and calculating precise progress percentages.
2.  **CSS Adaptability & Responsiveness:** Helped structure flexible CSS Grids and ergonomic media queries for mobile-friendly interfaces.
3.  **Asynchronous UI Handling:** Collaborated on building a clean, promise-based sequential toast dispatcher.
4.  **Fallback SVG Avatar Formula:** Helped write the vector SVG string alignment math to dynamically output initials in Base64 format.

*Note: The core architecture, styling aesthetics, feature designs, and usability tests were guided and developed independently by the human creators.*

---

## 🎓 Academic Requirements Fulfillment

The following checklist details how each of the integration guidelines and academic requirements are satisfied:

| Requirement | Status | Technical Implementation / File Location |
| :--- | :---: | :--- |
| **Minimum 3 HTML Pages** | **Passed** | exactly 3 pages are fully functional: `index.html`, `pages/dashboard.html`, and `pages/missions.html`. |
| **Responsive Media Queries** | **Passed** | Fully responsive grids and viewport adjustments inside `layout.css`, `login.css`, `dashboard.css`, and `missions.css`. |
| **3+ JS Functionalities** | **Passed** | 1. Player onboarding & form validations.<br>2. RPG progression & day-based class multipliers.<br>3. Custom quest creator with interactive live card preview.<br>4. Cumulative filters & dynamic state badge actions.<br>5. Lightbox overlay & initials SVG generator. |
| **Mandatory Storage Usage** | **Passed** | Managed locally via `storage.js` using structured schemas under keys `apq_user` and `apq_missions`. |
| **Organized Structure** | **Passed** | Dedicated folders for assets, components, pages, JS controllers (`assets/js/pages`), and stylesheets. |
| **Public GitHub Repo** | **Passed** | Hosted publicly on [Anti-Procrastination-Quest GitHub](https://github.com/Calegaris/Anti-procrastination-quest). |
| **Branch Management** | **Passed** | Structured workflow using branches (`feature/*`) integrated into `develop` and deployed via `main`. |
| **15+ Total Commits** | **Passed** | Exceeds 25 commits in the repository's Git history. |
| **4+ Commits per Member** | **Passed** | Luis Ángel Calegari (18 commits) and Agustín D'Esposito (14 commits) exceed the requirements. |
| **Conventional Commits** | **Passed** | Neat commit history under unified structures (`feat:`, `style:`, `refactor:`, `docs:`, `chore:`). |
| **Final Pull Request** | **Passed** | Documented PR integrations from `develop` into `main` (e.g., PR #1, PR #2, PR #5, PR #7). |
| **README & AI Report** | **Passed** | Satisfied by `README.md` and [informe-ia.md](informe-ia.md). |
| **Functional Live Deploy** | **Passed** | Hosted and fully operational via GitHub Pages. |

---

# 🇪🇸 Anti-Procrastination Quest (Español)

¡Bienvenido a **Anti-Procrastination Quest**! Una aplicación web interactiva de productividad que gamifica tus tareas diarias, convirtiendo tus responsabilidades y rutinas de estudio en una emocionante aventura de rol (RPG) de estilo retro. Registra a tu héroe, selecciona su clase, crea misiones personalizadas y obtén experiencia para subir de nivel y vencer a la procrastinación.

Este proyecto ha sido desarrollado como integrador académico y cumple rigurosamente con los estándares y requisitos establecidos.

---

## 🛡️ Tabla de Contenidos
1. [Descripción General y Propósito](#-descripción-general-y-propósito)
2. [Miembros del Equipo](#-miembros-del-equipo)
3. [Navegación del Proyecto (Páginas)](#-navegación-del-proyecto-páginas-1)
4. [Tecnologías Utilizadas](#-tecnologías-utilizadas-1)
5. [Uso detallado de LocalStorage](#-uso-detallado-de-localstorage-1)
6. [Estructura del Proyecto](#-estructura-del-proyecto-1)
7. [Funcionalidades Principales y Lógica de Juego](#-funcionalidades-principales-y-lógica-de-juego-1)
8. [Diseño Responsivo y Estilos](#-diseño-responsivo-y-estilos-1)
9. [Instrucciones para Ejecución Local](#-instrucciones-para-ejecución-local-1)
10. [Despliegue y Repositorio](#-despliegue-y-repositorio-1)
11. [Consideraciones de Accesibilidad (A11y)](#-consideraciones-de-accesibilidad-a11y-1)
12. [Resumen de Uso de Inteligencia Artificial](#-resumen-de-uso-de-inteligencia-artificial-1)
13. [Cumplimiento de Requisitos Académicos](#-cumplimiento-de-requisitos-académicos-1)
14. [Detalles para Presentación de Portafolio](#-detalles-para-presentación-de-portafolio-1)

---

## 📝 Descripción General y Propósito

El propósito principal de **Anti-Procrastination Quest** es combatir la procrastinación mediante la aplicación de técnicas de **gamificación** en la gestión del tiempo y las tareas del usuario. El cerebro humano responde positivamente a los sistemas de recompensas inmediatas; este proyecto aprovecha este principio al transformar tareas cotidianas de estudio, trabajo, bienestar o limpieza en "misiones" que otorgan experiencia (XP).

Al estructurar la productividad como un videojuego de rol, el usuario experimenta una sensación continua de progresión. El sistema penaliza la inactividad y premia la constancia mediante multiplicadores específicos por clase, incentivando una rutina organizada y saludable.

---

## 👥 Miembros del Equipo

El desarrollo y diseño integral de la plataforma fue realizado por:
*   **Luis Ángel Calegari** 
*   **Agustín D'Esposito**

---

## 🧭 Navegación del Proyecto (Páginas)

La aplicación cuenta con una navegación fluida estructurada en las siguientes tres secciones principales:

1.  **Página de Bienvenida y Onboarding (`/index.html`):** 
    Es el portal de entrada. Si no hay una sesión activa, permite registrar el nombre del héroe y seleccionar una clase. Al hacer clic en las tarjetas de clase (Guerrero o Mago), se despliega un modal interactivo con la evolución visual y bonificaciones detalladas. Si el usuario ya está registrado, se redirige automáticamente al Dashboard.
2.  **Dashboard del Personaje (`/pages/dashboard.html`):** 
    El centro de operaciones del héroe. Muestra el banner dinámico del personaje con su avatar evolucionado, nombre, nivel actual, título honorífico y una barra gráfica de progresión de experiencia (XP). Abajo se renderizan en tiempo real las **Misiones Activas** que se pueden completar con un clic para sumar XP.
3.  **Gremio de Misiones (`/pages/missions.html`):** 
    El tablero del gremio. Cuenta con un panel izquierdo para crear nuevas aventuras mediante un formulario interactivo con validaciones avanzadas en tiempo real. Incluye una **vista previa interactiva de la carta de misión** que se actualiza dinámicamente mostrando su rareza (Común, Poco Común, Raro, Épico, Legendario) y recompensa de XP según las entradas del usuario. El panel derecho muestra el listado completo de misiones con filtros combinados avanzados y botones interactivos según el estado de la misión.

---

## 🛠️ Tecnologías Utilizadas

Para garantizar un código limpio, mantenible y de alto rendimiento, se optó por un enfoque libre de frameworks pesados de terceros (**Vanilla Web Stack**):

*   **HTML5 Semántico:** Estructuración limpia mediante elementos nativos (`<main>`, `<header>`, `<nav>`, `<section>`, `<article>`, `<button>`) que facilitan la indexación y el soporte de tecnologías de asistencia.
*   **CSS3 (Vanilla):** Sistema de estilos robusto y flexible basado en variables CSS (`variables.css`), estructurado en layouts fluidos, animaciones sutiles, efectos de desenfoque por cristal (glassmorphism) y un sistema responsivo basado en CSS Grid y Flexbox.
*   **JavaScript ES6+ (Modular):** Lógica del lado del cliente modularizada en archivos individuales orientados a propósitos específicos (Gestión de almacenamiento, Progreso RPG, Control visual y enrutadores de página).
*   **LocalStorage API:** Almacenamiento persistente local de datos de usuario y misiones, garantizando persistencia completa entre recargas del navegador.

---

## 💾 Uso detallado de LocalStorage

La persistencia del estado de juego se realiza en el cliente a través de la API `window.localStorage` mediante el módulo `storage.js`. Se definieron dos claves exclusivas estructuradas en formato JSON:

### 1. Clave de Usuario (`apq_user`)
Almacena el objeto del perfil del jugador activo.
*   **Estructura del JSON:**
    ```json
    {
      "name": "Aragorn",
      "class": "warrior",
      "level": 3,
      "experience": 45,
      "streak": 0
    }
    ```
*   **Uso:** Sirve para renderizar el banner de personaje, calcular el nivel, aplicar multiplicadores temporales por clase, y controlar las redirecciones de sesión en el punto de entrada.

### 2. Clave de Misiones (`apq_missions`)
Almacena un arreglo de objetos de misiones personalizadas creadas por el usuario.
*   **Estructura del JSON:**
    ```json
    [
      {
        "id": "m_1717208930412",
        "name": "Estudiar React 1 hora",
        "description": "Repasar hooks básicos y completar el laboratorio práctico.",
        "category": "estudio",
        "difficulty": "medio",
        "cooldown": 24,
        "rarity": "Poco Común",
        "exp": 120,
        "estado": "activa",
        "status": "active"
      }
    ]
    ```
*   **Uso:** Permite poblar los tableros del gremio y del dashboard. Las misiones se guardan y mantienen en exactamente 3 estados unificados:
    *   `activa` / `active`: Disponible para completar en el tablero o panel.
    *   `inactiva` / `inactive`: Estado inactivo o en cooldown tras completado o vencido. Permite reactivarse.
    *   `completada` / `completed`: Ya completada por el usuario.
    
    Las acciones disponibles en cada carta de misión cambian de forma dinámica según su estado:
    *   **Activa (`activa`):** Muestra los botones de "Completar" y "Eliminar".
    *   **Inactiva (`inactiva`):** Muestra los botones de "Reactivar" y "Eliminar".
    *   **Completada (`completada`):** Muestra únicamente el botón de "Eliminar".

El módulo `Storage` encapsula llamadas seguras con bloques `try-catch` para evitar fallas en navegadores con almacenamiento lleno o desactivado y expone validaciones útiles como `isMissionNameUnique(name)` (sensibilidad insensible a mayúsculas/minúsculas).

---

## 📂 Estructura del Proyecto

El repositorio cuenta con una estructura de directorios limpia, separada de forma lógica por tipo de recurso y página:

```text
anti-procrastination-quest/
│
├── index.html                    # Página de Onboarding y Selección de Clase (Raíz)
├── README.md                     # Documentación oficial del proyecto (Combinado EN/ES)
├── informe-ia.md                 # Informe académico del uso de Inteligencia Artificial
├── .gitignore                    # Reglas de exclusión de Git
│
└── assets/                       # Recursos estáticos del sistema
    ├── avatares/                 # Sprites de evolución del héroe
    │   ├── guerrero/             # Sprites del Guerrero (nivel_1 a nivel_4)
    │   └── mago/                 # Sprites del Mago (nivel_1 a nivel_4)
    │
    ├── css/                      # Estilos globales y específicos
    │   ├── variables.css         # Tokens de diseño, colores y tipografías
    │   ├── global.css            # Reinicios CSS y configuraciones base del body
    │   ├── layout.css            # Envoltorios de app y menús de navegación
    │   ├── components.css        # Botones, entradas de formulario, tarjetas y modals
    │   └── pages/                # Estilos específicos de cada página
    │       ├── login.css         # Estilos del onboarding de bienvenida
    │       ├── dashboard.css     # Panel principal y barra de XP
    │       └── missions.css      # Panel de creación, preview y listados
    │
    └── js/                       # Módulos de lógica en JavaScript
        ├── storage.js            # Módulo de operaciones y persistencia en LocalStorage
        ├── progression.js        # Motor RPG, fórmulas de XP y multiplicadores de clase
        ├── ui.js                 # Manejo visual del DOM, modals, toasts y lightboxes
        ├── character-banner.js   # Renderizador del banner, avatares dinámicos y SVGs
        ├── main.js               # Controlador de index.html (onboarding)
        └── pages/                # Lógica asociada a vistas específicas
            ├── dashboard.js      # Controlador de dashboard.html (misiones activas)
            └── missions.js       # Controlador de missions.html (formulario, filtros y acciones)


```

---

## 🔮 Funcionalidades Principales y Lógica de Juego

### 1. Onboarding Interactivo y Selección de Clase
*   **Validación de Formulario:** Controla que el nombre del héroe tenga entre 1 y 30 caracteres, mostrando errores visuales contextuales y un contador interactivo (`0/30`).
*   **Modal de Evolución ("Evolution Showcase"):** Al hacer clic en una clase del grid, se abre un modal con transición animada. Este expone el camino de desarrollo del personaje (4 niveles visuales con sus respectivos nombres de rango: *Novato, Veterano, Campeón, Maestro*) y las especificaciones de sus bonificaciones de rol.

### 2. Tablero de Creación y Live Card Preview
*   **Creación Personalizada:** Permite definir Nombre, Descripción, Categoría (Estudio, Trabajo, Limpieza, Bienestar, Creatividad), Dificultad (Fácil, Medio, Difícil, Épico) y Cooldown.
*   **Vista Previa Reactiva ("Live Preview"):** A medida que el usuario edita los campos del formulario, la carta derecha se actualiza al instante en tiempo real:
    *   Sincroniza texto y descripción.
    *   Muestra el icono dinámico de la categoría.
    *   Calcula el nivel de rareza combinando dificultad y cooldown.
    *   Actualiza el color de la tarjeta, sombras luminosas y bordes en base a la rareza (*Común, Poco Común, Raro, Épico, Legendario*).
    *   Calcula la experiencia base esperada.
*   **Restricción de Duplicados:** Valida en tiempo real que el nombre de la misión no se repita en la lista activa, deshabilitando el botón de envío en caso de colisión.

### 3. Sistema de Filtros Combinados y Estados Dinámicos
*   **Indicadores de Estado Visuales:** Cada tarjeta de misión muestra explícitamente su estado unificado mediante un badge de color distintivo (`activa` en verde, `inactiva` en gris, `completada` en azul).
*   **Filtros Acumulativos y Encadenados:** El tablero de misiones incorpora controles independientes para filtrar simultáneamente por **Estado** y por **Categoría**. Los filtros se combinan instantáneamente de forma interactiva y pintan un estado vacío explicativo y amigable en caso de no hallar coincidencias.
*   **Acciones Contextuales:** Completar tareas añade experiencia y actualiza de inmediato el estado de la misión a `completada`. Las misiones en cooldown o inactivas pueden ser reactivadas con un solo clic.
*   **Modal de Confirmación de Eliminación Rediseñado:** Diálogo emergente integrado con el diseño general del juego, centrado vertical y horizontalmente. Ofrece un diseño equilibrado con botones simétricos y de igual altura ("Cancelar" y "Confirmar") y un botón de cierre "X" en la esquina superior derecha del panel.

### 4. Motor RPG de Experiencia y Progresión
*   **Curva de Dificultad Dinámica:** Para subir de nivel, se requiere una cantidad incremental de XP definida por una tabla de niveles escalonada:
    *   **Nivel 1:** 100 XP
    *   **Nivel 2:** 250 XP
    *   **Nivel 3:** 400 XP
    *   **Nivel 4:** 600 XP
    *   **Nivel 5:** 900 XP
    *   **Nivel 6:** 1200 XP
    *   **Nivel 7:** 1600 XP
    *   **Nivel 8:** 2000 XP
    *   **Nivel 9:** 2500 XP
    *   **Nivel 10 (Nivel Máximo):** Límite alcanzado, la barra gráfica se oculta y muestra el título exclusivo "MAX LEVEL".
*   **Bonificaciones de Clase Dinámicas (Pasivas de Rol):**
    *   **Guerrero (Consistency):** Obtiene un multiplicador del **1.25x EXP** al completar tareas de Lunes a Viernes.
    *   **Mago (Burst Focus):** Obtiene un multiplicador del **1.75x EXP** al completar tareas los Sábados y Domingos.
*   **Resolución Secuencial de Notificaciones (Toasts):** Al completar una tarea, el sistema procesa la XP final (aplicando pasivas de clase), actualiza los valores del usuario y despacha una cola secuencial de alertas visuales elegantes:
    1.  *Toast 1:* "¡Misión completada! Has ganado +125 EXP."
    2.  *Toast 2 (Si aplica subida de nivel):* "🎉 ¡SUBISTE DE NIVEL! Ahora eres Nivel X (Título del Nivel)."

### 5. Componentes Premium Visuales y Robustez
*   **Lightbox de Imagen Zoom:** Al hacer clic sobre el avatar del Dashboard o los sprites del modal de onboarding, se despliega un Lightbox interactivo a pantalla completa con controles de cerrado, difuminado de fondo y caption descriptiva.
*   **Generador de Avatar Fallback SVG:** Si los archivos de imagen locales fallan al cargarse, el script `character-banner.js` captura las iniciales del nombre del jugador (hasta 2 letras en mayúscula) y genera dinámicamente un avatar de vector SVG en línea codificado en Base64 con temática retro de oro y gris oscuro.

---

## 📱 Diseño Responsivo y Estilos

El diseño visual de la aplicación se ha concebido para emular una interfaz moderna de videojuego con toques cyberpunk y retro. Se utilizaron prácticas avanzadas de CSS puro:

*   **Paleta de Colores Armoniosa:** Tonos oscuros profundos (`#171A21`, `#222630`) con detalles dorados premium (`#D4AF37`) y destellos temáticos según la rareza de las cartas y la clase del héroe.
*   **Layout Adaptativo (CSS Grid & Flexbox):** Las vistas se estructuran en rejillas auto-ajustables. En pantallas de escritorio, el gremio muestra una distribución de dos columnas simétricas (creación a la izquierda, listado a la derecha); en dispositivos móviles, se colapsa limpiamente en una sola columna ordenada de manera vertical.
*   **Navegación Móvil de Estilo Nativo ("Bottom Nav"):** Se implementó un menú de navegación flotante inferior para dispositivos móviles de baja resolución, asegurando que las acciones principales (Dashboard, Misiones) estén al alcance del pulgar del usuario, mejorando la ergonomía de uso.

---

## ⚙️ Instrucciones para Ejecución Local

Dado que el proyecto está construido puramente con el stack clásico nativo (Vanilla HTML/CSS/JS), **no requiere de instaladores de paquetes, bundlers o dependencias de Node.js**.

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/Calegaris/Anti-procrastination-quest.git
    ```
2.  **Iniciar un Servidor Web Local:**
    *   *Opción A (Recomendada):* Utiliza la extensión **Live Server** en VS Code (abre la carpeta raíz, haz clic derecho en `index.html` y selecciona *Open with Live Server*).
    *   *Opción B (Python):* Ejecuta el comando en tu terminal dentro del directorio del proyecto:
        ```bash
        python -m http.server 8000
        ```
        Luego abre [http://localhost:8000](http://localhost:8000) en tu navegador.
3.  **Nota sobre el protocolo `file://`:** Aunque es posible abrir el archivo `index.html` haciendo doble clic directamente, se recomienda fuertemente el uso de un servidor web local para asegurar el correcto funcionamiento del enrutamiento relativo y las restricciones de persistencia de localStorage.

---

## 🔗 Despliegue y Repositorio

*   **Enlace al Despliegue en Vivo:** [Anti-Procrastination Quest en GitHub Pages](https://calegaris.github.io/Anti-procrastination-quest/)
*   **Enlace al Repositorio de Código:** [Repositorio GitHub de la Aventura](https://github.com/Calegaris/Anti-procrastination-quest)

---

## ♿ Consideraciones de Accesibilidad (A11y)

El sitio ha sido refinado para garantizar que personas con capacidades diversas puedan navegar y disfrutar de la experiencia:

*   **HTML Semántico y Roles ARIA:** Uso correcto de elementos estructurales nativos y etiquetas complementarias (`role="dialog"`, `role="region"`, `aria-labelledby`, `aria-live="polite"` en alertas de toast y listas dinámicas de misiones).
*   **Etiquetado Alt de Imágenes:** Las imágenes evolutivas de avatares contienen atributos `alt` descriptivos actualizados en tiempo real según el nombre de usuario y clase.
*   **Interactividad con Teclado:** Los diálogos modales y el visualizador Lightbox soportan el evento de teclado `Escape` para ser cerrados de forma rápida, evitando bloqueos de foco.
*   **Contraste y Legibilidad:** Relación de contraste optimizada entre textos de tonalidades claras sobre fondos mate oscuros, complementado con tipografías legibles como *Inter* y *Fira Code*.

---

## 🤖 Resumen de Uso de Inteligencia Artificial

Durante el desarrollo de **Anti-Procrastination Quest**, los integrantes del equipo emplearon herramientas de Inteligencia Artificial (asistentes basados en LLMs) bajo un rol de **co-pilotaje técnico** y refinamiento interactivo. La documentación completa y estructurada con prompts, asistencias, correcciones y resoluciones autónomas del grupo se encuentra en el [Informe de uso de IA (informe-ia.md)](informe-ia.md).

Las principales áreas de soporte incluyeron:
1.  **Diseño del Sistema de Progresión:** Co-diseño matemático de la curva de experiencia requerida por nivel, estableciendo una progresión desafiante pero gratificante y modelando el cálculo de porcentajes.
2.  **Refinamiento de Algoritmos CSS & Responsividad:** Generación de estructuras de media queries robustas para adaptabilidad de tarjetas RPG y soporte ergonómico para el menú inferior de dispositivos móviles.
3.  **Aseguramiento del Flujo de Asincronía:** Diseño conjunto del despachador secuencial de avisos Toast para garantizar que las animaciones visuales no colisionaran visualmente.
4.  **Generador Fallback SVG:** Desarrollo de la fórmula matemática para centrar y codificar el elemento de vector SVG en línea según las iniciales del héroe.

*Nota: La arquitectura general del proyecto, la estructura modular de base, la dirección estética y las pruebas empíricas de usabilidad fueron definidas de forma autónoma por los integrantes del equipo.*

---

## 🎓 Cumplimiento de Requisitos Académicos

A continuación se detalla una tabla de verificación que demuestra el cumplimiento riguroso de cada uno de los lineamientos del proyecto integrador:

| Requisito Académico | Estado | Ubicación / Detalle Técnico |
| :--- | :---: | :--- |
| **Mínimo 3 páginas HTML** | **Cumplido** | Cuenta con exactamente 3 páginas independientes y funcionales: `index.html`, `pages/dashboard.html` y `pages/missions.html`. |
| **Diseño Responsivo con Media Queries** | **Cumplido** | Estilos adaptativos en todos los niveles implementados en `layout.css`, `login.css`, `dashboard.css` y `missions.css`. |
| **Mínimo 3 funcionalidades JS reales** | **Cumplido** | 1. Registro de usuario con validación avanzada de formularios.<br>2. Motor de progresión RPG y bonificación por clase.<br>3. Creación y renderizado dinámico de misiones con previsualización reactiva.<br>4. Filtros cruzados avanzados y lógica de estados dinámicos.<br>5. Lightbox retro interactivo y generador SVG. |
| **Uso obligatorio de almacenamiento** | **Cumplido** | Uso completo de `localStorage` centralizado en `storage.js` bajo claves `apq_user` y `apq_missions`. |
| **Estructura de carpetas organizada** | **Cumplido** | Distribución ordenada de recursos en carpetas `assets/avatares`, `assets/css/pages`, `assets/js/pages` y `scratch`. |
| **Repositorio público GitHub** | **Cumplido** | Alojado de forma pública en [Anti-Procrastination-Quest Repo](https://github.com/Calegaris/Anti-procrastination-quest). |
| **Manejo de Ramas (develop/main)** | **Cumplido** | Flujo de trabajo estructurado en ramas de características (`feature/*`) integradas en `develop`, y despliegue final en `main`. |
| **Mínimo 15 Commits Totales** | **Cumplido** | Cuenta con más de 25 commits documentados en el historial de Git. |
| **Mínimo 4 Commits por miembro** | **Cumplido** | Luis Ángel Calegari (18 commits) y Agustín D'Esposito (14 commits) superan el mínimo establecido. |
| **Uso de Conventional Commits** | **Cumplido** | Historial limpio estructurado bajo convenciones (`feat:`, `style:`, `refactor:`, `docs:`, `chore:`). |
| **Pull Request de integración** | **Cumplido** | Flujo cerrado con Pull Requests formales de `develop` hacia la rama principal `main` (Ej. PR #1, PR #2, PR #5, PR #7). |
| **README y Reporte de Uso de IA** | **Cumplido** | Presente en `README.md` y detallado a través del archivo [informe-ia.md](informe-ia.md). |
| **Despliegue funcional en vivo** | **Cumplido** | Alojado y operable a través de GitHub Pages de forma fluida. |

---