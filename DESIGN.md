---
name: Tirita
description: Free directory of verified private teachers in La Plata, laid out as white flyers on lined school paper with tear-off contact strips.
colors:
  pen: "#1f3a93"
  pen-dark: "#172c70"
  line-ing: "#ffb3d4"
  line-exa: "#a9dbff"
  line-inf: "#bdeca4"
  line-eco: "#ffd09a"
  line-sec: "#fff27a"
  line-otra: "#ddd0ff"
  highlight: "#fff27a"
  ground: "#f6f7f4"
  rule: "#d5dfe8"
  paper: "#ffffff"
  ink: "#1b1e24"
  g1: "#f1f3f5"
  g2: "#d6dbe0"
  g3: "#8b93a0"
  g4: "#4a5160"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2rem, 9vw, 2.9rem)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 6.8vw, 2.4rem)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  price-lg:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  flyer-name:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  subject-line:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.625
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "\"tnum\" 1"
  body-strong:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.5
  link:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.5
  meta:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  hand:
    fontFamily: "Kalam, cursive"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.2
rounded:
  sheet: "0px"
  stroke: "2px"
  control: "4px"
  search-card: "6px"
spacing:
  rule: "28px"
  tear-gap: "3px"
  stack: "10px"
  sheet-pad-sm: "12px"
  sheet-pad: "16px"
  board-gap: "20px"
  section: "24px"
components:
  button-primary:
    backgroundColor: "{colors.pen}"
    textColor: "{colors.paper}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.control}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "{colors.pen-dark}"
    textColor: "{colors.paper}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.control}"
    padding: "10px 16px"
  button-secondary-hover:
    backgroundColor: "{colors.g1}"
  field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "10px 12px"
  paper-sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
    padding: "{spacing.sheet-pad}"
  search-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.search-card}"
    padding: "{spacing.sheet-pad-sm}"
  flyer:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
    padding: "{spacing.sheet-pad}"
  flyer-hover:
    backgroundColor: "{colors.g1}"
  tear-tab-contact:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.pen}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.sheet}"
    height: "64px"
  tear-tab-name:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.g4}"
    typography: "{typography.hand}"
    rounded: "{rounded.sheet}"
    width: "44px"
    height: "64px"
  faculty-highlight:
    textColor: "{colors.ink}"
    rounded: "{rounded.stroke}"
    padding: "0 0.15em"
  board-heading:
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
  header:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "14px 16px"
---

# Design System: Tirita

## Overview

**Creative North Star: "Hoja rayada"**

Every teacher is their own "Doy clases particulares" flyer, cut square from plain white paper and laid on a sheet of lined school paper, and contacting them is tearing a strip off the bottom. The lined ground owns the page: the 18px grid of a notebook every La Plata student carries. On it, flyers, forms and panels are white sheets with square corners and a soft, neutral shadow.

The voice is firm and plain. Archivo 800 with tight tracking sets headings, names and prices like a confident hand-lettered notice translated into type; Archivo 400 to 600 does everything else. Ballpoint blue is the one colour that acts. Faculties are marked the way students mark notes: a soft highlighter stroke behind the subject, ink on top. Handwriting appears in exactly one place, where a hand would actually write: the teacher's first name on the spare tear-off strips.

Every flyer carries the same furniture in the same order (optional photo, name and price, modality and zone, rating, "Doy clases de" line), then the row of tear-off strips hanging below. The only motion is the first strip tilting as if being torn when you point at or press the strip row.

**Key Characteristics:**
- Lined notebook ground (28px ruled lines) under square-cornered white paper sheets with a soft neutral shadow.
- Archivo throughout: 800 tight for headings, names and prices; 400 to 600 for reading.
- Ballpoint blue is the single action colour.
- Faculty identity is a soft highlighter stroke behind ink text.
- Tear-off strips with a dashed perforation are the contact affordance; Kalam appears only on their names.
- Light only; tabular numerals everywhere.

## Colors

A school-notebook palette: off-white lined paper, white sheets, near-black ink with a cool grey ramp, one ballpoint blue, and six soft highlighters.

### Primary
- **Ballpoint Blue** (pen): primary buttons, every text link, the WhatsApp strip label, the field focus border and the global focus ring.
- **Pressed Ballpoint** (pen-dark): primary button hover only.

### Secondary (faculty highlighters)
- **Ingeniería Pink** (line-ing), **Exactas Sky** (line-exa), **Informática Lime** (line-inf), **Económicas Apricot** (line-eco), **Secundaria Yellow** (line-sec), **Other-Faculty Lilac** (line-otra, fallback for faculties without an assigned colour): highlighter strokes behind subject names, faculty codes and the board heading's subject, always with ink on top (at least 10:1).
- **Highlighter Yellow** (highlight): the "Profes" stroke in the brand, text selection and success notes.

