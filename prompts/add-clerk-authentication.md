# Implementation Prompt: Add Clerk Authentication

## Goal
Set up Clerk authentication for the Vertex learning platform using the Clerk CLI and @clerk/nextjs, integrating auth controls (sign-in, sign-up, user profile button) into the navigation, verifying middleware/proxy matchers for Next.js 16/App Router, and ensuring clean authentication boundaries.

---

## Skills Read & References
- AGENTS.md (Project overview, Clerk authentication decisions, server/client boundaries)
- clerk-cli (.agents/skills/clerk-cli/SKILL.md)
- clerk-nextjs-patterns (.agents/skills/clerk-nextjs-patterns/SKILL.md)
- clerk-setup (.agents/skills/clerk-setup/SKILL.md)
- clerk-custom-ui (.agents/skills/clerk-custom-ui/SKILL.md)

---

## Code & Config Inspected
- package.json: Next.js 16.3.4, React 19.2.8, Tailwind CSS v4.
- pp/layout.tsx: RootLayout currently renders without ClerkProvider.
- components/ui/navigation.tsx: Navigation bar and controls.
- pp/page.tsx: Vertex home page containing navigation and course catalog.
- No middleware.ts / proxy.ts yet in the project root.

---

## Decisions and Assumptions

1. **CLI & Setup Flow**:
   - Check and update/install Clerk CLI.
   - Run clerk auth login if needed, then clerk init --app app_3IpGXENOywZWNQgGbKbCNt0JqUb.
   - Run clerk doctor to verify setup and configuration.

2. **Next.js Integration**:
   - Wrap root layout body content in <ClerkProvider> (inside <body>, not wrapping <html> per Clerk Next.js App Router requirements).
   - Ensure middleware.ts or proxy.ts is configured with Clerk middleware and matchers including '/(api|trpc)(.*)' and '/__clerk/:path*'.
   - Async uth() handling compliant with Next.js 15+ / 16+.

3. **UI Auth Controls**:
   - Update navigation header to include Clerk auth controls (<SignInButton>, <SignUpButton>, <UserButton>, <Show when=" signed-out\>, <Show when=\signed-in\>).
 - Match the visual styling and brand aesthetic of Vertex.

4. **Security & Boundaries**:
 - Never expose CLERK_SECRET_KEY to client code.
 - Only NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is exposed to the browser.
 - Public browsing allowed by default; protected routes gated via Next.js middleware.

---

## Files to Touch / Create
- middleware.ts: Clerk middleware configuration with proxy matchers.
- pp/layout.tsx: Wrap body contents in ClerkProvider.
- components/ui/navigation.tsx: Add Clerk authentication controls (UserButton, SignInButton, SignUpButton, Show).
- pp/page.tsx: Ensure navigation bar auth controls integrate seamlessly.
- package.json: Dependency addition (@clerk/nextjs).

---

## Security Considerations
- Keep CLERK_SECRET_KEY server-only in .env.local / environment variables.
- Keep .env.local untracked in .gitignore.
- Middleware route protection for private features.

---

## Acceptance Criteria
- [ ] Clerk CLI is installed / updated and linked to app pp_3IpGXENOywZWNQgGbKbCNt0JqUb.
- [ ] @clerk/nextjs is installed and configured in pp/layout.tsx with <ClerkProvider>.
- [ ] middleware.ts includes the required Next.js matchers ('/(api|trpc)(.*)', '/__clerk/:path*').
- [ ] Navigation header displays Sign In / Sign Up buttons when signed out, and UserButton profile avatar when signed in.
- [ ] clerk doctor health check passes.
- [ ] TypeScript check (
px tsc --noEmit) passes with zero errors.
- [ ] ESLint (
pm run lint) passes.
- [ ] Build (
pm run build) passes.

---

## Checks to Run
- clerk doctor
- 
px tsc --noEmit
- 
pm run lint
- 
pm run build

---

## Manual Test Steps
1. Run 
pm run dev and navigate to http://localhost:3000.
2. Verify the Sign In / Sign Up controls or UserButton avatar render in the navigation header.
3. Test sign-up / sign-in flow and check that UserButton appears with profile controls upon sign-in.
