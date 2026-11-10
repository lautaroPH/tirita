---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: ["src/app/profesor/[id]/page.tsx","src/app/sumate/page.tsx","src/app/admin/page.tsx"]
---

Scope: the whole public app (search, teacher profile, sign-up) plus admin. Mode: Operate. Build path: code-led (no image generation).

Audience/job: La Plata secondary and UNLP students on their phone, days before a parcial, find a teacher for an exact subject and message them on WhatsApp. Constraints: Spanish (voseo), mobile-first, free contact, no invented teachers or reviews.

Chosen direction: Aviso con tiritas, rendered as "Hoja rayada". History: the roll's assigned "Cartel de recorrido" was built and the user rejected it ("I want the style like was like paper"). The first paper build had a cork ground and Kalam handwriting everywhere; the user called it ugly, naming the handwritten font and the cork background. From three paper variants (A squared notebook, B photocopy-shop board, C photocopied flyer) the user picked A, then asked to drop the squared grid because it reads as maths and physics only, so the ground became lined (rayada) notebook paper, the sheet used for every subject. Memorable moment: the WhatsApp action is the row of tear-off strips hanging below each flyer.

## Direction contract

THESIS: Every teacher is their own "Doy clases particulares" flyer on a sheet of lined school paper, and contacting them is tearing a strip off. Refuses the soft marketplace hero with avatar cards, the cream-plus-serif paper cliché, and costume handwriting.

OWN-WORLD: The ground is lined notebook paper (#f6f7f4 with 28px #d5dfe8 horizontal ruled lines) and owns the page. Flyers and forms are plain white paper with a soft neutral shadow. Archivo 800 with tight tracking for headings, names and prices; Archivo 400-600 for body. Ballpoint blue (#1f3a93) is the only action colour. Soft highlighter marks (pink, sky, lime, apricot, yellow) carry each faculty, with ink always on top. Handwriting (Kalam 400) appears only where a hand would write: the names on the tear-off strips.

STORY: The student sees flyers for their subject. Each flyer shows name, price, mode and zone, reviews and highlighted subjects, always in that order. They open one and tear off the WhatsApp strip to write for free.

FIRST VIEWPORT: A white header strip, with the brand in Archivo 800, "Profes" highlighted yellow, and "Soy profe" in pen blue. On the lined ground: a bold heading, a grey subline, then the search on a white card (subject full width, level and mode side by side, blue "Buscar profe" button). Then the board heading "Clases de <subject>" with the subject highlighted, the count, and the flyers, each with a separate row of tear-off strips hanging below.

FORM: candidate 1 of 7 (tear-off "clases particulares" flyer on a faculty board), rendered on lined notebook paper per the user's variant pick A. seed:7fb36a63ac90d470. Kept raises: subject index by faculty; fixed card furniture; one photo size; faculty colours as identity only; a fixed grey ramp.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
