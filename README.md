<div align="center">
    <a href="https://kushagrapandey.com"><h1 align="center">kushagrapandey.com</h1></a>

My personal website, built with [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), [Contentlayer](https://www.contentlayer.dev/) and deployed to [Vercel](https://vercel.com/).

</div>

## Local setup

Use Node.js 22, install [Gitleaks](https://github.com/gitleaks/gitleaks) (`brew install gitleaks` on macOS), then run `npm ci`. Installation enables the repository's commit and push hooks. Copy `.env.example` to `.env` for optional view-count analytics; keep real values local and in Vercel's environment settings.

Run `npm run check`, `npm run check:security`, and `npm run build` before releasing.

## Secret protection

- Sensitive environment files, private keys, and cloud credentials are ignored and rejected if force-added. `.env.example` permits blank values only.
- Commit hooks scan staged changes; push hooks scan outgoing commits, including credentials added and removed before the final commit. Missing Gitleaks blocks the operation.
- GitHub Actions independently checks tracked files, the current source, and incoming commits with a pinned, checksum-verified scanner. The custom Upstash rule supplements the standard provider rules. Findings are redacted.
- Keep GitHub Secret Protection and push protection enabled. Require the **Secrets** status check on `main`; local hooks can be bypassed, so they are not a substitute for server enforcement.

Historical `.env` and `new.env` credentials must be revoked at Upstash. Removing a file from the current commit does not remove previous commits or invalidate a token. History has not been rewritten. Detection is pattern-based and cannot guarantee that every possible secret will be recognized.

