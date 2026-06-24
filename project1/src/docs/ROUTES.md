# Sound Map Routes

This project uses Next.js App Router as the infrastructure layer and keeps feature logic inside MVVM feature modules.

## Route responsibilities

- `/login` renders `features/login/view/LoginView.tsx`.
- `/signup` renders a temporary signup stub.
- `/onboarding` renders `features/onboarding/view/OnboardingView.tsx`.
- `/dashboard` renders `features/dashboard/view/DashboardView.tsx`.
- `/` redirects to `/login`.

## Layer rules

- Files in `src/app` stay thin and only connect routes to views.
- Files in `src/features/*/view` own JSX structure and styling.
- Files in `src/features/*/viewmodel` own local state, event handling, and navigation.
- Files in `src/features/*/model` stay framework-agnostic and define pure data or validation logic.
- Files in `src/shared-components` expose reusable, presentation-only UI building blocks.
