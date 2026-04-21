# GitHub Pages Setup

This project has been adapted so it can be published as a GitHub Pages site.

## Recommended repository name

If you want the site to live at `https://bpdulog.github.io`, create or rename the destination repository to:

`bpdulog.github.io`

That repository name is important because it becomes your user site on GitHub Pages.

## What is already configured

The project now includes a GitHub Actions workflow at `.github/workflows/deploy-pages.yml` that builds and deploys the site automatically whenever you push to the `main` branch.

The project also includes a Pages preparation step that:

- creates `404.html` from `index.html`
- creates `.nojekyll`
- supports a configurable Vite base path through `VITE_BASE_PATH`

## Publish flow

Export this project to GitHub, push it to the `main` branch of `bpdulog.github.io`, then enable GitHub Pages in the repository settings if GitHub asks for confirmation.

After the workflow runs successfully, your site should appear at:

`https://bpdulog.github.io`

## If you use a different repository name

If you publish to a repository such as `portfolio-site` instead of `bpdulog.github.io`, update the workflow environment value:

`VITE_BASE_PATH: /portfolio-site/`

That change ensures asset paths resolve correctly on GitHub Pages project sites.
