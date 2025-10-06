class TimetableApp {
    constructor() {
        this.timetableData = [];
        // Course data now handled by API
        this.currentFilter = 'all';
        this.deferredPrompt = null;
        this.currentClassData = null;
        this.autoRefreshInterval = null;
        this.darkMode = this.getDarkModePreference();
        
        this.initializeApp();
        this.bindEvents();
        this.initializeDarkMode();
    }

    initializeApp() {
        this.showLoadingScreen();
        this.loadTimetableData();
        this.setupPWAInstall();
        this.setupServiceWorkerUpdates();
        this.setupOneSignal();
        this.updateLastUpdateTime();
        
        // Check current class every minute
        setInterval(() => this.checkCurrentClass(), 60000);
        
        // Update "last updated" time every minute
        setInterval(() => this.updateLastUpdateTime(), 60000);
        
        // Auto refresh cached data every 10 seconds (just loads from cache)
        this.autoRefreshInterval = setInterval(() => {
            this.refreshTimetable(true); // true = silent auto refresh
        }, 10000);
    }

    bindEvents() {
        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.refreshTimetable();
        });

        // Day filter buttons
        document.querySelectorAll('.day-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setActiveFilter(e.target.dataset.day);
            });
        });

        // Dark mode toggle
        document.getElementById('darkModeBtn').addEventListener('click', () => {
            this.toggleDarkMode();
        });

        // Current class popup click
        document.getElementById('currentClass').addEventListener('click', () => {
            this.scrollToCurrentClass();
        });

        // Scroll event for minimizing current class popup
        let scrollTimeout;
        // Listen for scroll on both window and app container
        const handleScroll = () => {
            const currentClass = document.getElementById('currentClass');
            if (!currentClass.classList.contains('hidden')) {
                currentClass.classList.add('minimized');
                
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    currentClass.classList.remove('minimized');
                }, 2000); // Show full popup again after 2 seconds of no scrolling
            }
        };

        window.addEventListener('scroll', handleScroll);
        
        // Also listen for scroll on the app container (for desktop)
        const appContainer = document.getElementById('app');
        if (appContainer) {
            appContainer.addEventListener('scroll', handleScroll);
        }

        // Error modal
        document.getElementById('closeModal').addEventListener('click', () => {
            this.hideErrorModal();
        });

        document.getElementById('retryBtn').addEventListener('click', () => {
            this.hideErrorModal();
            this.refreshTimetable();
        });

        // Close modal on backdrop click
        document.getElementById('errorModal').addEventListener('click', (e) => {
            if (e.target.id === 'errorModal') {
                this.hideErrorModal();
            }
        });
    }

    async loadTimetableData(isAutoRefresh = false) {
        try {
            const response = await fetch('/api/timetable');
            
            // Handle 404 (no cache) gracefully
            if (response.status === 404) {
                console.log('📂 No cached data - user needs to refresh');
                if (!isAutoRefresh) {
                    this.hideLoadingScreen();
                    // Show empty state with instruction to refresh
                    this.timetableData = [];
                    this.renderTimetable();
                    this.updateStats();
                }
                return;
            }
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            // Handle consistent API response structure
            if (result.success && result.data) {
                this.timetableData = result.data;
                
                // Update last update time when API is called
                if (result.timestamp) {
                    this.updateLastUpdateTimeFromTimestamp(result.timestamp);
                }
            } else {
                throw new Error(result.error || result.message || 'Invalid response format');
            }
            
            // Only set today's filter on initial load, not auto refresh
            if (!isAutoRefresh) {
                const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                const todayBtn = document.querySelector(`[data-day="${today}"]`);
                if (todayBtn) {
                    // Set the filter before rendering to avoid the jump
                    this.currentFilter = today;
                    
                    // Update UI to show today is selected
                    document.querySelectorAll('.day-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    todayBtn.classList.add('active');
                    
                    // Scroll to show the active button (especially for Saturday)
                    setTimeout(() => {
                        todayBtn.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'nearest', 
                            inline: 'center' 
                        });
                    }, 100);
                }
            }
            
            this.renderTimetable();
            this.updateStats();
            
            if (!isAutoRefresh) {
                this.hideLoadingScreen();
            }
            
            // Check current class immediately after data loads
            this.checkCurrentClass();
            
        } catch (error) {
            console.error('Error loading timetable:', error);
            if (!isAutoRefresh) {
                this.hideLoadingScreen();
                this.showErrorModal('Failed to load timetable data. Please check your connection and try again.');
            }
        }
    }

    async refreshTimetable(isAutoRefresh = false) {
        const refreshBtn = document.getElementById('refreshBtn');
        
        if (!isAutoRefresh) {
            refreshBtn.classList.add('loading');
        }
        
        try {
            if (isAutoRefresh) {
                // Auto refresh uses cached data endpoint
                await this.loadTimetableData(isAutoRefresh);
            } else {
                // Manual refresh forces fresh data from UMS API
                console.log('🔄 Manual refresh - fetching fresh data from UMS...');
                const response = await fetch('/api/refresh', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                const result = await response.json();
                
                // Handle rate limit (429 status)
                if (response.status === 429 && result.rateLimited) {
                    const { minutes, seconds } = result.remainingTime;
                    const timeMessage = minutes > 0 
                        ? `${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds} second${seconds !== 1 ? 's' : ''}`
                        : `${seconds} second${seconds !== 1 ? 's' : ''}`;
                    
                    this.showRateLimitNotification(timeMessage, result.remainingTime.totalSeconds);
                    console.log(`⏱️ Rate limited: ${timeMessage} remaining`);
                    return;
                }
                
                if (!response.ok) {
                    throw new Error(result.message || 'Failed to refresh timetable');
                }
                
                if (result.sessionExpired) {
                    this.showErrorModal('Session expired. Please check your credentials in .env file');
                    return;
                }
                
                this.timetableData = result.data;
                this.updateStats();
                this.renderTimetable();
                
                // Update last update time when refresh is called
                if (result.timestamp) {
                    this.updateLastUpdateTimeFromTimestamp(result.timestamp);
                }
                this.checkCurrentClass();
                
                // Show success message briefly
                const originalText = refreshBtn.innerHTML;
                refreshBtn.innerHTML = '✅';
                refreshBtn.style.background = '#10b981';
                setTimeout(() => {
                    refreshBtn.innerHTML = originalText;
                    refreshBtn.style.background = '';
                }, 2000);
                
                console.log('✅ Manual refresh completed successfully');
            }
        } catch (error) {
            console.error('❌ Refresh failed:', error.message);
            this.showErrorModal(`Failed to refresh timetable: ${error.message}`);
        } finally {
            if (!isAutoRefresh) {
                refreshBtn.classList.remove('loading');
            }
        }
    }

    renderTimetable() {
        const container = document.getElementById('timetableContainer');
        container.innerHTML = '';

        // Group classes by day
        const dayGroups = this.groupClassesByDay();
        
        // Render each day
        Object.keys(dayGroups).forEach(day => {
            if (this.currentFilter === 'all' || this.currentFilter === day) {
                const daySection = this.createDaySection(day, dayGroups[day]);
                container.appendChild(daySection);
            }
        });

        if (container.children.length === 0) {
            container.innerHTML = this.createEmptyState();
        }
    }

    groupClassesByDay() {
        const groups = {};
        
        this.timetableData.forEach(classItem => {
            let day = classItem.Day;
            
            // Convert date format (DD-MM-YYYY) to weekday name
            if (day && day.includes('-') && day.match(/^\d{2}-\d{2}-\d{4}$/)) {
                const [dayNum, month, year] = day.split('-');
                const date = new Date(year, month - 1, dayNum);
                day = date.toLocaleDateString('en-US', { weekday: 'long' });
            }
            
            if (!groups[day]) {
                groups[day] = [];
            }
            groups[day].push(classItem);
        });

        // Sort classes within each day by time
        Object.keys(groups).forEach(day => {
            groups[day].sort((a, b) => {
                return a.timeRange.start - b.timeRange.start;
            });
        });

        return groups;
    }

    createDaySection(day, classes) {
        const section = document.createElement('div');
        section.className = 'day-section';
        
        // Create day header
        const header = document.createElement('div');
        header.className = 'day-header';
        header.innerHTML = `
            <span>${day}</span>
            <span class="day-count">${classes.length} ${classes.length === 1 ? 'class' : 'classes'}</span>
        `;
        
        // Create classes container
        const classesContainer = document.createElement('div');
        classesContainer.className = 'class-list';
        
        classes.forEach(classItem => {
            const classElement = this.createClassElement(classItem);
            classesContainer.appendChild(classElement);
        });
        
        section.appendChild(header);
        section.appendChild(classesContainer);
        
        return section;
    }

    createClassElement(classItem) {
        const element = document.createElement('div');
        
        // Use pre-parsed data from API
        const classInfo = classItem.parsedInfo;
        const buildingDisplay = classInfo.building && classInfo.building.toLowerCase() === 'assignment' 
            ? 'Online' 
            : classInfo.building;
        
        // Add class type to CSS classes
        element.className = `class-item ${classInfo.type.toLowerCase()}`;
        
        element.innerHTML = `
            <div class="class-header">
                <div class="class-time">${classItem.AttendanceTime}</div>
                <div class="class-info">
                    <div class="class-title">
                        <div class="course-code">${classInfo.course}</div>
                        <div class="course-name">${classInfo.courseName}</div>
                        <span class="class-type ${classInfo.type.toLowerCase()}">${classInfo.type}</span>
                    </div>
                </div>
            </div>
            <div class="class-details">
                ${classInfo.building && classInfo.roomNumber ? `<div class="class-detail highlight location">
                    <span class="class-detail-icon">🏢</span>
                    <div class="building-room-info">
                        <div class="building-info">
                            <div class="building-number">${buildingDisplay}</div>
                            <div class="building-label">Building</div>
                        </div>
                        <div class="location-separator"></div>
                        <div class="room-info">
                            <div class="room-number">${classInfo.roomNumber}</div>
                            <div class="room-label">Room</div>
                        </div>
                        ${classInfo.group ? `<div class="location-separator"></div>
                        <span class="group-inline-icon">👥</span>
                        <div class="group-inline-info">
                            <div class="group-number">${classInfo.group === 'All' ? 'ALL' : classInfo.group}</div>
                            <div class="group-label">Group</div>
                        </div>` : ''}
                    </div>
                </div>` : classInfo.room ? `<div class="class-detail highlight location">
                    <span class="class-detail-icon">📍</span>
                    <div class="building-room-info">
                        <div class="room-info">
                            <div class="room-number">${classInfo.room}</div>
                            <div class="room-label">Location</div>
                        </div>
                        ${classInfo.group ? `<div class="location-separator"></div>
                        <span class="group-inline-icon">👥</span>
                        <div class="group-inline-info">
                            <div class="group-number">${classInfo.group === 'All' ? 'ALL' : classInfo.group}</div>
                            <div class="group-label">Group</div>
                        </div>` : ''}
                    </div>
                </div>` : ''}
            </div>
        `;
        
        return element;
    }

    // Course data and parsing now handled by API

    updateStats() {
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        
        // Count today's classes (including date-based classes)
        const todayClasses = this.timetableData.filter(item => {
            let classDay = item.Day;
            
            // Convert date format (DD-MM-YYYY) to weekday name for comparison
            if (classDay && classDay.includes('-') && classDay.match(/^\d{2}-\d{2}-\d{4}$/)) {
                const [dayNum, month, year] = classDay.split('-');
                const date = new Date(year, month - 1, dayNum);
                classDay = date.toLocaleDateString('en-US', { weekday: 'long' });
            }
            
            return classDay === today;
        });
        
        document.getElementById('totalClasses').textContent = this.timetableData.length;
        document.getElementById('todayClasses').textContent = todayClasses.length;
    }

    setActiveFilter(day) {
        // Update active tab
        document.querySelectorAll('.day-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-day="${day}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            
            // Scroll to show the active button
            activeBtn.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest', 
                inline: 'center' 
            });
        }
        
        // Update filter and re-render
        this.currentFilter = day;
        this.renderTimetable();
    }

    checkCurrentClass() {
        const now = new Date();
        const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
        const currentTime = now.getHours() * 60 + now.getMinutes();

        console.log(`Checking upcoming classes - Day: ${currentDay}, Current time: ${Math.floor(currentTime/60)}:${String(currentTime%60).padStart(2,'0')} (${currentTime} mins)`);

        let upcomingClass = null;
        let upcomingClasses = [];

        // Get today's classes sorted by time (including date-based classes)
        const todayClasses = this.timetableData
            .filter(classItem => {
                let classDay = classItem.Day;
                
                // Convert date format (DD-MM-YYYY) to weekday name for comparison
                if (classDay && classDay.includes('-') && classDay.match(/^\d{2}-\d{2}-\d{4}$/)) {
                    const [dayNum, month, year] = classDay.split('-');
                    const date = new Date(year, month - 1, dayNum);
                    classDay = date.toLocaleDateString('en-US', { weekday: 'long' });
                }
                
                return classDay === currentDay;
            })
            .sort((a, b) => a.timeRange.start - b.timeRange.start);

        console.log(`Found ${todayClasses.length} classes for ${currentDay}:`);

        // Find only upcoming classes (rest of the day)
        upcomingClasses = todayClasses.filter(classItem => {
            const timeDiff = classItem.timeRange.start - currentTime;
            return timeDiff > 0; // Any class later today
        });
        
        if (upcomingClasses.length > 0) {
            upcomingClass = upcomingClasses[0]; // Next class
            console.log(`Found upcoming class: ${upcomingClass.AttendanceTime}`);
        }

        console.log(`Result - Upcoming: ${upcomingClass ? upcomingClass.AttendanceTime : 'None'}`);

        this.updateUpcomingClassIndicator(upcomingClass);
    }

    // Time parsing now handled by API

    updateUpcomingClassIndicator(upcomingClass) {
        const indicator = document.getElementById('currentClass');
        
        if (upcomingClass) {
            // Show upcoming class
            this.currentClassData = upcomingClass;
            const classInfo = upcomingClass.parsedInfo; // Use pre-parsed data from API
            
            // Calculate time until class starts
            const now = new Date();
            const currentTime = now.getHours() * 60 + now.getMinutes();
            const timeDiff = upcomingClass.timeRange.start - currentTime;
            const hoursUntil = Math.floor(timeDiff / 60);
            const minutesUntil = timeDiff % 60;
            
            let timeUntilText = '';
            if (hoursUntil > 0) {
                timeUntilText = `in ${hoursUntil}h ${minutesUntil}m`;
            } else {
                timeUntilText = `in ${minutesUntil}m`;
            }
            
            document.getElementById('currentClassName').textContent = 
                `${classInfo.courseName} - ${classInfo.type}`;
            document.getElementById('currentClassTime').textContent = 
                `${upcomingClass.AttendanceTime} (${timeUntilText})`;
            // Details: Building, Room, Group
            const buildingDisplay = (classInfo.building && classInfo.building.toLowerCase() === 'assignment') ? 'Online' : classInfo.building;
            const detailsEl = document.getElementById('currentClassDetails');
            if (detailsEl) {
                const parts = [];
                if (buildingDisplay || classInfo.roomNumber || classInfo.room) {
                    if (buildingDisplay && classInfo.roomNumber) {
                        parts.push(`<span class=\"cd-item\">
                            <span class=\"cd-icon\">🏢</span>
                            <span class=\"cd-block\">
                                <span class=\"cd-number\">${buildingDisplay}</span>
                                <span class=\"cd-label\">Building</span>
                            </span>
                        </span>`);
                        parts.push(`<span class=\"cd-item\">
                            <span class=\"cd-icon\">🚪</span>
                            <span class=\"cd-block\">
                                <span class=\"cd-number\">${classInfo.roomNumber}</span>
                                <span class=\"cd-label\">Room</span>
                            </span>
                        </span>`);
                    } else if (classInfo.room) {
                        parts.push(`<span class=\"cd-item\">
                            <span class=\"cd-icon\">📍</span>
                            <span class=\"cd-block\">
                                <span class=\"cd-number\">${classInfo.room}</span>
                                <span class=\"cd-label\">Location</span>
                            </span>
                        </span>`);
                    }
                }
                if (classInfo.group) {
                    parts.push(`<span class=\"cd-item\">
                        <span class=\"cd-icon\">👥</span>
                        <span class=\"cd-block\">
                            <span class=\"cd-number\">${classInfo.group === 'All' ? 'ALL' : classInfo.group}</span>
                            <span class=\"cd-label\">Group</span>
                        </span>
                    </span>`);
                }
                detailsEl.innerHTML = parts.join('');
            }
            
            // Update title and styling for upcoming class
            document.querySelector('.current-title').textContent = 'UPCOMING CLASS';
            indicator.className = 'current-class upcoming';
            indicator.classList.remove('hidden');
            
        } else {
            // No upcoming class
            this.currentClassData = null;
            indicator.classList.add('hidden');
        }
    }

    scrollToCurrentClass() {
        if (!this.currentClassData) return;
        
        // Add premium click animation to popup
        const indicator = document.getElementById('currentClass');
        indicator.style.transform = 'scale(0.95)';
        indicator.style.transition = 'transform 0.1s ease';
        
        setTimeout(() => {
            indicator.style.transform = '';
            indicator.style.transition = 'all 0.3s ease';
        }, 100);
        
        // First, make sure we're showing the current day
        const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        if (this.currentFilter !== currentDay) {
            this.setActiveFilter(currentDay);
        }
        
        // Wait a bit for rendering, then scroll to the class
        setTimeout(() => {
            const classTime = this.currentClassData.AttendanceTime;
            const classElements = document.querySelectorAll('.class-item');
            
            for (let element of classElements) {
                const timeElement = element.querySelector('.class-time');
                if (timeElement && timeElement.textContent === classTime) {
                    element.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                    
                    // Premium highlight animation
                    element.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                    element.style.transform = 'scale(1.05) translateY(-5px)';
                    element.style.boxShadow = '0 15px 35px rgba(99, 102, 241, 0.4), 0 5px 15px rgba(0, 0, 0, 0.1)';
                    element.style.borderLeftWidth = '6px';
                    element.style.zIndex = '10';
                    
                    // Pulse effect
                    setTimeout(() => {
                        element.style.transform = 'scale(1.02) translateY(-2px)';
                    }, 300);
                    
                    setTimeout(() => {
                        element.style.transform = 'scale(1.05) translateY(-5px)';
                    }, 600);
                    
                    // Return to normal
                    setTimeout(() => {
                        element.style.transition = 'all 0.5s ease';
                        element.style.transform = '';
                        element.style.boxShadow = '';
                        element.style.borderLeftWidth = '';
                        element.style.zIndex = '';
                    }, 2500);
                    
                    break;
                }
            }
        }, 300);
    }

    createEmptyState() {
        // Check if there's any data at all
        if (!this.timetableData || this.timetableData.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-state-icon">🎓</div>
                    <h3>No Timetable Data</h3>
                    <p>Click the refresh button (🔄) above to fetch your timetable.</p>
                    <p style="font-size: 0.9em; color: #666; margin-top: 10px;">
                        First load may take 15-20 seconds while we authenticate and fetch your schedule.
                    </p>
                </div>
            `;
        }
        
        return `
            <div class="empty-state">
                <div class="empty-state-icon">📅</div>
                <h3>No classes found</h3>
                <p>No classes scheduled for the selected day.</p>
            </div>
        `;
    }

    showLoadingScreen() {
        document.getElementById('loadingScreen').style.display = 'flex';
        document.getElementById('app').classList.add('hidden');
    }

    hideLoadingScreen() {
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('app').classList.remove('hidden');
    }

    showErrorModal(message) {
        document.getElementById('errorMessage').textContent = message;
        document.getElementById('errorModal').classList.remove('hidden');
    }

    hideErrorModal() {
        document.getElementById('errorModal').classList.add('hidden');
    }

    // PWA Functions
    setupPWAInstall() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            // Could add install button here if needed
        });

        window.addEventListener('appinstalled', () => {
            this.deferredPrompt = null;
            console.log('PWA installed successfully');
        });
    }

    async installPWA() {
        if (!this.deferredPrompt) return;

        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('PWA installed');
        }
        
        this.deferredPrompt = null;
    }

    // Dark Mode Functions
    getDarkModePreference() {
        const stored = localStorage.getItem('darkMode');
        if (stored !== null) {
            return stored === 'true';
        }
        // Default to system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    initializeDarkMode() {
        // Apply dark mode immediately
        this.applyDarkMode();
        
        // Update button state immediately - no delay to prevent flicker
        this.updateDarkModeButton();
        
        // Listen for system dark mode changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            const stored = localStorage.getItem('darkMode');
            if (stored === null) { // Only auto-switch if user hasn't manually set preference
                this.darkMode = e.matches;
                this.applyDarkMode();
                this.updateDarkModeButton();
            }
        });
    }

    applyDarkMode() {
        if (this.darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    toggleDarkMode() {
        this.darkMode = !this.darkMode;
        localStorage.setItem('darkMode', this.darkMode.toString());
        this.applyDarkMode();
        this.updateDarkModeButton();
    }

    updateDarkModeButton() {
        const btn = document.getElementById('darkModeBtn');
        if (btn) {
            btn.textContent = this.darkMode ? '☀️' : '🌙';
            btn.title = this.darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        } else {
            // If button not ready, try again after a short delay
            setTimeout(() => {
                const retryBtn = document.getElementById('darkModeBtn');
                if (retryBtn) {
                    retryBtn.textContent = this.darkMode ? '☀️' : '🌙';
                    retryBtn.title = this.darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
                }
            }, 50);
        }
    }

    setupServiceWorkerUpdates() {
        if ('serviceWorker' in navigator) {
            // Check if this is first install
            const isFirstInstall = !localStorage.getItem('pwa-installed');
            
            // Listen for service worker updates (silent updates)
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'SW_UPDATED') {
                    // Silent update - just log it
                    console.log('App updated silently');
                }
            });

            // Mark as installed after first load
            if (isFirstInstall) {
                localStorage.setItem('pwa-installed', 'true');
            }

            // Check for updates every 30 minutes (less frequent)
            setInterval(() => {
                navigator.serviceWorker.ready.then((registration) => {
                    registration.update();
                });
            }, 30 * 60 * 1000);
        }
    }

    setupOneSignal() {
        // OneSignal is already initialized in HTML
        // Add any custom OneSignal logic here
        
        if (window.OneSignal) {
            // Set user properties for better targeting
            OneSignal.setExternalUserId(localStorage.getItem('lpu-username') || 'anonymous');
            
            // Listen for subscription changes
            OneSignal.on('subscriptionChange', (isSubscribed) => {
                console.log('OneSignal subscription changed:', isSubscribed);
                if (isSubscribed) {
                    this.showUpdateNotification('🔔 You will now receive timetable updates!');
                }
            });
            
            // Send custom tags for better notification targeting
            OneSignal.sendTags({
                'app_version': '1.9.4',
                'user_type': 'student',
                'platform': 'pwa'
            });
            
            // Check if user is subscribed
            OneSignal.getUserId().then(userId => {
                if (userId) {
                    console.log('OneSignal User ID:', userId);
                    this.showUpdateNotification('🔔 Push notifications enabled!');
                } else {
                    console.log('OneSignal: User not subscribed');
                }
            });
        }
    }

    showUpdateNotification(message) {
        // Remove any existing notifications first
        this.removeExistingNotifications();
        
        // Create update notification
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <div class="update-icon">✅</div>
                <div class="update-text">
                    <div class="update-title">App Updated!</div>
                    <div class="update-message">${message}</div>
                </div>
                <button class="update-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }


    removeExistingNotifications() {
        // Remove any existing update notifications
        const existingNotifications = document.querySelectorAll('.update-notification');
        existingNotifications.forEach(notification => {
            notification.remove();
        });
    }

    showRateLimitNotification(timeMessage, totalSeconds) {
        // Remove any existing notifications
        this.removeExistingNotifications();
        
        const notification = document.createElement('div');
        notification.className = 'update-notification rate-limit-notification';
        notification.innerHTML = `
            <div class="update-content">
                <div class="update-icon">⏱️</div>
                <div class="update-text">
                    <div class="update-title">⚠️ Please Wait</div>
                    <div class="update-message">You can refresh again in <strong id="countdown">${timeMessage}</strong></div>
                </div>
                <button class="update-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Countdown timer
        let remainingSeconds = totalSeconds;
        const countdownInterval = setInterval(() => {
            remainingSeconds--;
            
            if (remainingSeconds <= 0) {
                clearInterval(countdownInterval);
                if (notification.parentElement) {
                    notification.remove();
                }
                return;
            }
            
            const minutes = Math.floor(remainingSeconds / 60);
            const seconds = remainingSeconds % 60;
            
            // Format time nicely
            let timeText;
            if (minutes > 0) {
                timeText = `${minutes}:${seconds.toString().padStart(2, '0')} min`;
            } else {
                timeText = `${seconds} sec`;
            }
            
            const countdownElement = notification.querySelector('#countdown');
            if (countdownElement) {
                countdownElement.textContent = timeText;
            }
        }, 1000);
        
        // Auto remove after countdown + 2 seconds
        setTimeout(() => {
            clearInterval(countdownInterval);
            if (notification.parentElement) {
                notification.remove();
            }
        }, (totalSeconds + 2) * 1000);
    }

    updateLastUpdateTimeFromTimestamp(timestamp) {
        try {
            const lastUpdate = new Date(timestamp);
            const now = new Date();
            const diffMs = now - lastUpdate;
            
            let timeString;
            if (diffMs < 60000) { // Less than 1 minute
                timeString = 'Just now';
            } else if (diffMs < 3600000) { // Less than 1 hour
                const minutes = Math.floor(diffMs / 60000);
                timeString = `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
            } else if (diffMs < 86400000) { // Less than 1 day
                const hours = Math.floor(diffMs / 3600000);
                timeString = `${hours} hour${hours !== 1 ? 's' : ''} ago`;
            } else {
                const days = Math.floor(diffMs / 86400000);
                timeString = `${days} day${days !== 1 ? 's' : ''} ago`;
            }
            
            const lastUpdateElement = document.getElementById('lastUpdateTime');
            if (lastUpdateElement) {
                lastUpdateElement.textContent = timeString;
            }
        } catch (error) {
            console.error('Error updating last update time:', error);
        }
    }

    async updateLastUpdateTime() {
        try {
            const response = await fetch('/api/timetable');
            const data = await response.json();
            
            if (data.success && data.timestamp) {
                this.updateLastUpdateTimeFromTimestamp(data.timestamp);
            }
        } catch (error) {
            console.error('Error updating last update time:', error);
            const lastUpdateElement = document.getElementById('lastUpdateTime');
            if (lastUpdateElement) {
                lastUpdateElement.textContent = 'Unknown';
            }
        }
    }

}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TimetableApp();
});

// Handle PWA display mode
if (window.matchMedia('(display-mode: standalone)').matches) {
    document.body.classList.add('pwa-installed');
}