### Neutral
- **Notebook Ground** (ground): the page under the ruled lines.
- **Rule Line** (rule): the 1px horizontal ruled lines on the ground. Material only, never a border or text colour.
- **Paper** (paper): every sheet: header, footer, search card, flyers, tear strips, forms, panels.
- **Ink** (ink): headings and body text.
- **g1 Smudge**: flyer hover, secondary button hover, checked option rows, form error fill.
- **g2 Rule**: the header's bottom rule, dividers, option-row and inline-form borders.
- **g3 Pencil**: field borders (3.1:1 on paper), tear perforation dashes, the empty-board dashed outline, success-note borders, admin link underlines. Not a text colour.
- **g4 Graphite**: secondary text on either ground or paper (sublines, counts, meta, hints, strip names), at least 6.3:1 even over a ruled line.

### Named Rules
**The Lined Paper Rule. The page ground is always the lined notebook sheet: ground colour with 1px horizontal ruled lines every 28px, no vertical lines and no red margin. Lined (rayada) paper is the sheet for every subject, so the ground never suggests maths or physics only.

**The Highlighter Rule.** A faculty colour only ever appears as a highlighter stroke behind that faculty's subject name or code, with ink on top. It is never a fill for buttons, panels or borders, and never a text colour.

**The One Pen Rule.** Ballpoint blue is the only action colour. If something is clickable and is not a flyer, it is blue; if it is blue, it is clickable or focused.

## Typography

**Display Font:** Archivo 800 (system-ui fallback)
**Body Font:** Archivo 400 / 500 / 600
**Hand Font:** Kalam 400, tear-strip names only

**Character:** One sturdy grotesque in two registers: 800 with -0.02em tracking reads like a bold notice; the lighter weights read like a clean printed sheet. The single handwritten touch is the name a teacher would scribble on each strip.

### Hierarchy
- **Display** (800, clamp(2rem, 9vw, 2.9rem), line-height 1.08, -0.02em): page headings on the ruled sheet ("Encontrá profe para tu materia", "Publicá tu perfil gratis").
- **Headline** (800, clamp(1.6rem, 6.8vw, 2.4rem), balanced wrap): the board heading "Clases de <subject>"; the profile flyer's name uses the same voice at clamp(1.9rem, 8vw, 2.6rem).
- **Price, large** (800, 1.875rem): the rate on the profile flyer.
- **Title** (800, 1.5rem): section headings inside sheets ("Reseñas", "Materias por facultad", form legends, admin sections).
- **Flyer name / price** (800, 19px): name and rate on flyer cards, sharing one baseline.
- **Subject line** (500, 16px on flyers, 18px on the profile, line-height 1.625): "Doy clases de ...".
- **Body** (400, 16px, line-height 1.5; bios at 1.625 and max 65ch).
- **Body strong** (600, 16px): buttons, the WhatsApp strip label, field labels.
- **Link** (500, 15px): subject index links; "Soy profe" in the header at 600.
- **Meta** (400, 14px, g4): modality, zone, ratings, hints.
- **Hand** (Kalam 400, 15px, vertical writing, g4): the first name on spare tear strips.

### Named Rules
**The One Hand Rule.** Kalam is used only for the names on tear strips. Headings, names on flyers, prices, subject lines, labels and body are always Archivo.

**The Tabular Rule.** Numerals are tabular site-wide so prices and counts line up.

## Layout

A single centred column, max 768px, with a 16px side gutter. The header is a full-width white strip with a g2 bottom rule; its content aligns to the column. The footer is a paper sheet inside the column. Main content stacks at 24px.

Mobile first. The search is a white card with 12px padding: subject select full width, level and modality side by side, then a full-width blue button; from 640px it becomes one row (1.6fr / 1fr / 1.2fr / auto). Flyers are one column on phones and a two-column board from 768px, 20px apart, each stretched to equal height so their strips line up. A flyer with a photo puts a fixed 56px photo column beside the content; without a photo the name runs the full width (there is no initials placeholder). Sheets pad 16px, growing to 24px from 640px on the profile, sign-up and admin. Admin tables scroll horizontally inside their sheet.

**The Fixed Furniture Rule.** Every flyer shows the same fields in the same order, with the price on the name's baseline at the right, at most three subjects plus "y N más", and missing data written out ("A consultar", "Sin reseñas todavía") rather than collapsed.

## Elevation & Depth

Paper on paper. White sheets rest on the lined ground with a soft, neutral, ink-tinted two-layer shadow; tear strips cast a smaller one beneath. Inside a sheet, structure is flat: forms within sheets use a g2 border, not another shadow. Hover never lifts: flyers fill g1, and the first tear strip tilts.

### Shadow Vocabulary
- **Sheet** (`box-shadow: 0 1px 2px rgb(27 30 36 / 0.12), 0 6px 14px -6px rgb(27 30 36 / 0.2)`): every white sheet on the ruled sheet.
- **Tear strip** (`box-shadow: 0 3px 6px -3px rgb(27 30 36 / 0.25)`): strips hanging below a flyer.

### Named Rules
**The Paper-On-Lines Rule.** Shadows exist only because a sheet rests on the notebook. Never use a shadow for emphasis, hover lift or glow, and never inside a sheet.

## Shapes

