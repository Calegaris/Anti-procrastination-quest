# Informe de uso de Inteligencia Artificial

## 1. ¿Qué herramientas de IA utilizaron?

## 2. ¿Para qué las utilizaron?

## 3. ¿Qué partes del proyecto fueron asistidas por IA?

## 4. ¿Qué prompts o consultas les resultaron más útiles?

## 5. ¿Qué respuestas de la IA tuvieron que corregir?

## 6. ¿Qué problemas tuvieron al trabajar con IA?

## 7. ¿Qué aprendieron durante el proceso?

## 8. ¿Qué partes del código puede explicar cada integrante?

## 9. ¿Qué decisiones tomó el grupo sin depender de la IA?

## 10. ¿Hubo código sugerido por IA que descartaron? ¿Por qué?

# Informe de Uso de Inteligencia Artificial

## 1. ¿Qué herramientas de IA utilizaron?

Durante el proyecto utilizamos tres herramientas principales de Inteligencia Artificial, cada una con un rol específico:

### Claude (Anthropic, versión web)
Utilizado exclusivamente para generar documentación base del proyecto:
* MVP completo.
* Épicas e historias de usuario.
* Guía de arquitectura y flujo de trabajo.
* Documentos que sirvieron para crear el tablero de Trello.

### Microsoft Copilot
* **Copilot Chat (web):** Asistente técnico principal para arquitectura, commits, PRs, depuración, diseño de módulos, documentación y soporte general.

* **Copilot en Visual Studio Code:** Utilizado por Agustina para ejecutar prompts técnicos y generar código dentro del editor, generar documentación y soporte general.

### Agente de Antigravity (basado en Gemini)
* Utilizado únicamente por Luis para ejecutar prompts técnicos y generar código dentro del editor, generar documentación y soporte general.

---

## 2. ¿Para qué las utilizaron?

**Claude se utilizó para:**
* Crear el MVP completo con reglas, tablas y sistemas.
* Generar la Guía Base y Flujo de Trabajo.
* Redactar épicas e historias de usuario.
* Definir la estética, paleta y visión del proyecto.
* Producir documentos que luego se transformaron en tarjetas de Trello.

**Copilot Chat (web) se utilizó para:**
* Diseñar la arquitectura modular del proyecto.
* Resolver dudas técnicas y conceptuales.
* Generar commits atómicos y convencionales.
* Crear PRs completos con criterios de aceptación.
* Depurar errores en dashboard, misiones, toasts y progresión.
* Generar documentación final (README, prompts, informe de IA).
* Asegurar cumplimiento del PDF académico.

**Copilot en Visual Studio Code se utilizó para:**
* Ejecutar prompts técnicos.
* Generación de código dentro del editor.
* Refactorización asistida.
* Apoyo directo al flujo de trabajo de Agustina.

**Agente de Antigravity (Gemini) se utilizó para:**
* Ejecutar prompts técnicos.
* Generar estructuras de código.
* Refactorización asistida.
* Apoyo directo al flujo de trabajo de Luis.

---

## 3. ¿Qué partes del proyecto fueron asistidas por IA?

**Asistido por Claude (documentación y diseño):**
* Documento MVP.
* Documento de arquitectura visual.
* Épicas e historias de usuario.
* Estructura del tablero de Trello.
* Definición de rarezas, clases, progresión y cooldowns.

**Asistido por Copilot Chat (implementación técnica):**
* Sistema de misiones (crear, filtrar, completar, reactivar).
* Sistema de progresión (EXP, niveles, bonus).
* Renderizado del dashboard.
* Toasts globales y modales.
* Refactorización segura.
* Commits, PRs y documentación final.

**Asistido por Copilot en VSC (editor):**
* Generación de código a partir de prompts.
* Refactorización dentro del editor.

**Asistido por Gemini (Antigravity):**
* Generación de código a partir de prompts.
* Estructuras iniciales de módulos.
* Refactorización dentro del editor.

---

## 4. ¿Qué prompts o consultas les resultaron más útiles?

