# MarcinP Portfolio

Interactive Microsoft Dynamics 365 Finance & Operations developer portfolio styled as a Visual Studio / D365 Application Explorer workspace.

## Included

- Polish and English interface with a persistent language switch
- Persistent Visual Studio-inspired dark/light colour theme
- Readability-focused UI typography enlarged across the IDE workspace
- Five anonymised D365 F&O case studies using the problem → solution → effect format
- Payment portal API integration examples for Adyen and Stripe
- Power Automate / Esker integration and custom X++ extension examples
- Regression testing and release-confidence case study
- Recruitment-focused `/experience` page
- Ctrl+K command palette (`about`, `projects`, `experience`, `contact`, `github`)
- TFVC-style Visual Studio status bar rather than Git branch chrome
- Contact form with client-side validation, subject, sending/success/error states and Turnstile-token support
- Configurable JSON endpoint (`NEXT_PUBLIC_CONTACT_API_ENDPOINT`, default `/api/contact`)
- Server-side contact endpoint with honeypot, origin checks and validation
- Runtime Cloudflare Web Analytics loader

## Contact delivery

The browser never receives the destination email address. Configure one of these server-side options:

The frontend endpoint defaults to `/api/contact`. To point the form at a separate Cloudflare Worker, set `NEXT_PUBLIC_CONTACT_API_ENDPOINT`. This is a public URL only; keep every secret in the Worker environment. The request includes `turnstileToken` ready for future server-side Turnstile verification.

### Webhook

- `CONTACT_WEBHOOK_URL`
- `CONTACT_WEBHOOK_SECRET` (optional bearer token)

### Resend

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`

Until one delivery option is configured, the form remains visible but safely disabled.

## Analytics

Set `CLOUDFLARE_WEB_ANALYTICS_TOKEN` to load Cloudflare Web Analytics at runtime. Without a token, the loader returns an empty script and does not track visitors.

## Local development

Requires Node.js `>=22.13.0`.

```bash
npm ci
npm run dev
```

Production build:

```bash
npm run build
```

## Stack

- Next.js-compatible app router via Vinext
- React and TypeScript
- Cloudflare Workers runtime
- Tailwind CSS / Shadcn UI primitives

## Public links

- Portfolio: [marcinp.com](https://marcinp.com)
- LinkedIn: [marcin-piszczatowski](https://www.linkedin.com/in/marcin-piszczatowski/)
- GitHub: [piszczat](https://github.com/piszczat)
