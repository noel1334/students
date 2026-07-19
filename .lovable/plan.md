## Student Profile — Full Overhaul

Goal: bring the student profile to production quality — matches backend exactly, validates every input, safer image/password flows, faster loads with react-query, and clean a11y/mobile UX.

### 1. Data layer (react-query + service tightening)

- Add `src/hooks/useStudentProfile.ts` using `@tanstack/react-query`:
  - `useStudentProfile()` — `queryKey: ['student','me']`, `queryFn: getStudentProfile`, staleTime 5m.
  - `useUpdateStudentProfile()` — `useMutation` calling `updateStudentProfile`, with optimistic cache patch and `invalidateQueries(['student','me'])` on success.
- `studentServicesApi.ts`:
  - Split payload types: `StudentDetailsUpdate`, `MedicalFitnessUpdate`, `BioDataUpdate`, `ContactInfoUpdate`, `NextOfKinUpdate`, `GuardianInfoUpdate`, `PasswordUpdate`, `ProfileImageUpdate`.
  - Add `uploadProfileImage(base64)` and `changePassword({ currentPassword, password })` as thin wrappers so callers don't compose payloads by hand.
  - Cache student id from `getStudentProfile` response instead of `localStorage.currentUser` (single source of truth).

### 2. Validation (zod + react-hook-form)

- New `src/lib/validation/studentProfile.ts` with a zod schema mirroring backend rules:
  - `phone` — E.164-ish regex, optional.
  - `email` — nested nokEmail/guardianEmail must be valid or empty.
  - `dateOfBirth` — must be past, min age 10.
  - `gender` — enum `MALE|FEMALE`.
  - `maritalStatus`, `religion`, `bloodGroup`, `genotype` — enum selects.
  - Text length caps (name 60, address 200, etc.).
- `ProfileForm` uses `useForm({ resolver: zodResolver(schema) })`; inline `FormMessage` per field; Save disabled when `!isDirty || !isValid || isSubmitting`.
- Per-section dirty indicators (dot on accordion header) using `formState.dirtyFields`.

### 3. Field completeness vs backend

Audit every field in `updateStudent` service and expose it once, with the right control:

- **BioData**: firstName/lastName (read-only from account), middleName, gender (Select), dateOfBirth (shadcn DatePicker), nationality (Combobox of ISO countries), placeOfBirth, religion (Select), maritalStatus (Select).
- **ContactInfo**: countryOfResidence (Combobox), stateOfResidence + lgaOfResidence (Nigerian states/LGAs cascading Select), residentialAddress (Textarea).
- **StudentDetails**: phone (with country prefix hint), address, dob mirror.
- **MedicalFitness**: bloodGroup (Select A+/A-/…/O-), genotype (Select AA/AS/AC/SS/SC), fileUrl (upload → returns URL, preview & remove).
- **NextOfKin**: fullName, relationship (Select), phone, email, address.
- **GuardianInfo**: fullName, relationship, phone, email, occupation, address.
- **Admission accordion**: keep every field `disabled` + tooltip "Managed by the registry".
- Remove any field currently in UI that has no backend target (audit + delete).

### 4. Profile image upload

- New `ProfileImageDialog`:
  - Drop/click zone, accept `image/png,image/jpeg,image/webp`, max 2 MB (client-side check + toast on reject).
  - Square crop preview (`react-easy-crop`, add dep).
  - Convert cropped canvas → base64 → `uploadProfileImage`.
  - Progress state, error toast, success toast.
  - "Remove photo" action sends `{ profileImg: null }`.
- Header avatar shows initials fallback when `profileImg` null; keyboard-focusable with `aria-label="Change profile photo"`.

### 5. Password change

- Rework `ChangePasswordDialog`:
  - Fields: currentPassword, newPassword, confirmPassword — all with show/hide (`aria-pressed`).
  - zod: min 8, must contain upper+lower+digit.
  - Live strength meter (weak/fair/strong).
  - Submit calls `changePassword`; on success show toast and (optional) trigger `signOut()` so the user re-authenticates with the new password.
  - Surface backend field errors (e.g., "Current password is incorrect") on the right field.

### 6. Page structure & UX

- Rebuild `Profile.tsx`:
  - React-query loading → per-section `Skeleton`s (not one big block).
  - Error state with retry button.
  - Sticky action bar at bottom on mobile with Save / Discard.
- `ProfileForm`:
  - Accordion sections stay, but only one open at a time is optional (allow multiple).
  - `ReviewFormModal` shows only fields that changed (`dirtyFields`), grouped by section, with a "Confirm & Save" button.
- Toasts standardised via `sonner`.

### 7. Accessibility & mobile

- Every input has an explicit `<Label htmlFor>` (via shadcn `FormLabel` — already wired) and `aria-invalid` when errored.
- Password toggle buttons: `aria-label` + `aria-pressed` (already added in Login/Register; apply same here).
- Accordion triggers use `aria-expanded` (Radix handles it — ensure we use shadcn `Accordion` instead of custom `Collapsible` triangles).
- Mobile:
  - Grid becomes single column below `sm`.
  - Sticky bottom action bar with safe-area padding.
  - Review modal becomes a full-screen `Sheet` on mobile.
- Focus-visible ring restored on all interactive elements (Tailwind default token).

### Technical notes

- New deps: `react-easy-crop` (image crop), `libphonenumber-js` (optional phone validation) — small footprint.
- Files to add:
  - `src/hooks/useStudentProfile.ts`
  - `src/lib/validation/studentProfile.ts`
  - `src/lib/data/nigeria-states.ts` (states + LGA map)
  - `src/lib/data/countries.ts`
  - `src/components/profile/ProfileImageDialog.tsx`
- Files to modify:
  - `src/pages/Profile.tsx`
  - `src/services/studentServicesApi.ts`
  - `src/components/profile/ProfileForm.tsx`
  - `src/components/profile/ProfileHeader.tsx`
  - `src/components/profile/ChangePasswordDialog.tsx`
  - All `profile/*Section.tsx` (swap Collapsible for Accordion, add validation messages, wire selects/date pickers)
  - `src/components/profile/ReviewFormModal.tsx` (diff-only display)
- No backend changes required — plan is 100% frontend and aligned with the `updateStudent` shape you shared.

### Out of scope

- Redesigning other pages.
- Backend endpoint changes.
- Adding fields the backend doesn't accept.
