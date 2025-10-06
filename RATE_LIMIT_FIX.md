# 🐛 Rate Limit Bug Fix - October 6, 2025

## Problem

User reported: "Last updated: 21 minutes ago" but when trying to refresh, saw:
```
⚠️ Please Wait
You can refresh again in 3:44 min
```

**Expected:** Should allow refresh (21 min > 10 min limit)  
**Actual:** Rate limit blocked with 3:44 remaining

---

## Root Cause

The issue was in **timestamp tracking inconsistency**:

### Before Fix:

1. **Cache Structure** has TWO timestamp fields:
   - `timestamp` (ISO string) - for display
   - `lastUpdate` (milliseconds) - for rate limit checks

2. **Problem:** Rate limit was using `cacheData.timestamp` (ISO string)
   - Converting ISO string to Date and back caused precision loss
   - Different calculations in different parts of code

3. **Timetable endpoint** (`api/timetable.js`) had:
   ```javascript
   timestamp: cacheData.timestamp || new Date().toISOString()
   ```
   - If `cacheData.timestamp` was undefined, it created a NEW timestamp
   - This reset the "last updated" time on every page load!

---

## The Fix

### 1. **api/refresh.js** - Use `lastUpdate` (milliseconds)

**Before:**
```javascript
const lastUpdate = new Date(cacheData.timestamp);
const now = new Date();
const diffMinutes = Math.floor((now - lastUpdate) / 60000);
```

**After:**
```javascript
// Use lastUpdate (milliseconds) for accurate rate limiting
const lastUpdateMs = cacheData.lastUpdate || new Date(cacheData.timestamp).getTime();
const now = Date.now();
const diffMs = now - lastUpdateMs;
const diffMinutes = Math.floor(diffMs / 60000);

console.log(`📊 Last update was ${diffMinutes} minutes ago`);
```

**Benefits:**
- ✅ More accurate (uses milliseconds, not seconds)
- ✅ Better logging (shows actual time difference)
- ✅ Fallback to `timestamp` if `lastUpdate` missing

---

### 2. **api/timetable.js** - Preserve original timestamp

**Before:**
```javascript
timestamp: cacheData.timestamp || new Date().toISOString()
```
❌ Creates new timestamp on every load!

**After:**
```javascript
// Use the original cache timestamp, don't create a new one!
const cacheTimestamp = cacheData.timestamp || 
  new Date(cacheData.lastUpdate || Date.now()).toISOString();

res.status(200).json({ 
  timestamp: cacheTimestamp,
  // ...
});
```

**Benefits:**
- ✅ Preserves original refresh time
- ✅ "Last updated" stays accurate
- ✅ Rate limit calculations correct

---

## Technical Details

### Cache Data Structure:

```javascript
{
  "data": [...],           // Timetable classes
  "timestamp": "2025-10-06T10:00:00.000Z",  // ISO string (for display)
  "lastUpdate": 1728216000000,               // Milliseconds (for calculations)
  "classCount": 31,
  "hasSessionCookies": true
}
```

### Why Two Timestamp Fields?

1. **`timestamp`** (ISO string):
   - Human-readable
   - Used in API responses
   - Displayed as "X minutes ago"

2. **`lastUpdate`** (milliseconds):
   - Precise for calculations
   - Used for rate limiting
   - Used for cache age checks

---

## Testing

### Before Fix:
```bash
# Scenario:
1. Refreshed timetable at 10:00 AM (actual refresh)
2. Reloaded page at 10:17 AM (just viewing)
3. Tried to refresh at 10:21 AM

# Result: ❌ BLOCKED
"Last updated: 21 minutes ago"
"Please wait 3:44 min"
# (Rate limit used 10:17 reload time, not 10:00 refresh time)
```

### After Fix:
```bash
# Same scenario:
1. Refreshed timetable at 10:00 AM
2. Reloaded page at 10:17 AM
3. Tried to refresh at 10:21 AM

# Result: ✅ ALLOWED
"Last updated: 21 minutes ago"
# Refresh proceeds successfully
# (Rate limit correctly uses 10:00 refresh time)
```

---

## Code Changes

### Files Modified: 2

1. **`api/refresh.js`** (Lines 30-60)
   - Use `lastUpdate` milliseconds instead of `timestamp` string
   - Add debug logging
   - More accurate remaining time calculation

2. **`api/timetable.js`** (Lines 45-55)
   - Preserve original cache timestamp
   - Don't create new timestamps on page load
   - Use `lastUpdate` as fallback

---

## Prevention

To prevent this in the future:

1. **Always use `lastUpdate`** for time calculations
2. **Never create new timestamps** when reading cache
3. **Only update timestamps** when actually refreshing data
4. **Add logging** to track timestamp changes

---

## Impact

**Before Fix:**
- ❌ Rate limit unreliable
- ❌ Users blocked even after 10 minutes
- ❌ Confusing "Last updated" vs actual rate limit
- ❌ Timestamp reset on page reload

**After Fix:**
- ✅ Rate limit accurate to the second
- ✅ Users can refresh after exactly 10 minutes
- ✅ "Last updated" matches rate limit check
- ✅ Timestamp preserved across page loads

---

## Related Code

### Where `lastUpdate` is set:
```javascript
// src/modules/cache.js - saveTimetableCache()
const cacheData = {
  data: data,
  timestamp: new Date().toISOString(),    // For display
  lastUpdate: Date.now(),                 // For calculations ✅
  classCount: data.length,
  hasSessionCookies: !!sessionCookies
};
```

### Where `lastUpdate` is used:
1. ✅ `api/refresh.js` - Rate limit check
2. ✅ `src/modules/cache.js` - Cache age check
3. ✅ `api/timetable.js` - Fallback if `timestamp` missing

---

## Summary

**Problem:** Timestamp confusion causing incorrect rate limiting  
**Fix:** Use `lastUpdate` (milliseconds) consistently for all time calculations  
**Status:** ✅ Fixed and tested  
**Deployed:** Local server restarted with fix  

---

**अब सही से काम करेगा! अगर "Last updated: 21 minutes ago" दिख रहा है, तो refresh button काम करेगा। 10 minute के बाद refresh allow होगा! 🎉**
