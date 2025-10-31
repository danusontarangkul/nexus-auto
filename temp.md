car-maintenance/
├── App.tsx
├── index.ts
├── app.json
├── babel.config.js
├── eslint.config.mjs
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── global.d.ts
│
├── assets/
│   ├── icon.png
│   ├── adaptive-icon.png
│   ├── splash-icon.png
│   └── favicon.png
│
├── src/
│   ├── navigation/
│   │   └── RootNavigator.tsx
│   │
│   ├── styles/
│   │   ├── theme.ts          # Color palette and design tokens
│   │   ├── tw.ts             # twrnc theme instance (Tailwind setup)
│   │   └── ui.ts             # Reusable UI shorthand styles
│   │
│   ├── features/
│   │   ├── cars/
│   │   │   ├── screens/
│   │   │   │   ├── CarOverviewScreen.tsx
│   │   │   │   └── CarMaintenanceScreen.tsx
│   │   │   ├── components/
│   │   │   │   ├── CarCard.tsx
│   │   │   │   └── MaintenanceItem.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useCars.ts
│   │   │   │   └── useCarMaintenance.ts
│   │   │   └── context/
│   │   │       └── CarsContext.tsx
│   │   │
│   │   └── users/
│   │       ├── screens/
│   │       │   ├── UsersListScreen.tsx
│   │       │   └── UserDetailScreen.tsx
│   │       ├── components/
│   │       │   ├── UserCard.tsx
│   │       │   └── Avatar.tsx
│   │       ├── hooks/
│   │       │   ├── useUsers.ts
│   │       │   └── useUser.ts
│   │       └── context/
│   │           └── UsersContext.tsx
│   │
│   ├── shared/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   │
│   └── types/
│       ├── domain.ts
│       └── api.ts
│
└── README.md