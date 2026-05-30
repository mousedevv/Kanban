import { $$ } from "../../../utils/dom/selectors.js";
import { dom } from "../dom.js";
import { projectService } from "../services/projectService.js";
import { columnService } from "../services/columnService.js";
import { taskService } from "../services/taskService.js";
import { Project } from "../types/project.js";
import { openAddTaskWindow } from "./windows/addTask.js";
import { openAddColumnWindow } from "./windows/addColumn.js";
import { openCreateProjectWindow } from "./windows/createProject.js";
import { openProjectSettingsWindow } from "./windows/projectSettings.js";

export const UI = {
    activeProject: null as Project | null,

    async init() {
        await projectService.initProjects();
        await this.draw(null);

        this.openHomeTab();
    },

    async draw(project: Project | null = null) {
        if (project) this.activeProject = project;

        await this.drawProjects(false);
        await this.updateWindows();
    },

    async drawProjects(showHomeTab = true) {
        await this.createProjectBtns(projectService.projects);
        await this.createDOMProjects(projectService.projects, showHomeTab);
    },

    async createProjectBtns(projects: Project[]) {
        dom.projectBtnWrapper.innerHTML = "";

        const homeBtn = document.createElement('button');
        homeBtn.classList.add('btn', 'openHomeBtn', 'animateOnHover');
        homeBtn.addEventListener('click', () => this.openHomeTab());

        const homeIcon = document.createElement('img');
        homeIcon.src = "../../../assets/img/home.png";
        homeIcon.alt = "Home";
        homeBtn.appendChild(homeIcon);

        dom.projectBtnWrapper.appendChild(homeBtn);

        projects.forEach(project => {
            const btn = document.createElement('button');
            btn.classList.add('btn', 'openProjectBtn', 'animateOnHover');
            btn.textContent = project.name;
            btn.addEventListener('click', () => this.changeOpenedProject(project));
            dom.projectBtnWrapper.appendChild(btn);
        });

        const addBtn = document.createElement('button');
        addBtn.classList.add('btn', 'addBtn', 'animateOnHover', 'addProjectBtn');
        addBtn.textContent = '+';
        addBtn.addEventListener('click', openCreateProjectWindow)

        dom.projectBtnWrapper.appendChild(addBtn);
    },

    async createDOMProjects(projects: Project[], showHomeTab = true) {
        dom.projectsWrapper.innerHTML = '';

        const home = document.createElement('div');
        home.classList.add('home');
        if (this.activeProject && !showHomeTab) {
            home.classList.add('hidden');
        }
        home.innerHTML = `
            <h1>Hello!</h1>
            <h2>Choose a project or...</h2>
            <h2>...create a new one to get started!</h2>
        `;
        dom.projectsWrapper.appendChild(home);

        projects.forEach(project => {
            const projectContent = document.createElement('div');
            projectContent.classList.add('projectContent');
            if (this.activeProject && this.activeProject.UUID !== project.UUID) {
                projectContent.classList.add('hidden');
            }
            projectContent.id = project.UUID;

            const projectHeader = document.createElement('div');
            projectHeader.classList.add('projectHeader');

            const projectName = document.createElement('h2');
            projectName.textContent = project.name;
            projectHeader.appendChild(projectName);

            // Open project settings btn
            const projectSettingsBtn = document.createElement('button');
            projectSettingsBtn.classList.add('projectSettingsBtn', 'flex', 'rotateOnHover');
            projectSettingsBtn.textContent = '⚙';

            projectSettingsBtn.addEventListener('click', openProjectSettingsWindow);
            

            projectHeader.appendChild(projectSettingsBtn);

            projectContent.appendChild(projectHeader);

            const colsWrapper = document.createElement('div');
            colsWrapper.classList.add('colsWrapper');

            project.columns.forEach(column => {
                const col = columnService.createDOMElement(column);
                column.tasks.forEach(task => {
                    const taskEl = taskService.createDOMElement(task);
                    col.appendChild(taskEl);
                });

                // Add "Add task" button to column
                const addTaskBtn = document.createElement('button');
                addTaskBtn.classList.add('addTaskBtn', 'addBtn', 'btn', 'animateOnHover');
                addTaskBtn.textContent = '+';
                addTaskBtn.addEventListener('click', () => {
                    openAddTaskWindow(column);
                });
                col.appendChild(addTaskBtn);

                colsWrapper.appendChild(col);
            });

            // Add "Add column" button to column wrapper
            const addColBtn = document.createElement('button');
            addColBtn.classList.add('addColBtn', 'addBtn', 'animateOnHover', 'btn');
            addColBtn.textContent = '+';
            addColBtn.addEventListener('click', openAddColumnWindow);

            colsWrapper.appendChild(addColBtn);
            projectContent.appendChild(colsWrapper);
            dom.projectsWrapper.appendChild(projectContent);
        });
    },

    openHomeTab() {
        const projects = $$(".projectContent");
        projects.forEach(projectContent => projectContent.classList.add('hidden'));
        const home = dom.projectsWrapper.querySelector('.home') as HTMLDivElement | null;
        home?.classList.remove('hidden');
    },

    changeOpenedProject(project: Project) {
        const projects = $$(".projectContent");
        projects.forEach(projectContent => {
            if (projectContent.id === project.UUID) {
                projectContent.classList.remove('hidden');
            } else {
                projectContent.classList.add('hidden');
            }
        });
        const home = dom.projectsWrapper.querySelector('.home') as HTMLDivElement | null;
        home?.classList.add('hidden');
        this.activeProject = project;
        this.updateWindows();
    },

    async updateWindows() {
        if (!this.activeProject) return;
        // await this.updateAddTaskWindow();
    },

    // Deprecated - now add task btn is column dependent
    // async updateAddTaskWindow() {
    //     if (!this.activeProject) {
    //         return;
    //     }
    //     dom.windows.addTask.column.innerHTML = "";
    //     this.activeProject.columns.forEach(column => {
    //         const option = document.createElement('option');
    //         option.value = column.id.toString();
    //         option.textContent = column.name;
    //         dom.windows.addTask.column.appendChild(option);
    //     });
    // },
};
