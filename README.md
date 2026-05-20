# CacApp

CacApp est une application Next.js en francais pour suivre ses passages aux toilettes: historique personnel, geolocalisation, carte globale, profils, streaks et trophees.

## Stack

- Next.js 16 avec App Router
- React 19
- TypeScript en mode strict
- Tailwind CSS v4
- Supabase Auth + database
- Leaflet / React Leaflet pour la carte

## Fonctionnalites

- Inscription et connexion par email/mot de passe via Supabase.
- Ajout, modification et suppression d'entrees.
- Types de selles, tailles, commentaires et tags de lieux.
- Geolocalisation navigateur avec reverse geocoding OpenStreetMap/Nominatim.
- Carte des entrees geolocalisees avec marqueurs par utilisateur.
- Profil utilisateur avec pseudo, emoji d'avatar et couleur d'accent.
- Streaks et trophees debloques automatiquement.
- Vue globale des trophees et des utilisateurs qui les ont debloques.

## Prerequis

- Node.js compatible avec Next.js 16.
- npm, utilise par defaut dans ce repo via `package-lock.json`.
- Un projet Supabase.

## Installation

```bash
npm install
```

Creer ensuite un fichier `.env.local` avec les variables Supabase publiques:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Ne jamais mettre de service-role key dans le frontend.

## Base de donnees

Le schema principal se trouve dans `supabase/schema.sql`.

Il cree les tables:

- `poop_logs`
- `location_tags`
- `user_profiles`
- `user_trophies`

Il active aussi la Row Level Security. Les logs, profils et trophees ont des lectures publiques pour les vues sociales/globales, tandis que les ecritures restent limitees a l'utilisateur proprietaire.

Pour initialiser Supabase, executer le contenu de `supabase/schema.sql` dans le SQL Editor du dashboard Supabase.

## Developpement

Lancer le serveur local:

```bash
npm run dev
```

Ouvrir ensuite [http://localhost:3000](http://localhost:3000).

Commandes utiles:

```bash
npm run lint
npm run build
npm run start
```

## Structure

- `app/page.tsx`: redirection initiale vers `/dashboard` ou `/login`.
- `app/(auth)/login/page.tsx`: connexion.
- `app/(auth)/signup/page.tsx`: inscription.
- `app/dashboard/DashboardClient.tsx`: dashboard principal, chargement des donnees, streaks et trophees.
- `app/dashboard/AddPoopForm.tsx`: formulaire d'ajout/modification et geolocalisation.
- `app/dashboard/MapView.tsx`: carte Leaflet chargee uniquement cote client.
- `app/dashboard/ProfileSettings.tsx`: edition du profil.
- `app/trophies/page.tsx`: page des trophees.
- `lib/types.ts`: types et constantes metier.
- `lib/supabase/client.ts`: client Supabase navigateur.
- `lib/supabase/server.ts`: helper Supabase serveur.
- `lib/supabase/middleware.ts`: rafraichissement de session et redirections auth.
- `middleware.ts`: branche le middleware Supabase.

## Notes de contribution

- Garder les textes visibles en francais.
- Utiliser le client Supabase navigateur dans les composants client.
- Garder Leaflet hors SSR avec des imports dynamiques.
- Mettre a jour `lib/types.ts`, les requetes Supabase et `supabase/schema.sql` ensemble quand le modele de donnees change.
- Lancer `npm run lint` avant de livrer une modification de code.

Les consignes detaillees pour les agents de code sont dans `AGENTS.md`.
