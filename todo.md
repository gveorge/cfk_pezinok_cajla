# Project TODO

## Database Schema
- [x] Create players table with basic information fields
- [x] Create trainings table with date and category
- [x] Create attendance table linking players and trainings
- [x] Create news table for announcements
- [x] Create gallery table for photos

## Backend (tRPC Procedures)
- [x] Player management procedures (create, list, update, delete)
- [x] Training session procedures (create, list, update, delete)
- [x] Attendance tracking procedures (mark attendance, get attendance)
- [x] Attendance statistics procedures (overall and monthly)
- [x] News management procedures (create, list, update, delete)
- [x] Gallery management procedures (upload, list, delete)

## Frontend - Public Pages
- [x] Design and implement homepage with team category tiles
- [x] Create news/announcements section on homepage
- [x] Create contact page with club information
- [x] Create photo gallery page
- [x] Implement responsive navigation with login button

## Frontend - Trainer Application
- [x] Create player management page (list, add, edit players)
- [x] Create training session management page
- [x] Implement attendance tracking interface with checkboxes
- [x] Create overall attendance overview page
- [x] Create monthly attendance reports page
- [x] Add role-based access control for trainer features

## Design & Styling
- [x] Configure black and green color scheme in Tailwind
- [x] Design modern, clean layout
- [x] Ensure responsive design for mobile devices
- [x] Add club logo to navigation

## Testing
- [x] Write vitest tests for player management
- [x] Write vitest tests for training and attendance
- [x] Test authentication flow
- [x] Test all CRUD operations

## User Requested Changes
- [x] Replace logo with correct club logo (cflogo.webp)
- [x] Fix all instances of "Čajla" to "Cajla" throughout the website
- [x] Simplify player form - only name, date of birth, category, and position
- [x] Make attendance overview more compact for 18+ players
- [x] Make homepage more colorful and visually interesting

## New User Requests
- [x] Change "Pozrite galériu" button text to just "Galéria"
- [x] Replace training times with social media links in contact page
- [x] Remove 3 large tiles (address, phone, email) from homepage
- [x] Make category tiles interactive - clicking opens detail page
- [x] Create category detail pages with training times (placeholder)
- [x] Add trainers section to category pages with photos and descriptions (placeholder)

## Bug Fixes and New Requests
- [x] Fix non-working contact link in menu
- [x] Fix text overlap on homepage - "Vitajte" text overlapping with content below
- [x] Split categories - each should have its own tile (not grouped as prípravky/žiaci)
- [x] Add BFZ link for each category on detail pages

## New Layout and Features
- [x] Rearrange categories into pyramid layout on homepage (A mužstvo top, U15/U13 below, U11/U10 below, U8/U9 bottom)
- [x] Add year filtering to gallery page

## New Feature Requests
- [x] Add Google Maps to contact page (Cajlanská 243/A, 902 01 Pezinok)
- [x] Change year filtering in gallery to dropdown/select instead of buttons
- [x] Create membership fee tracking section in trainer dashboard
- [x] Add database table for membership fee payments
- [x] Implement monthly payment checkboxes for each player
- [x] Create overview of payment status per player

## New User Requests - Homepage Redesign
- [x] Fix map marker location to actual CFK Pezinok - Cajla coordinates
- [x] Restrict login to trainers only (all logged users are considered trainers)
- [x] Redesign homepage - categories displayed horizontally like Chelsea website
- [x] Default to A mužstvo category on homepage
- [x] Categories switch on same page without navigation (tabs/accordion style)
- [x] Add player cards with photos for A mužstvo category
- [x] Keep only trainers for other categories (no player cards)

## UI/UX Improvements
- [x] Make training times larger and more visible
- [x] Fix dark green color scheme - make it lighter and more readable
- [x] Improve overall color contrast and readability

## New Design and Feature Requests
- [x] Change all buttons and training times to use gradient colors matching hero section (light green to dark green)
- [x] Add "2 % z dane" link to navigation menu
- [x] Create new page for 2% tax form download

## Design Adjustments
- [x] Change "Kontaktujte nás" and "Galéria" buttons to white background for better contrast

## Mobile Responsiveness
- [x] Add hamburger menu for mobile devices to show navigation links

## Bug Fixes - Branding
- [x] Fix "Čajla" to "Cajla" in meta tags and link previews
- [ ] Fix "Čajla" to "Cajla" in login/OAuth screens (requires manual update of VITE_APP_TITLE in Settings → General)
