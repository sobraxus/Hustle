# Testing Guide

## Quick Start

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open the application:**
   - Main dashboard: http://localhost:3000
   - Test controls: http://localhost:3000/test

## Testing Features

### 1. Test Call-Out Logic (CRITICAL Priority)

**Steps:**
1. Go to http://localhost:3000/test
2. Click "Create CRITICAL" button
3. Note the case ID that was created
4. Wait 20+ minutes OR manually update the database:
   ```bash
   # Using Prisma Studio
   npm run db:studio
   # Then edit the createdAt field to be 21 minutes ago
   ```
5. Click "Run SLA Breach Check" button
6. Go to main page (http://localhost:3000)
7. **Expected:** The CRITICAL case row should have a red pulsing glow

### 2. Test Call-Out Logic (HIGH Priority)

**Steps:**
1. Go to http://localhost:3000/test
2. Click "Create HIGH" button
3. **Important:** Ensure current UK time is outside 09:00-17:00
   - Check: http://worldtimeapi.org/api/timezone/Europe/London
4. Wait 5+ minutes OR manually update the database to set createdAt to 6 minutes ago
5. Click "Run SLA Breach Check" button
6. Go to main page
7. **Expected:** The HIGH case row should have a red pulsing glow

### 3. Test Live Timer Component

**Steps:**
1. Go to http://localhost:3000/test
2. Create a case of any priority (e.g., "Create CRITICAL")
3. Go to main page (http://localhost:3000)
4. Find your case in the table
5. Watch the "Time to SLA Breach" column
6. **Expected:**
   - Timer updates every second
   - Green color when >5 minutes remaining
   - Yellow color when <5 minutes remaining
   - Red "BREACHED" when time expires
   - Shows "—" for RESOLVED cases

### 4. Test SLI Analytics

**Steps:**
1. Go to http://localhost:3000/test
2. Create multiple cases of different priorities
3. For each case:
   - Click "Assign Case" (sets assignedAt)
   - Click "Complete Case" (sets completedAt and status to RESOLVED)
4. Go to main page (http://localhost:3000)
5. Check the "SLI Analytics" section
6. **Expected:**
   - Bar charts for each priority level
   - Shows percentage faster/slower than target
   - Green bars for positive performance
   - Red bars for negative performance
   - Displays case count and average SLI

### 5. Test Automatic SLA Breach Checking

**Steps:**
1. Create a CRITICAL case
2. Wait 20+ minutes (or manually adjust createdAt in database)
3. The system automatically checks every minute
4. **Expected:** After 1 minute, the case should automatically get `isCallOutTriggered = true`
5. Refresh the main page to see the red pulsing glow

## Manual Database Testing

### Using Prisma Studio

```bash
npm run db:studio
```

This opens a web interface where you can:
- View all cases
- Edit case fields (e.g., set createdAt to past dates for testing)
- Create new cases manually
- Delete test cases

### Quick SQL Queries (if using SQLite directly)

```bash
# View all cases
sqlite3 dev.db "SELECT id, priority, status, isCallOutTriggered, createdAt FROM Case;"

# Set a case's createdAt to 21 minutes ago (for CRITICAL testing)
sqlite3 dev.db "UPDATE Case SET createdAt = datetime('now', '-21 minutes') WHERE id = 'your-case-id';"

# Set a case's createdAt to 6 minutes ago (for HIGH testing)
sqlite3 dev.db "UPDATE Case SET createdAt = datetime('now', '-6 minutes') WHERE id = 'your-case-id';"
```

## Testing Checklist

- [ ] CRITICAL case triggers call-out after 20 minutes
- [ ] HIGH case triggers call-out after 5 minutes (outside business hours)
- [ ] Live timer updates every second
- [ ] Live timer shows correct colors (green/yellow/red)
- [ ] Red pulsing glow appears on call-out triggered rows
- [ ] SLI Analytics shows correct delta percentages
- [ ] SLI Analytics displays bar charts correctly
- [ ] Completed cases appear in analytics
- [ ] Automatic breach checking runs every minute
- [ ] Table refreshes after breach checks

## Troubleshooting

**Timer not updating?**
- Check browser console for errors
- Ensure the case status is not "RESOLVED"

**Call-out not triggering?**
- Verify the case status is "OPEN"
- Check that `isCallOutTriggered` is currently `false`
- For HIGH priority: Ensure current UK time is outside 09:00-17:00
- Manually run "Run SLA Breach Check" from test page

**SLI Analytics not showing?**
- Ensure you have completed cases (status = RESOLVED, completedAt is set)
- Check that cases have different priorities to see multiple bars

**No data in table?**
- Create test cases from the test page
- Check database connection in `.env` file
- Verify Prisma client is generated: `npm run db:generate`
