# KH Fashion - One Command

## After extracting and opening THIS folder in VS Code

Run only:

```powershell
npm run dev
```

That's it.

On the first run, the command automatically:
- installs Node/React packages
- installs FastAPI/Uvicorn packages
- starts FastAPI
- starts React/Vite

Then open:

http://localhost:5173

For later runs, just use:

```powershell
npm run dev
```

Do not run `npm install` or `pip install` again unless you delete dependencies.
