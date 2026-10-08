# Riyad's Portfolio

Hugo source for [naiemurrahmanriyad.github.io](https://naiemurrahmanriyad.github.io/).

## Local development

Install Hugo Extended 0.167.0 or newer, then run:

```powershell
hugo server
```

Open http://localhost:1313/.

## Production build

```powershell
hugo --gc --minify
```

## Deployment

The GitHub Actions workflow at `.github/workflows/hugo.yaml` builds the Hugo
site from `riyad-portfolio/` and deploys it to GitHub Pages on every push to
`main`. The published site is available at
https://naiemurrahmanriyad.github.io/.

The contact form requires a real Formspree endpoint in
`riyad-portfolio/hugo.toml`; the placeholder endpoint is not configured.
