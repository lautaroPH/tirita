# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: secundaria and UNLP university students in La Plata, on their phone, usually in the days before a parcial or final, often arriving from a WhatsApp/Telegram course group, an Instagram post or a QR poster near a faculty. Their job: find someone who teaches their exact subject, see price and modality, and message them now.

Secondary: private teachers (advanced students, teaching assistants, secondary-school teachers) who publish a profile to get students from their area, and the single admin who approves profiles and reads the numbers.

## Product Purpose

A free directory of active, hand-verified private teachers in La Plata, searchable by exact subject (e.g. "Matemática A – Ingeniería"), level and modality, with contact straight to the teacher's WhatsApp. Success = contacts per week (students tapping "Escribir por WhatsApp"); week-8 target 20+.

## Positioning

Free for real: no student pass, no subscription, no wall in front of contact details (unlike Superprof's paid pass or TusClases' paid extras). Local to La Plata, with UNLP subjects named as the faculties name them, and only profiles that were checked by hand and still answer.

## Operating Context

- Mobile-first; most visits come from links shared in student group chats and Instagram.
- Demand peaks in the weeks before exam dates.
- Contact happens outside the product, on WhatsApp; there are no student accounts, payments, chat or agenda.
- Teachers sign up through a form; the admin approves, hides or rejects by hand at /admin.

## Capabilities and Constraints

- Next.js 16 (App Router) + Tailwind 4, Neon Postgres via `pg`, Neon Auth (Google) for students, teachers and admin, photos stored in Postgres, hosted on Vercel.
- Pages: search (home), teacher profile, teacher sign-up (/sumate) and self-service profile (/mi-perfil), login (/entrar), privacy (/privacidad), removal requests (/baja), admin (approvals, subject requests, reviews, removals, metrics).
- UI language: Spanish (Argentina, voseo).
- Scope is teachers only, permanently. Trades (plomeros, gasistas, etc.) were researched and ruled out.

## Brand Commitments

Name: "Tirita" (chosen Nov 2026; the tear-off strip of a "clases particulares" flyer). Draft icon in src/app/icon.svg. Domain and social accounts not registered yet. User direction for the look: it should feel Argentine and from La Plata, ordinary and human, not like a generic AI-generated template.

## Evidence on Hand

- Market facts in the project plan: UNLP had 123.134 regular undergraduate students in 2024; competitor complaints about paid passes and unresponsive profiles.
- No real teachers, reviews, testimonials or photos yet. Never fabricate any; demo teachers are labeled "Demo" and are for local testing only.

## Product Principles

1. Finding each other is free forever, for students and teachers.
2. Never charge for something that used to be free; trust is the edge over competitors.
3. Only active, verified teachers; a profile that doesn't answer gets hidden.
4. Make it work first, charge later; no monetization before real use.