**Generales más útiles:**
* Prompts de arquitectura modular.
* Prompts de commits atómicos.
* Prompts de refactorización segura.
* Prompts para generar PRs completos.
* Prompts de depuración (toasts, dashboard, misiones).
* Prompts de documentación (README, informe de IA).

**Específicos por IA:**
* **Claude:** Aportó prompts útiles para épicas, tablas de rarezas/progresión y diseño conceptual.
* **Copilot:** Aportó prompts útiles para código real, depuración, arquitectura y documentación.

---

## 5. ¿Qué respuestas de la IA tuvieron que corregir?

Tuvimos que corregir:
* Código que no respetaba la arquitectura.
* Estilos que no coincidían con el diseño.
* Funciones que asumían datos inexistentes.
* Renderizados duplicados.
* Lógica de EXP que necesitó ajustes.
* Propuestas de Claude demasiado avanzadas.
* Código de Gemini que no encajaba en el flujo final.

---

## 6. ¿Qué problemas tuvieron al trabajar con IA?

Los principales desafíos fueron:
* Propuestas demasiado grandes o invasivas.
* Respuestas generales que requerían prompts más específicos.
* Documentación extensa de Claude que hubo que adaptar.
* Código de Gemini que funcionaba aislado pero no integrado.
* Copilot generando archivos innecesarios si no se guiaba bien.

---

## 7. ¿Qué aprendieron durante el proceso?

Aprendimos a:
* Escribir prompts claros.
* Combinar IA con criterio humano.
* Mantener arquitectura modular.
* Usar IA como apoyo, no como reemplazo.
* Documentar correctamente.
* Organizar el trabajo con Trello y GitHub.
* Integrar varias IA sin perder coherencia.

---

## 8. ¿Qué partes del código puede explicar cada integrante?

Cada integrante podría explicar las partes del código, quizas haga falta una revisión final del codigo para poder explicarlo en detalle pero como grupo podemos explicar:

* El funcionamiento general del sistema de misiones.
* Cómo se calcula y actualiza la experiencia (EXP) del usuario.
* El renderizado dinámico del dashboard.
* El algoritmo de rareza y asignación de XP.
* El uso de `localStorage` para persistencia.
* El funcionamiento de los toasts y modales.
* La arquitectura modular del proyecto.
* El flujo general de completar una misión y actualizar su estado.

---

## 9. ¿Qué decisiones tomó el grupo sin depender de la IA?

El grupo decidió:
* La idea del proyecto.
* La estética final.
* La estructura visual.
* La organización de carpetas.
* La distribución de tareas.
* Qué sugerencias aceptar o descartar.
* Cómo adaptar el MVP al tiempo real disponible.

---

## 10. ¿Hubo código sugerido por IA que descartaron? ¿Por qué?

Sí, descartamos:
* Código que rompía la arquitectura.
* Funciones demasiado complejas.
* Estilos incorrectos.
* Archivos innecesarios.
* Lógica que no cumplía el PDF académico.
* Propuestas de Claude fuera del alcance.
* Prototipos de Gemini que no encajaban en el flujo final.


# AI Usage Report

## 1. Which AI tools were used?

During the project, we used three main Artificial Intelligence tools, each with a specific role:

### Claude (Anthropic, web version)
Used exclusively for generating foundational project documentation:
* MVP specification.
* Epics and user stories.
* Base architecture and workflow guide.
* Documents that were later converted into Trello cards.

### Microsoft Copilot
* **Copilot Chat (web):** Main technical assistant for architecture, commits, PRs, debugging, module design, documentation, and general support.
* **Copilot in Visual Studio Code:** Used by Agustina to execute technical prompts and generate code inside the editor, generate documentation, and provide general support.

### Antigravity Agent (Gemini-based)
* Used only by Luis to execute technical prompts and generate code inside the editor, generate documentation, and provide general support.

---

## 2. What did you use them for?

**Claude was used for:**
* Writing the complete MVP document with rules, tables, and systems.
* Generating the Base Architecture and Workflow Guide.
* Drafting epics and user stories.
* Defining the aesthetic, palette, and vision of the project.
* Producing documents that were later transformed into Trello cards.

