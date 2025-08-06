# frontendClean

This project is a React front‑end configured with [Vite](https://vitejs.dev/). It expects a backend API reachable by default at `http://localhost:3000`.

## Installing dependencies

Install packages from the repository root and inside the app directory:

```bash
npm install
cd frontendClean && npm install
```


## Setting environment variables

Create a `.env` file in `frontendClean` to configure API access:

```env
VITE_API_URL=http://localhost:3000
VITE_USE_MOCKS=false
```

## Running the development servers

Start the backend API on `VITE_API_URL` (for example using `npm start` in your backend project) then run the Vite dev server:

```bash
cd frontendClean && npm run dev
```

Set `VITE_USE_MOCKS=true` in the `.env` file if you want to work without the
backend API and use the local mocked data instead.

## Available scripts

- `npm run dev` – launch the Vite development server with hot reloading.
- `npm run build` – build the project for production in the `dist` folder.
- `npm run preview` – serve the production build locally.
- `npm run lint` – run ESLint on the source files.
