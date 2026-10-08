# Riyad's Hugo Portfolio

Custom Hugo portfolio using plain CSS and vanilla JavaScript.

## Requirements

Hugo Extended 0.167.0.

Check your installation:

    hugo version

The version output should contain `extended`.

## Local development

    hugo server -D

Open http://localhost:1313/.

Netlify Forms submission is only available after deployment.

## Production build

    hugo --gc --minify

Generated files are written to `public/`.

## Netlify deployment

Push the project to a Git repository, then import that repository into Netlify.

Use these settings:

- Build command: hugo --gc --minify
- Publish directory: public
- HUGO_VERSION: 0.167.0
- HUGO_EXTENDED: true
- HUGO_ENV: production

Enable form detection in Netlify and redeploy. Check that a form named
`contact` appears in the site's Forms dashboard.

Production baseURL is https://naiemurrahman.netlify.app/.
Update hugo.toml if your domain changes.

## Content editing

Hero and About: content/_index.md.
Contact and social links: hugo.toml.
Skills: data/skills.yaml.
Technologies: data/technologies.yaml.
Education: data/education.yaml.
Counters: data/stats.yaml.

Typewriter roles were derived from the supplied role text.
They have not been extracted from the original main.js.

Education entries with draft: true are not rendered.

## Projects

Create a leaf bundle:

    hugo new content projects/my-project/index.md

Place the project's images in the same directory.

Use YAML front matter with these fields:

    ---
    title: ""
    description: ""
    date: 2026-10-08
    draft: true
    category: ""
    tools: []
    tags: []
    image: ""
    githubUrl: ""
    liveUrl: ""
    dashboardUrl: ""
    featured: true
    weight: 1
    ---

Fill in verified content and set draft: false when ready.
No sample projects are published.

The home page renders all published projects in weight order.
Projects link to reusable detail pages.

The Projects counter counts published project pages.
Set its override field in data/stats.yaml to a number to override it.

## Profile photo

Put the photo in assets/images/profile.jpg.
Set about.image in content/_index.md to images/profile.jpg.

Hugo creates WebP variants with responsive srcset.
Until a photo is supplied, the site displays initials.

## Technology icons

Copy original icons into assets/techs/.
Rename bigquerry.jpeg to bigquery.jpeg.

Until icons are supplied, technology names still render.
Raster icons are resized and converted to WebP.
SVG icons are published as Hugo resources.

## CV

Add static/cv/Riyad_CV.pdf.
Set params.cvAvailable = true in hugo.toml.

## Social preview image

Add static/images/og.jpg.
Set params.ogImage = "images/og.jpg" in hugo.toml.

## Formspree

Set params.contact.provider = "formspree".
Set params.contact.action to your Formspree endpoint URL.

The same form supports AJAX and normal browser POST submission.

## Privacy

Email and phone are displayed as provided.
Email is also included in Person JSON-LD.
Obfuscation is not enabled and would not guarantee scrape protection.

## Validation

This source has not been built or browser-tested in the authoring environment.
No Lighthouse score or original-site visual parity is claimed.

Check the layout, project pages, mobile navigation, reduced-motion behavior,
form submission, metadata, sitemap and robots.txt after building.
