// api/refresh.js - Serverless function for refreshing timetable
const AuthManager = require('../src/modules/auth.js');
const TimetableManager = require('../src/modules/timetable.js');
const CacheManager = require('../src/modules/cache.js');
const NotificationManager = require('../src/modules/notifications.js');

// Singleton instances (reused across warm function calls)
let authManager, timetableManager, cacheManager, notificationManager;

const getManagers = () => {
  if (!authManager) {
    authManager = new AuthManager();
    timetableManager = new TimetableManager(authManager);
    cacheManager = new CacheManager();
    notificationManager = new NotificationManager();
  }
  return { authManager, timetableManager, cacheManager, notificationManager };
};

const handler = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('🔄 Refresh requested at:', new Date().toISOString());
    
    const managers = getManagers();
    
    // Fetch fresh data
    const freshData = await managers.timetableManager.fetchFreshTimetableData();
    console.log(`✅ Fetched ${freshData.length} classes`);

    // Detect changes
    const changes = await managers.cacheManager.detectScheduleChangesWithPersistence(freshData);
    if (changes.hasChanges) {
      console.log(`📊 Detected ${changes.changes.length} changes`);
      await managers.notificationManager.sendScheduleChangeNotifications(changes.changes);
    }

    // Save cache
    await managers.cacheManager.saveTimetableCache(
      freshData, 
      managers.authManager.getSessionCookies()
    );

    const processedData = freshData.map(item => 
      managers.timetableManager.processClassItem(item)
    );
    
    const timestamp = new Date().toISOString();
    
    res.status(200).json({ 
      success: true, 
      data: processedData, 
      cached: false,
      timestamp: timestamp,
      classCount: processedData.length,
      changes: changes.hasChanges ? changes.changes : null
    });
  } catch (error) {
    console.error('❌ Error refreshing timetable:', error.message);
    console.error('Stack:', error.stack);
    
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

module.exports = handler;
