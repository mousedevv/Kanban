import { Project } from "../types/project.js";
import { Column } from "../types/column.js";
import { Task } from "../types/task.js";
import { Subtask } from "../types/subtask.js";
import { ProjectRole, ProjectsPacket } from "../types/types.js";

import { columnService } from "./columnService.js";
import { taskService } from "./taskService.js";
// import { subtaskService } from "./subtaskService.js";

import { notification } from "../../../utils/notification.js";

import { $, $$ } from "../../../utils/dom/selectors.js";
import { UI } from "../UI/UI.js";

const dom = {
    projectBtnWrapper: $(".projectBtnWrapper")! as HTMLDivElement,
    projectsWrapper: $(".projectsWrapper")! as HTMLDivElement,
    homeTab: $(".home")! as HTMLDivElement,
}

export const projectService = {
    projects: [] as Project[],

    async getProjects() {
        try {
            const res = await fetch(window.location.origin + "/api/get-all-projects", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();
            return data;
        }
        catch (e) {
            // DEBUG - disable notification for development
            // notification("Something went wrong - try again later!", "error");
            throw new Error("Something went wrong - try again later!");
        }
    },

    async initProjects() {
        const [ projects, roles ] = await this.getProjects();
        
        this.projects = projects;

        this.createProjectBtns(this.projects, roles);
        this.createDOMProjects(this.projects, roles);
    },

    createProjectBtns(projects: Project[], roles: ProjectRole[]) {
        const btn = document.createElement('button');

        btn.classList.add('btn', "openHomeBtn");

        btn.addEventListener('click', () => {
            this.openHomeTab();
        });

        const homeIcon = document.createElement('img');
        homeIcon.src = "../../../assets/img/home.png";
        homeIcon.alt = "Home";

        btn.appendChild(homeIcon);

        dom.projectBtnWrapper.appendChild(btn);

        projects.forEach(project => {
            const btn = document.createElement('button');
            btn.classList.add('btn', "openProjectBtn");
            btn.textContent = project.name;

            btn.addEventListener('click', () => {
                this.changeOpenedProject(project);
            });

            dom.projectBtnWrapper.appendChild(btn);
        });
    },

    createDOMProjects(projects: Project[], roles: ProjectRole[]) {
        projects.forEach(project => {
            const projectContent = document.createElement('div');
            projectContent.classList.add(
                'projectContent',
                'hidden'
            );
            projectContent.id = project.UUID;

            const projectHeader = document.createElement('div');
            projectHeader.classList.add(
                'projectHeader', 
            );

            const projectName = document.createElement('h2');
            projectName.textContent = project.name;
            projectHeader.appendChild(projectName);

            const addTaskBtn = document.createElement('button');
            addTaskBtn.classList.add('addTaskBtn');
            addTaskBtn.textContent = 'Add task';
            addTaskBtn.addEventListener('click', () => {
                // DEBUG
                console.log("[PLACEHOLDER] Add task to project: " + project.name);
            });
            projectHeader.appendChild(addTaskBtn);

            projectContent.appendChild(projectHeader);

            const colsWrapper = document.createElement('div');
            colsWrapper.classList.add('colsWrapper');

            project.columns.forEach((column: Column) => {
                const col = columnService.createDOMElement(column);

                column.tasks.forEach((task: Task) => {
                    const taskEl = taskService.createDOMElement(task);
                    col.appendChild(taskEl);
                });

                colsWrapper.appendChild(col);
            });

            projectContent.appendChild(colsWrapper);

            dom.projectsWrapper.appendChild(projectContent);
        });
    },

    openHomeTab() {
        // Select all project wrappers
        const projects = $$(".projectContent");
        projects.forEach(projectContent => {
            projectContent.classList.add('hidden');
        });

        // Show home tab only
        dom.homeTab.classList.remove('hidden');
    },

    changeOpenedProject(project: Project) {
        const projects = $$(".projectContent");
        projects.forEach(projectContent => {
            if (projectContent.id === project.UUID) {
                projectContent.classList.remove('hidden');
            }
            else {
                projectContent.classList.add('hidden');
            }
        });
        dom.homeTab.classList.add('hidden');

        UI.updateWindows(project);
    },
};