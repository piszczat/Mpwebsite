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
- Contact form with client-side validation, subject, sending/success/error states and Cloudflare Turnstile
- Configurable external contact API and Turnstile widget using public `NEXT_PUBLIC_` variables
- Runtime Cloudflare Web Analytics loader

## Contact configuration

The frontend uses the already deployed Cloudflare endpoint. Copy `.env.example` to an ignored environment file in local development or configure these variables in the production process:

- `NEXT_PUBLIC_CONTACT_API_ENDPOINT=https://api.marcinp.com/contact`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAEkP6VWd1WINmRTz`

Both values are intentionally public browser configuration. The form sends exactly `name`, `email`, `company`, `subject`, `message` and `turnstileToken` as JSON. Turnstile secrets and email-provider credentials belong only in the separate backend Worker and must never be added to this repository.

The previous duplicate in-app email endpoint has been removed; `https://api.marcinp.com/contact` is the single contact backend.

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
