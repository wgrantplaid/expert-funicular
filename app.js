class ProjectsCalendar {
    constructor() {
        this.currentDate = new Date();
        this.projects = this.loadProjects();
        this.editingProjectId = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        // Calendar navigation
        document.getElementById('prevBtn').addEventListener('click', () => this.previousMonth());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextMonth());
        document.getElementById('todayBtn').addEventListener('click', () => this.goToToday());

        // Project modal
        document.getElementById('newProjectBtn').addEventListener('click', () => this.openProjectModal());
        document.getElementById('projectForm').addEventListener('submit', (e) => this.saveProject(e));
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => this.closeModal(e));
        });
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());
    }

    render() {
        this.renderCalendarHeader();
        this.renderCalendar();
        this.renderProjectsList();
    }

    renderCalendarHeader() {
        const options = { month: 'long', year: 'numeric' };
        document.getElementById('monthYear').textContent = this.currentDate.toLocaleDateString('en-US', options);
    }

    renderCalendar() {
        const calendar = document.getElementById('calendar');
        calendar.innerHTML = '';

        // Day headers
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNames.forEach(day => {
            const header = document.createElement('div');
            header.className = 'calendar-day-header';
            header.textContent = day;
            calendar.appendChild(header);
        });

        // Get first day of month and number of days
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        // Previous month days
        const prevMonthLastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 0).getDate();
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const dayElement = this.createDayElement(prevMonthLastDay - i, true);
            calendar.appendChild(dayElement);
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
            const dayElement = this.createDayElement(day, false, date);
            calendar.appendChild(dayElement);
        }

        // Next month days
        const remainingDays = 42 - (startingDayOfWeek + daysInMonth);
        for (let day = 1; day <= remainingDays; day++) {
            const dayElement = this.createDayElement(day, true);
            calendar.appendChild(dayElement);
        }
    }

    createDayElement(day, isOtherMonth, date = null) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';

        if (isOtherMonth) {
            dayElement.classList.add('other-month');
        }

        if (date) {
            const today = new Date();
            if (date.toDateString() === today.toDateString()) {
                dayElement.classList.add('today');
            }
        }

        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayElement.appendChild(dayNumber);

        const dayProjects = document.createElement('div');
        dayProjects.className = 'day-projects';

        if (date && !isOtherMonth) {
            const activeProjects = this.getProjectsForDate(date);
            activeProjects.forEach(project => {
                const projectBar = document.createElement('div');
                projectBar.className = 'project-bar';
                projectBar.style.backgroundColor = project.color;
                projectBar.textContent = project.name;
                projectBar.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.openDayModal(date);
                });
                dayProjects.appendChild(projectBar);
            });

            dayElement.addEventListener('click', () => this.openDayModal(date));
        }

        dayElement.appendChild(dayProjects);
        return dayElement;
    }

    getProjectsForDate(date) {
        return this.projects.filter(project => {
            const projectStart = new Date(project.startDate);
            const projectEnd = new Date(project.endDate);
            return date >= projectStart && date <= projectEnd;
        });
    }

    renderProjectsList() {
        const list = document.getElementById('projectsList');
        list.innerHTML = '';

        const sortedProjects = [...this.projects].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

        if (sortedProjects.length === 0) {
            list.innerHTML = '<p style="padding: 20px; text-align: center; color: #7f8c8d;">No projects yet</p>';
            return;
        }

        sortedProjects.forEach(project => {
            const item = document.createElement('div');
            item.className = `project-item ${project.status}`;

            const name = document.createElement('div');
            name.className = 'project-item-name';
            name.textContent = project.name;

            const dates = document.createElement('div');
            dates.className = 'project-item-date';
            dates.textContent = `${this.formatDate(project.startDate)} - ${this.formatDate(project.endDate)}`;

            const status = document.createElement('div');
            status.className = 'project-item-status';
            status.textContent = this.capitalizeStatus(project.status);

            item.appendChild(name);
            item.appendChild(dates);
            item.appendChild(status);

            item.addEventListener('click', () => this.editProject(project.id));
            item.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.deleteProject(project.id);
            });

            list.appendChild(item);
        });
    }

    openProjectModal() {
        this.editingProjectId = null;
        document.getElementById('modalTitle').textContent = 'New Project';
        document.getElementById('projectForm').reset();
        document.getElementById('projectColor').value = '#3498db';
        document.getElementById('projectModal').classList.add('active');
    }

    editProject(id) {
        const project = this.projects.find(p => p.id === id);
        if (!project) return;

        this.editingProjectId = id;
        document.getElementById('modalTitle').textContent = 'Edit Project';
        document.getElementById('projectName').value = project.name;
        document.getElementById('projectDesc').value = project.description;
        document.getElementById('projectStart').value = project.startDate;
        document.getElementById('projectEnd').value = project.endDate;
        document.getElementById('projectStatus').value = project.status;
        document.getElementById('projectColor').value = project.color;
        document.getElementById('projectModal').classList.add('active');
    }

    saveProject(e) {
        e.preventDefault();

        const name = document.getElementById('projectName').value.trim();
        const description = document.getElementById('projectDesc').value.trim();
        const startDate = document.getElementById('projectStart').value;
        const endDate = document.getElementById('projectEnd').value;
        const status = document.getElementById('projectStatus').value;
        const color = document.getElementById('projectColor').value;

        if (!name || !startDate || !endDate) {
            alert('Please fill in all required fields');
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            alert('Start date must be before end date');
            return;
        }

        if (this.editingProjectId) {
            const project = this.projects.find(p => p.id === this.editingProjectId);
            if (project) {
                project.name = name;
                project.description = description;
                project.startDate = startDate;
                project.endDate = endDate;
                project.status = status;
                project.color = color;
            }
        } else {
            const newProject = {
                id: Date.now().toString(),
                name,
                description,
                startDate,
                endDate,
                status,
                color
            };
            this.projects.push(newProject);
        }

        this.saveProjects();
        this.closeModal();
        this.render();
    }

    deleteProject(id) {
        if (confirm('Are you sure you want to delete this project?')) {
            this.projects = this.projects.filter(p => p.id !== id);
            this.saveProjects();
            this.render();
        }
    }

    openDayModal(date) {
        const projects = this.getProjectsForDate(date);
        const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
        document.getElementById('dayModalTitle').textContent = date.toLocaleDateString('en-US', options);

        const list = document.getElementById('dayProjectsList');
        list.innerHTML = '';

        if (projects.length === 0) {
            list.innerHTML = '<p style="text-align: center; color: #7f8c8d;">No projects on this date</p>';
        } else {
            projects.forEach(project => {
                const projectDiv = document.createElement('div');
                projectDiv.className = 'day-project';
                projectDiv.style.borderLeftColor = project.color;

                const name = document.createElement('div');
                name.className = 'day-project-name';
                name.textContent = project.name;

                const desc = document.createElement('div');
                desc.className = 'day-project-desc';
                desc.textContent = project.description || 'No description';

                const status = document.createElement('span');
                status.className = 'day-project-status';
                status.textContent = this.capitalizeStatus(project.status);

                const actions = document.createElement('div');
                actions.className = 'project-actions';
                actions.innerHTML = `
                    <button class="btn btn-primary" onclick="calendar.editProject('${project.id}')">Edit</button>
                    <button class="btn btn-danger" onclick="calendar.deleteProject('${project.id}')">Delete</button>
                `;

                projectDiv.appendChild(name);
                projectDiv.appendChild(desc);
                projectDiv.appendChild(status);
                projectDiv.appendChild(actions);

                list.appendChild(projectDiv);
            });
        }

        document.getElementById('dayModal').classList.add('active');
    }

    closeModal(e) {
        if (e) e.target.closest('.modal').classList.remove('active');
        else {
            document.getElementById('projectModal').classList.remove('active');
            document.getElementById('dayModal').classList.remove('active');
        }
    }

    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.render();
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.render();
    }

    goToToday() {
        this.currentDate = new Date();
        this.render();
    }

    saveProjects() {
        localStorage.setItem('projects', JSON.stringify(this.projects));
    }

    loadProjects() {
        const stored = localStorage.getItem('projects');
        if (stored) {
            return JSON.parse(stored);
        }
        return this.getDefaultProjects();
    }

    getDefaultProjects() {
        const today = new Date();
        const getDate = (daysOffset) => new Date(today.getTime() + daysOffset * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        return [
            {
                id: '1',
                name: 'Website Redesign',
                description: 'Complete redesign of company website',
                startDate: getDate(-10),
                endDate: getDate(15),
                status: 'on-track',
                color: '#3498db'
            },
            {
                id: '2',
                name: 'Mobile App Launch',
                description: 'Launch new mobile application',
                startDate: getDate(5),
                endDate: getDate(35),
                status: 'at-risk',
                color: '#e74c3c'
            },
            {
                id: '3',
                name: 'Q2 Marketing Campaign',
                description: 'Social media and email marketing',
                startDate: getDate(-5),
                endDate: getDate(25),
                status: 'on-track',
                color: '#27ae60'
            },
            {
                id: '4',
                name: 'API Integration',
                description: 'Integrate third-party APIs',
                startDate: getDate(-20),
                endDate: getDate(-2),
                status: 'completed',
                color: '#95a5a6'
            }
        ];
    }

    formatDate(dateString) {
        const options = { month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    capitalizeStatus(status) {
        return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
}

// Initialize calendar
const calendar = new ProjectsCalendar();