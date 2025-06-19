// SmartSecure.AI Application JavaScript
class SmartSecureApp {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.currentPage = 'dashboard';
        this.currentUser = null;
        this.cameras = [];
        this.users = [];
        this.activities = [];
        
        this.init();
    }

    init() {
        this.initTheme();
        this.initEventListeners();
        this.initLucideIcons();
        this.loadMockData();
        this.checkAuthState();
    }

    initTheme() {
        if (this.currentTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    initLucideIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    initEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Mobile menu
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Camera cards
        document.querySelectorAll('.camera-card').forEach(card => {
            card.addEventListener('click', (e) => this.handleCameraClick(e));
        });

        // Modal controls
        this.initModalControls();

        // Form submissions
        this.initFormHandlers();

        // User tab switching
        document.querySelectorAll('.user-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.handleUserTabSwitch(e));
        });

        // Window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    initModalControls() {
        const modalOverlay = document.getElementById('modal-overlay');
        const modalCloses = document.querySelectorAll('.modal-close');

        // Close modal on overlay click
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    this.closeModal();
                }
            });
        }

        // Close modal on close button click
        modalCloses.forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });

        // Add camera button
        const addCameraBtn = document.getElementById('add-camera-btn');
        if (addCameraBtn) {
            addCameraBtn.addEventListener('click', () => this.showModal('add-camera-modal'));
        }

        // Add user button
        const addUserBtn = document.getElementById('add-user-btn');
        if (addUserBtn) {
            addUserBtn.addEventListener('click', () => this.showModal('add-user-modal'));
        }
    }

    initFormHandlers() {
        // Add camera form
        const addCameraForm = document.getElementById('add-camera-form');
        if (addCameraForm) {
            addCameraForm.addEventListener('submit', (e) => this.handleAddCamera(e));
        }

        // Add user form
        const addUserForm = document.getElementById('add-user-form');
        if (addUserForm) {
            addUserForm.addEventListener('submit', (e) => this.handleAddUser(e));
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.currentTheme);
        this.initTheme();
        this.initLucideIcons();
    }

    toggleMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('-translate-x-full');
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
        const password = formData.get('password') || e.target.querySelector('input[type="password"]').value;

        // Simple validation (in real app, this would be server-side)
        if (email && password) {
            this.currentUser = {
                name: 'Alex Morgan',
                email: email,
                role: 'Administrator'
            };
            
            this.showApp();
            this.showNotification('Welcome back, ' + this.currentUser.name + '!', 'success');
        } else {
            this.showNotification('Please enter valid credentials', 'error');
        }
    }

    handleLogout() {
        this.currentUser = null;
        this.showLogin();
        this.showNotification('Logged out successfully', 'info');
    }

    showApp() {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('app-container').classList.remove('hidden');
        this.navigateToPage('dashboard');
    }

    showLogin() {
        document.getElementById('app-container').classList.add('hidden');
        document.getElementById('login-screen').classList.remove('hidden');
    }

    checkAuthState() {
        // In a real app, check for valid session/token
        const isLoggedIn = false; // Set to true for development
        if (isLoggedIn && this.currentUser) {
            this.showApp();
        } else {
            this.showLogin();
        }
    }

    handleNavigation(e) {
        e.preventDefault();
        const href = e.currentTarget.getAttribute('href');
        const page = href.replace('#', '');
        this.navigateToPage(page);
        
        // Close mobile menu if open
        const sidebar = document.getElementById('sidebar');
        if (window.innerWidth < 1024) {
            sidebar.classList.add('-translate-x-full');
        }
    }

    navigateToPage(page) {
        this.currentPage = page;
        
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
        
        // Show target page
        const targetPage = document.getElementById(page + '-page');
        if (targetPage) {
            targetPage.classList.remove('hidden');
            targetPage.classList.add('fade-in');
        }

        // Update navigation active state
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('nav-active');
            if (link.getAttribute('href') === '#' + page) {
                link.classList.add('nav-active');
            }
        });

        // Update page title
        this.updatePageTitle(page);
        
        // Load page-specific data
        this.loadPageData(page);
    }

    updatePageTitle(page) {
        const titles = {
            'dashboard': { title: 'Dashboard', subtitle: 'Overview of all security systems' },
            'cameras': { title: 'Camera Management', subtitle: 'Monitor and configure your cameras' },
            'access-management': { title: 'Access Management', subtitle: 'Manage users and permissions' },
            'history': { title: 'Activity History', subtitle: 'Complete log of all security events' },
            'reports': { title: 'Reports & Analytics', subtitle: 'Comprehensive security insights' },
            'settings': { title: 'Settings', subtitle: 'Configure system preferences' }
        };

        const pageInfo = titles[page] || { title: 'SmartSecure.AI', subtitle: 'AI-Powered Security Platform' };
        
        document.getElementById('page-title').textContent = pageInfo.title;
        document.getElementById('page-subtitle').textContent = pageInfo.subtitle;
    }

    loadPageData(page) {
        switch (page) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'cameras':
                this.loadCamerasData();
                break;
            case 'access-management':
                this.loadUsersData();
                break;
            case 'history':
                this.loadHistoryData();
                break;
            case 'reports':
                this.loadReportsData();
                break;
        }
    }

    loadDashboardData() {
        this.renderActivityTable();
    }

    loadCamerasData() {
        this.renderCamerasTable();
    }

    loadUsersData() {
        this.renderUsersTable();
    }

    loadHistoryData() {
        this.renderHistoryTable();
    }

    loadReportsData() {
        this.renderReportsTable();
        this.initCharts();
    }

    renderActivityTable() {
        const tbody = document.getElementById('activity-table');
        if (!tbody) return;

        const activities = this.activities.slice(0, 10); // Show latest 10
        
        tbody.innerHTML = activities.map(activity => `
            <tr class="table-row">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    ${activity.time}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    ${activity.camera}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <img src="${activity.avatar}" alt="${activity.user}" class="w-8 h-8 rounded-full mr-3">
                        <span class="text-sm text-gray-900 dark:text-gray-100">${activity.user}</span>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-medium rounded-full ${this.getStatusClass(activity.status)}">
                        ${activity.status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <button class="text-blue-600 dark:text-blue-400 hover:underline mr-3">View</button>
                    <button class="text-gray-600 dark:text-gray-400 hover:underline">Action</button>
                </td>
            </tr>
        `).join('');
    }

    renderCamerasTable() {
        const tbody = document.getElementById('cameras-table');
        if (!tbody) return;

        tbody.innerHTML = this.cameras.map(camera => `
            <tr class="table-row">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <img src="${camera.thumbnail}" alt="${camera.name}" class="w-12 h-12 rounded-lg mr-4">
                        <div>
                            <div class="text-sm font-medium text-gray-900 dark:text-gray-100">${camera.name}</div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">${camera.id}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    ${camera.location}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-medium rounded-full ${this.getStatusClass(camera.status)}">
                        ${camera.status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    ${camera.resolution}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <button class="text-blue-600 dark:text-blue-400 hover:underline mr-3">Configure</button>
                    <button class="text-gray-600 dark:text-gray-400 hover:underline">View Logs</button>
                </td>
            </tr>
        `).join('');
    }

    renderUsersTable() {
        const tbody = document.getElementById('users-table');
        if (!tbody) return;

        const activeTab = document.querySelector('.user-tab.active')?.dataset.tab || 'all';
        let filteredUsers = this.users;
        
        if (activeTab !== 'all') {
            filteredUsers = this.users.filter(user => 
                user.role.toLowerCase() === activeTab.slice(0, -1) // Remove 's' from 'employees'/'guests'
            );
        }

        tbody.innerHTML = filteredUsers.map(user => `
            <tr class="table-row">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <img src="${user.avatar}" alt="${user.name}" class="w-10 h-10 rounded-full mr-4">
                        <div>
                            <div class="text-sm font-medium text-gray-900 dark:text-gray-100">${user.name}</div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">${user.email}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-medium rounded-full ${this.getRoleClass(user.role)}">
                        ${user.role}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    ${user.department}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    ${user.lastAccess}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <button class="text-blue-600 dark:text-blue-400 hover:underline mr-3">Edit</button>
                    <button class="text-red-600 dark:text-red-400 hover:underline">Remove</button>
                </td>
            </tr>
        `).join('');
    }

    renderHistoryTable() {
        const tbody = document.getElementById('history-table');
        if (!tbody) return;

        tbody.innerHTML = this.activities.map(activity => `
            <tr class="table-row">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    ${activity.timestamp}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <img src="${activity.avatar}" alt="${activity.user}" class="w-8 h-8 rounded-full mr-3">
                        <span class="text-sm text-gray-900 dark:text-gray-100">${activity.user}</span>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    ${activity.camera}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    ${activity.event}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-medium rounded-full ${this.getStatusClass(activity.status)}">
                        ${activity.status}
                    </span>
                </td>
            </tr>
        `).join('');
    }

    renderReportsTable() {
        const tbody = document.getElementById('reports-table');
        if (!tbody) return;

        const reportData = [
            { metric: 'Total Detections', today: '247', week: '1,823', month: '7,456', trend: '+15%' },
            { metric: 'Unique Faces', today: '89', week: '456', month: '1,234', trend: '+8%' },
            { metric: 'Security Alerts', today: '3', week: '12', month: '45', trend: '-5%' },
            { metric: 'System Uptime', today: '100%', week: '99.8%', month: '99.9%', trend: '+0.1%' }
        ];

        tbody.innerHTML = reportData.map(row => `
            <tr class="table-row">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    ${row.metric}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    ${row.today}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    ${row.week}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    ${row.month}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm ${row.trend.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
                    ${row.trend}
                </td>
            </tr>
        `).join('');
    }

    initCharts() {
        // Detection Trends Chart
        const detectionCtx = document.getElementById('detection-chart');
        if (detectionCtx && typeof Chart !== 'undefined') {
            new Chart(detectionCtx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Detections',
                        data: [65, 59, 80, 81, 56, 55, 40],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: this.currentTheme === 'dark' ? '#374151' : '#f3f4f6'
                            },
                            ticks: {
                                color: this.currentTheme === 'dark' ? '#9ca3af' : '#6b7280'
                            }
                        },
                        x: {
                            grid: {
                                color: this.currentTheme === 'dark' ? '#374151' : '#f3f4f6'
                            },
                            ticks: {
                                color: this.currentTheme === 'dark' ? '#9ca3af' : '#6b7280'
                            }
                        }
                    }
                }
            });
        }

        // Performance Chart
        const performanceCtx = document.getElementById('performance-chart');
        if (performanceCtx && typeof Chart !== 'undefined') {
            new Chart(performanceCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Online', 'Offline', 'Maintenance'],
                    datasets: [{
                        data: [85, 10, 5],
                        backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: this.currentTheme === 'dark' ? '#9ca3af' : '#6b7280'
                            }
                        }
                    }
                }
            });
        }
    }

    handleCameraClick(e) {
        const cameraId = e.currentTarget.dataset.camera;
        if (cameraId) {
            this.showNotification(`Opening camera: ${cameraId}`, 'info');
            // In a real app, this would open a detailed camera view
        }
    }

    handleUserTabSwitch(e) {
        e.preventDefault();
        
        // Update active tab
        document.querySelectorAll('.user-tab').forEach(tab => tab.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        // Re-render users table with filter
        this.renderUsersTable();
    }

    showModal(modalId) {
        const overlay = document.getElementById('modal-overlay');
        const modal = document.getElementById(modalId);
        
        if (overlay && modal) {
            overlay.classList.remove('hidden');
            modal.classList.remove('hidden');
            modal.classList.add('fade-in');
        }
    }

    closeModal() {
        const overlay = document.getElementById('modal-overlay');
        const modals = document.querySelectorAll('.modal');
        
        if (overlay) {
            overlay.classList.add('hidden');
        }
        
        modals.forEach(modal => {
            modal.classList.add('hidden');
            modal.classList.remove('fade-in');
        });
    }

    handleAddCamera(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const newCamera = {
            id: 'CAM-' + Date.now(),
            name: formData.get('name') || e.target.querySelector('input[type="text"]').value,
            location: formData.get('location') || e.target.querySelectorAll('input[type="text"]')[1].value,
            ip: formData.get('ip') || e.target.querySelectorAll('input[type="text"]')[2].value,
            resolution: formData.get('resolution') || e.target.querySelector('select').value,
            status: 'Online',
            thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop'
        };

        this.cameras.push(newCamera);
        this.closeModal();
        this.showNotification('Camera added successfully!', 'success');
        
        if (this.currentPage === 'cameras') {
            this.renderCamerasTable();
        }
        
        e.target.reset();
    }

    handleAddUser(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const newUser = {
            id: 'USER-' + Date.now(),
            name: formData.get('name') || e.target.querySelector('input[type="text"]').value,
            email: formData.get('email') || e.target.querySelector('input[type="email"]').value,
            role: formData.get('role') || e.target.querySelector('select').value,
            department: formData.get('department') || e.target.querySelectorAll('input[type="text"]')[1].value,
            lastAccess: 'Just now',
            avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face`
        };

        this.users.push(newUser);
        this.closeModal();
        this.showNotification('User added successfully!', 'success');
        
        if (this.currentPage === 'access-management') {
            this.renderUsersTable();
        }
        
        e.target.reset();
    }

    handleResize() {
        // Handle responsive behavior
        const sidebar = document.getElementById('sidebar');
        if (window.innerWidth >= 1024) {
            sidebar.classList.remove('-translate-x-full');
        } else {
            sidebar.classList.add('-translate-x-full');
        }
    }

    getStatusClass(status) {
        const classes = {
            'Online': 'status-online',
            'Offline': 'status-offline',
            'Access Granted': 'status-online',
            'Access Denied': 'status-offline',
            'Suspicious': 'status-warning',
            'Warning': 'status-warning'
        };
        return classes[status] || 'status-warning';
    }

    getRoleClass(role) {
        const classes = {
            'Admin': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
            'Manager': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
            'Employee': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
            'Guest': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
        };
        return classes[role] || classes['Guest'];
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 translate-x-full`;
        
        const typeClasses = {
            'success': 'bg-green-500 text-white',
            'error': 'bg-red-500 text-white',
            'warning': 'bg-yellow-500 text-white',
            'info': 'bg-blue-500 text-white'
        };
        
        notification.className += ' ' + (typeClasses[type] || typeClasses['info']);
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    loadMockData() {
        // Mock cameras data
        this.cameras = [
            {
                id: 'CAM-001',
                name: 'Main Lobby',
                location: 'Ground Floor',
                status: 'Online',
                resolution: '4K',
                thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop'
            },
            {
                id: 'CAM-002',
                name: 'Main Entrance',
                location: 'Front Door',
                status: 'Online',
                resolution: '1080p',
                thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop'
            },
            {
                id: 'CAM-003',
                name: 'Parking Lot A',
                location: 'Outdoor',
                status: 'Online',
                resolution: '1080p',
                thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop'
            },
            {
                id: 'CAM-004',
                name: 'Rooftop Access',
                location: 'Level 5',
                status: 'Offline',
                resolution: '720p',
                thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop&sat=-100'
            }
        ];

        // Mock users data
        this.users = [
            {
                id: 'USER-001',
                name: 'John Smith',
                email: 'john.smith@company.com',
                role: 'Employee',
                department: 'Engineering',
                lastAccess: '2 hours ago',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
            },
            {
                id: 'USER-002',
                name: 'Sarah Johnson',
                email: 'sarah.j@company.com',
                role: 'Manager',
                department: 'Sales',
                lastAccess: '1 hour ago',
                avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
            },
            {
                id: 'USER-003',
                name: 'Mike Wilson',
                email: 'mike.wilson@visitor.com',
                role: 'Guest',
                department: 'External',
                lastAccess: '30 minutes ago',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
            },
            {
                id: 'USER-004',
                name: 'Emily Davis',
                email: 'emily.davis@company.com',
                role: 'Admin',
                department: 'IT',
                lastAccess: '5 minutes ago',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
            }
        ];

        // Mock activities data
        this.activities = [
            {
                id: 'ACT-001',
                time: '14:23',
                timestamp: '2025-01-15 14:23:45',
                camera: 'Main Entrance',
                user: 'John Smith',
                event: 'Face Detection',
                status: 'Access Granted',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
            },
            {
                id: 'ACT-002',
                time: '14:15',
                timestamp: '2025-01-15 14:15:32',
                camera: 'Main Lobby',
                user: 'Sarah Johnson',
                event: 'Face Detection',
                status: 'Access Granted',
                avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
            },
            {
                id: 'ACT-003',
                time: '14:08',
                timestamp: '2025-01-15 14:08:17',
                camera: 'Parking Lot A',
                user: 'Unknown Person',
                event: 'Face Detection',
                status: 'Suspicious',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
            },
            {
                id: 'ACT-004',
                time: '13:45',
                timestamp: '2025-01-15 13:45:22',
                camera: 'Main Entrance',
                user: 'Mike Wilson',
                event: 'Access Attempt',
                status: 'Access Denied',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
            },
            {
                id: 'ACT-005',
                time: '13:30',
                timestamp: '2025-01-15 13:30:11',
                camera: 'Main Lobby',
                user: 'Emily Davis',
                event: 'Face Detection',
                status: 'Access Granted',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
            }
        ];
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.smartSecureApp = new SmartSecureApp();
});