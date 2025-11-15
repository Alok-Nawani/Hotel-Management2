# Troubleshooting Guide

## "Invalid token" errors in frontend

This happens when the database was re-seeded but the frontend still has the old authentication token.

### Solution 1: Clear Browser Storage (Recommended)

1. Open the browser console (F12 or Cmd+Option+I)
2. Go to **Console** tab
3. Type and run:
```javascript
localStorage.clear()
location.reload()
```
4. Login again with username: `admin`, password: `admin123`

### Solution 2: Manual Clear

1. Open browser DevTools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Click on **Local Storage** → `http://localhost:5173` (or your frontend URL)
4. Delete the `token` and `user` entries
5. Refresh the page
6. Login again

## Empty data in frontend

If you see empty menus, customers, etc., but the backend has data:

### Check 1: Verify Database Has Data

```bash
cd backend
sqlite3 database.sqlite "SELECT COUNT(*) FROM MenuItems; SELECT COUNT(*) FROM Customers;"
```

Should show counts > 0.

### Check 2: Verify data_tables Were Exported

```bash
cd backend
ls -la data_tables/
cat data_tables/menu.md
```

### Check 3: Re-run Seeder

```bash
cd backend
npm run seed
```

This will:
- Reset the database
- Create admin user (username: `admin`, password: `admin123`)
- Add sample customers and menu items
- Export all tables to `data_tables/` folder

**⚠️ Important**: After re-seeding, you MUST clear localStorage and login again (see "Invalid token" fix above).

## Backend server not starting

### Check if port 4000 is in use:
```bash
lsof -ti:4000
```

If it returns a process ID, kill it:
```bash
lsof -ti:4000 | xargs kill -9
```

Then start the server:
```bash
cd backend
npm run dev
```

## Frontend not connecting to backend

### Check CORS settings

The backend should allow your frontend URL. Check `backend/server.js`:

```javascript
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});
```

If your frontend runs on `localhost:5173` (Vite default), you may need to update this.

## WebSocket connection issues (Terminal page)

### Symptoms
- "Not connected to server" message
- Queries not appearing in real-time

### Fix
1. Make sure backend is running on port 4000
2. Check browser console for WebSocket errors
3. Verify the Socket.io server is configured correctly in `backend/server.js`
4. Ensure frontend is connecting to the correct URL (check `frontend/src/pages/Terminal.jsx`)

## Development Workflow

### Clean Start (Recommended for beginners)

```bash
# 1. Stop all servers
# (Press Ctrl+C in all terminal windows)

# 2. Kill any background processes
lsof -ti:4000 | xargs kill -9
lsof -ti:5173 | xargs kill -9

# 3. Re-seed database
cd backend
npm run seed

# 4. Start backend
npm run dev

# 5. In a new terminal, start frontend
cd frontend
npm run dev

# 6. Open browser to http://localhost:5173
# 7. Clear localStorage (see "Invalid token" fix)
# 8. Login with username: admin, password: admin123
```

## Quick Reference

### Default Login Credentials
- **Username**: `admin`
- **Password**: `admin123`

### API Endpoints Test
```bash
# Get auth token
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Test menu endpoint (replace TOKEN with actual token from login)
curl http://localhost:4000/api/menu \
  -H "x-auth-token: YOUR_TOKEN_HERE"
```

### Database Quick Checks
```bash
# List all tables
sqlite3 backend/database.sqlite ".tables"

# Count records
sqlite3 backend/database.sqlite "SELECT COUNT(*) FROM MenuItems;"
sqlite3 backend/database.sqlite "SELECT COUNT(*) FROM Customers;"

# View data
sqlite3 backend/database.sqlite "SELECT * FROM MenuItems;"
```
