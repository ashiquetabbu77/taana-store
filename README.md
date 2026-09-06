# Taana — Handloom Storefront (Portfolio Project)

A fully working e-commerce storefront demo for a fictional Indian handloom textile brand, built to showcase front-end development skills: product browsing, filtering/sorting, cart, and a mock checkout flow — no framework, no build step, no external dependencies.

**Live features**
- Responsive storefront (mobile → desktop) with a distinct handloom-inspired visual identity
- 12 products across 4 categories with category filter + price sort
- Product detail modal with quantity selector
- Persistent shopping cart (localStorage) with quantity controls and line removal
- Mock checkout form → order confirmation with a generated order ID
- Accessible: keyboard-navigable modals, visible focus states, `Esc` to close, reduced-motion support

**Tech stack:** HTML5, CSS3 (custom properties, CSS Grid), vanilla JavaScript (ES6). Fonts via Google Fonts (Cormorant Garamond + Work Sans). Zero build tooling — runs by opening `index.html`, or deploy anywhere static.

## Project structure
```
taana-store/
├── index.html        # Markup + page structure
├── css/style.css      # Design tokens, layout, components
├── js/app.js          # Product data, cart logic, rendering, checkout flow
└── README.md
```

## Run it locally
Just open `index.html` in a browser — no server or install needed.

For local dev with live reload, you can also run a simple static server:
```bash
npx serve .
# or
python3 -m http.server 8000
```

## Deploy it for free (to actually show people)
**GitHub Pages** (recommended — gives you a public URL you can put on your resume/portfolio):
1. Create a new GitHub repo, e.g. `taana-store`.
2. Push these files to the `main` branch.
3. Go to Settings → Pages → set source to `main` branch, root folder.
4. Your site will be live at `https://<your-username>.github.io/taana-store/`.

**Netlify / Vercel** also work — drag-and-drop the folder on Netlify's dashboard for an instant URL.

## Notes for extending it
- Product data lives entirely in `PRODUCTS` and `CATEGORIES` in `js/app.js` — add/edit items there, no other file needs to change.
- Product "photos" are CSS-generated weave patterns (no images), so the whole site loads instantly and has zero image licensing concerns — swap in real photos in `product-swatch` / `pm-visual` if you extend this into a real store.
- Checkout is a front-end mock only (no payment gateway or backend) — a natural next step would be wiring it to Razorpay/Stripe and a small backend (Node/Express or Firebase) to persist real orders.
