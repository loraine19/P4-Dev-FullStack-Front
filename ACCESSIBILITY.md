# Accessibilité (A11y) — DataShare Front

## Référentiel cible

RGAA 4.1 / WCAG 2.1 niveau AA.

---

## Composants audités

### ContextMenu (`src/views/components/shared/ContextMenu.tsx`)

| Critère                  | Implémentation                                            |
| ------------------------ | --------------------------------------------------------- |
| Déclencheur sémantique   | `<button type="button">`                                  |
| État ouvert/fermé        | `aria-expanded={isOpen}`                                  |
| Rôle du déclencheur      | `aria-haspopup="menu"`                                    |
| Label déclencheur        | `aria-label="Options"`                                    |
| Rôle du panel            | `role="menu"`                                             |
| Rôle des items           | `role="menuitem"`                                         |
| Fermeture clavier        | `Escape` ferme le menu                                    |
| Navigation clavier       | `ArrowDown` / `ArrowUp` entre les items (wrap circulaire) |
| Focus à l'ouverture      | Premier `menuitem` reçoit le focus                        |
| Retour focus             | Focus revient au déclencheur à la fermeture               |
| Fermeture clic extérieur | `mousedown` sur `document`                                |

### Switch (`src/views/components/shared/Switch.tsx`)

| Critère           | Implémentation                         |
| ----------------- | -------------------------------------- |
| Rôle du conteneur | `role="tablist"`                       |
| Rôle des boutons  | `role="tab"`                           |
| État sélectionné  | `aria-selected={activeTab === tab.id}` |

### Navbar (`src/views/components/shared/Navbar.tsx`)

| Critère             | Implémentation               |
| ------------------- | ---------------------------- |
| Landmark navigation | Lien CTA wrappé dans `<nav>` |

### Icons (`src/views/components/shared/Icons.tsx`)

| Critère        | Implémentation                                                                       |
| -------------- | ------------------------------------------------------------------------------------ |
| SVG décoratifs | `aria-hidden="true"` dans les props `base` (s'applique à tous les icônes par défaut) |

### FileCard (`src/views/components/myspace/FileCard.tsx`)

| Critère           | Implémentation                                                                |
| ----------------- | ----------------------------------------------------------------------------- |
| Icône Description | `aria-hidden="true"` explicite (décoratif, le nom du fichier est dans `<h3>`) |
| Icône Lock        | `aria-label="Fichier protégé"` sur le `<span>` parent                         |
| Liste de tags     | `aria-label="Tags"` sur `<ul>`                                                |

---

## Points ouverts / hors périmètre actuel

| #   | Composant              | Critère manquant                                          | Priorité |
| --- | ---------------------- | --------------------------------------------------------- | -------- |
| 1   | `ContextMenu`          | `aria-controls` sur le déclencheur pointant l'id du panel | Faible   |
| 2   | Formulaires upload     | `aria-describedby` sur les champs d'erreur Formik         | Moyenne  |
| 3   | Toasts / notifications | `role="alert"` ou `aria-live="polite"`                    | Moyenne  |
| 4   | Page `DownloadPage`    | Vérifier ordre de focus et focus initial                  | Faible   |

---

## Tests

Les comportements clavier de `ContextMenu` sont couverts par les tests Vitest :

```
ContextMenu.spec.tsx
  ✓ 24.5 Escape ferme le menu et retourne le focus au déclencheur
  ✓ 24.6 Le premier menuitem reçoit le focus à l'ouverture
  ✓ 24.7 ArrowDown déplace le focus sur l'item suivant
  ✓ 24.8 ArrowUp depuis le premier item boucle sur le dernier
```

---

## Outils de vérification

- **axe DevTools** (extension navigateur) — audit automatique WCAG
- **Lighthouse** → onglet Accessibilité
- **Navigateur clavier seul** (Tab, Shift+Tab, Entrée, Espace, Échap, flèches)
- **Lecteur d'écran** : NVDA (Windows) / VoiceOver (macOS/iOS)
