# Personal Portfolio

This is the standalone repository for the portfolio website.

## Local Editing

Double-click `StartPortfolio.bat`, or run:

```powershell
node serve.mjs
```

Then open:

```text
http://127.0.0.1:4173/?dev=1
```

Edit content in the browser and click Save. The local server writes changes to `content.json`.

## Publish To GitHub Pages

1. Create a new GitHub repository, for example `PortfolioWebsite`.
2. Push this folder to that repository.
3. In GitHub, open `Settings -> Pages`.
4. Set `Build and deployment -> Source` to `GitHub Actions`.
5. Push to `main`. The workflow publishes the site automatically.

If the repository is `PortfolioWebsite`, the public URL will be:

```text
https://jesse-ning.github.io/PortfolioWebsite/
```
