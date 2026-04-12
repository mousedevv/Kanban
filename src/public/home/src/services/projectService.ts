import { Project } from "../types/project.js";
import { Column } from "../types/column.js";
import { Task } from "../types/task.js";
import { Subtask } from "../types/subtask.js";

import { columnService } from "./columnService.js";
import { taskService } from "./taskService.js";
// import { subtaskService } from "./subtaskService.js";

import { notification } from "../../../utils/notification.js";

import { $, $$ } from "../dom/selectors.js";

const dom = {
    projectBtnWrapper: $(".projectBtnWrapper")! as HTMLDivElement,
    projectsWrapper: $(".projectsWrapper")! as HTMLDivElement,
    homeTab: $(".home")! as HTMLDivElement,
}

export const projectService = {
    async getProjects() {
        try {
            const res = await fetch(window.location.origin + "/api/projects", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();
            return data;
        }
        catch (e) {
            notification("Something went wrong - try again later!", "error");
            throw new Error("Something went wrong - try again later!");
        }
    },

    async initProjects(projects: Project[]) {
        // Disabled for DEBUG
        // const projects: Project[] = await this.getProjects();

        this.createProjectBtns(projects);
        this.createDOMProjects(projects);
    },

    createProjectBtns(projects: Project[]) {
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
    },

    createDOMProjects(projects: Project[]) {
        projects.forEach(project => {
            const projectContent = document.createElement('div');
            projectContent.classList.add(
                'projectContent',
                'hidden'
            );
            projectContent.id = project.UUID;

            project.columns.forEach((column: Column) => {
                const col = columnService.createDOMElement(column);

                column.tasks.forEach((task: Task) => {
                    const taskEl = taskService.createDOMElement(task);
                    col.appendChild(taskEl);
                });

                projectContent.appendChild(col);
            });

            dom.projectsWrapper.appendChild(projectContent);
        })



    }
};