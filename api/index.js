const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();

const AuthManager = require('../src/modules/auth.js');
const TimetableManager = require('../src/modules/timetable.js');
const CacheManager = require('../src/modules/cache.js');
const NotificationManager = require('../src/modules/notifications.js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize managers
const authManager = new AuthManager();
const timetableManager = new TimetableManager(authManager);
const cacheManager = new CacheManager();
const notificationManager = new NotificationManager();

// API Routes
app.get('/api/timetable', async (req, res) => {
  try {
    // Serve cached timetable if available
    const cacheData = await cacheManager.loadTimetableCache();
    if (!cacheData || !cacheData.data) {
      return res.status(404).json({ 
        success: false, 
        error: 'No timetable data. Please refresh first.' 
      });
    }

    const processedData = cacheData.data.map(classItem => 
      timetableManager.processClassItem(classItem)
    );
    res.status(200).json({ 
      success: true, 
      data: processedData, 
      cached: true,
      timestamp: cacheData.timestamp || new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error fetching timetable:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Handle both GET and POST for /api/refresh
const refreshHandler = async (req, res) => {
  try {
    // Fetch fresh data
    const freshData = await timetableManager.fetchFreshTimetableData();

    // Detect changes
    const changes = await cacheManager.detectScheduleChangesWithPersistence(freshData);
    if (changes.hasChanges) {
      await notificationManager.sendScheduleChangeNotifications(changes.changes);
    }

    // Save cache
    await cacheManager.saveTimetableCache(freshData, authManager.getSessionCookies());

    const processedData = freshData.map(item => 
      timetableManager.processClassItem(item)
    );
    
    const timestamp = new Date().toISOString();
    
    res.status(200).json({ 
      success: true, 
      data: processedData, 
      cached: false,
      timestamp: timestamp,
      changes: changes.hasChanges ? changes.changes : null
    });
  } catch (error) {
    console.error('❌ Error refreshing timetable:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

app.get('/api/refresh', refreshHandler);
app.post('/api/refresh', refreshHandler);

app.get('/api/status', async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      status: 'running',
      version: process.env.PWA_VERSION || '1.9.4',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Serve index.html for all other routes
app.get('*', async (req, res) => {
  try {
    const indexPath = path.join(__dirname, '../public/index.html');
    res.sendFile(indexPath);
  } catch (error) {
    res.status(500).send('Error loading application');
  }
});

// Export for Vercel
module.exports = app;

// Start server for local development
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📱 API endpoints:`);
    console.log(`   - GET /api/timetable - Get cached timetable`);
    console.log(`   - GET /api/refresh - Fetch fresh timetable`);
    console.log(`   - GET /api/status - Server status`);
  });
}