**Copilot Chat (web) was used for:**
* Designing the modular architecture of the project.
* Solving conceptual and technical questions.
* Generating atomic and conventional commits.
* Creating complete PRs with acceptance criteria.
* Debugging errors in the dashboard, missions, toasts, and progression.
* Generating final documentation (README, prompts, AI report).
* Ensuring compliance with the academic PDF requirements.

**Copilot in Visual Studio Code was used for:**
* Executing technical prompts.
* Generating code inside the editor.
* Assisted refactoring.
* Direct support for Agustina's workflow.

**Antigravity Agent (Gemini) was used for:**
* Executing technical prompts.
* Generating code structures.
* Assisted refactoring.
* Direct support for Luis's workflow.

---

## 3. Which parts of the project were assisted by AI?

**Assisted by Claude (documentation & design):**
* MVP document.
* Visual architecture document.
* Epics and user stories.
* Trello board structure.
* Definition of rarities, classes, progression, and cooldowns.

**Assisted by Copilot Chat (technical implementation):**
* Mission system (create, filter, complete, reactivate).
* Progression system (EXP, levels, bonuses).
* Dashboard rendering.
* Global toasts and modals.
* Safe refactoring.
* Commits, PRs, and final documentation.

**Assisted by Copilot in VSC (editor):**
* Code generation from prompts.
* Refactoring inside the editor.

**Assisted by Gemini (Antigravity):**
* Code generation from prompts.
* Initial module structures.
* Refactoring inside the editor.

---

## 4. Which prompts or queries were the most useful?

**Most useful general prompts:**
* Modular architecture prompts.
* Atomic commit prompts.
* Safe refactoring prompts.
* Prompts to generate complete PRs.
* Debugging prompts (toasts, dashboard, missions).
* Documentation prompts (README, AI report).

**Specific by AI:**
* **Claude:** Provided useful prompts for epics, rarity/progression tables, and conceptual design.
* **Copilot:** Provided useful prompts for real code, debugging, architecture, and documentation.

---

## 5. Which AI responses did you have to correct?

We had to correct:
* Code that did not respect the architecture.
* Styles that did not match the design.
* Functions that assumed non-existent data.
* Duplicate renderings.
* EXP logic that needed adjustments.
* Claude suggestions that were too advanced/out of scope.
* Gemini code that did not fit into the final flow.

---

## 6. What problems did you encounter when working with AI?

The main challenges were:
* Proposals that were too large or invasive.
* General responses that required more specific prompts.
* Extensive documentation from Claude that had to be adapted.
* Gemini code that worked in isolation but was not integrated.
* Copilot generating unnecessary files if not properly guided.

---

## 7. What did you learn during the process?

We learned to:
* Write clear prompts.
* Combine AI with human judgment.
* Maintain a modular architecture.
* Use AI as support, not as a replacement.
* Document correctly.
* Organize teamwork with Trello and GitHub.
* Integrate multiple AIs without losing coherence.

---

## 8. Which parts of the code can each team member explain?

Each member could explain parts of the code; perhaps a final code review is needed to explain it in detail, but as a group we can explain:

* The general functioning of the mission system.
* How user experience (EXP) is calculated and updated.
* The dynamic rendering of the dashboard.
* The rarity algorithm and XP allocation.
* The use of `localStorage` for persistence.
* The functioning of the toasts and modals.
* The modular architecture of the project.
* The general flow of completing a mission and updating its state.

---

## 9. Which decisions were made without AI?

The group decided:
* The project idea.
* The final aesthetic.
* The visual structure.
* The folder organization.
* The task distribution.
* Which suggestions to accept or discard.
* How to adapt the MVP to the actual available time.

---

## 10. Was any AI-generated code discarded? Why?

Yes, we discarded:
* Code that broke the architecture.
* Overly complex functions.
* Incorrect styles.
* Unnecessary files.
* Logic that did not comply with the academic PDF.
* Claude proposals outside the scope.
* Gemini prototypes that did not fit into the final flow.