Cut paper. Sheets, flyers, tear strips and photos have square corners (0). Controls (fields, buttons, option rows, notes, the focus ring) have 4px corners; highlighter strokes 2px. The search card alone keeps a 6px corner. Tear strips are separate paper tongues, 3px of grid showing between them, with a 2px dashed g3 perforation along the top. Photos are square at one fixed size per context (56px on flyers, 88px on the profile). An empty board shows a 2px dashed g3 outline where flyers would be.

## Components

### Buttons
- **Shape:** control corners (4px), 10px 16px padding, Archivo 600 16px, 8px icon gap.
- **Primary:** ballpoint-blue fill, white text. Full width on phones when it is the page's main action.
- **Hover / Focus:** fill deepens to pen-dark; focus shows the 3px blue ring at 2px offset. Colour transition only.
- **Secondary:** paper fill, 1.5px ink border, ink text; hover fills g1.
- **Disabled:** 50% opacity, not-allowed cursor.

### Faculty Highlight (chips)
There are no pill chips. Subjects sit inside a sentence ("Doy clases de Matemática A, Física I y Química") in Archivo 500, each name swept with its faculty's highlighter: 2px corners, 0.15em side padding, broken cleanly across lines, with the faculty name for screen readers. Faculty codes (ING, EXA, INF, ECO, SEC) use the same stroke in Archivo 800 in the subject index and sign-up form.

### Cards / Containers
- **Corner Style:** square (0); the search card 6px.
- **Background:** paper on the lined ground.
- **Shadow Strategy:** the Sheet shadow (see Elevation & Depth).
- **Border:** none on sheets; nested forms use a 1px g2 border.
- **Internal Padding:** 16px (24px from 640px on profile, sign-up, admin); 12px on the search card.

### Inputs / Fields
- **Style:** paper fill, 1.5px g3 border, 4px corners, 10px 12px padding, 16px Archivo, g4 placeholders.
- **Select:** native select with its own 2.5px-stroke ink chevron at right 12px.
- **Option rows:** checkboxes inside white rows with a 1px g2 border; checked turns the border ink and the fill g1.
- **Focus:** border turns ballpoint blue, plus the global blue ring.
- **Error:** ink text, Archivo 600, on g1 with a 1.5px ink border and an alert triangle. Never a faculty colour.
- **Success:** a highlighter-yellow note with a 1.5px g3 border.

### Navigation
- **Header:** full-width white strip, 1px g2 bottom rule. Brand in Archivo 800 at 1.25rem with "Profes" swept in highlighter yellow; "Soy profe" at right in Archivo 600 15px blue, underlined on hover.
- **Footer:** a paper sheet with the brand in Archivo 800 and one line of g4 copy.
- **Text links:** ballpoint blue, underlined at 40% blue that turns solid on hover.

### Flyer (signature)
The teacher card: a square-cornered paper sheet with the optional photo, the name in 800 with the rate on its baseline, modality and zone, rating, then the "Doy clases de" line. The whole sheet links to the profile and fills g1 on hover. Directly beneath hangs the tear strip.

### Tear Strip (signature)
The contact affordance: one link made of separate paper strips, 64px tall, 3px apart. The first strip is wide and carries the WhatsApp icon and label in blue Archivo 600. The spare strips (two on phones, three from 640px, 44px wide) carry the teacher's first name in Kalam 400 15px, written vertically in g4. On hover, press or focus the first strip tilts (rotate -3deg, down 4px, pivot top centre, 220ms `cubic-bezier(0.16, 1, 0.3, 1)`), only when reduced motion is not requested. It hangs from every flyer and, labelled "Escribir por WhatsApp", from the profile.

### Board Heading (signature)
The heading above the flyers, set on the ruled sheet: "Clases de <subject>" in headline type with the subject swept in its faculty's highlighter, then faculty and count ("Ingeniería · 4 avisos") in g4 Archivo 500. Without a subject it reads "Todos los avisos". It is an `aria-live` region.

## Do's and Don'ts

### Do:
- **Do** keep the 28px ruled lines on the page ground, and put every readable or interactive surface on a plain white sheet over it.
- **Do** set headings, flyer names and prices in Archivo 800 at -0.02em; everything else in Archivo 400 to 600.
- **Do** mark faculties only with a soft highlighter stroke behind ink text.
- **Do** use ballpoint blue for every action and link, and nothing else.
- **Do** end every flyer with the tear strip, and keep flyer fields in the fixed order.
- **Do** keep sheets, flyers, strips and photos square-cornered; round only controls (4px) and strokes (2px).
- **Do** limit motion to the tear-strip tilt and colour transitions, and honour reduced motion.

### Don't:
- **Don't** use handwriting anywhere except the names on tear strips.
- **Don't** replace the lined ground with a texture, a tint, a photo or a plain fill, and don't draw ruled lines inside sheets.
- **Don't** use cream or tinted paper; sheets are white.
- **Don't** fill buttons, panels or borders with a faculty highlighter, or set text in one.
- **Don't** add an initials placeholder when a teacher has no photo; let the name take the width.
- **Don't** rotate or scatter flyers; they lie straight on the ruled sheet.
