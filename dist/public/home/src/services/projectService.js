import { columnService } from "./columnService.js";
import { taskService } from "./taskService.js";
// import { subtaskService } from "./subtaskService.js";
import { notification } from "../../../utils/notification.js";
import { $, $$ } from "../dom/selectors.js";
const dom = {
    projectBtnWrapper: $(".projectBtnWrapper"),
    projectsWrapper: $(".projectsWrapper"),
    homeTab: $(".home"),
};
export const projectService = {
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
            notification("Something went wrong - try again later!", "error");
            throw new Error("Something went wrong - try again later!");
        }
    },
    async initProjects() {
        const projects = await this.getProjects();
        this.createProjectBtns(projects);
        this.createDOMProjects(projects);
    },
    createProjectBtns(projects) {
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
    changeOpenedProject(project) {
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
    createDOMProjects(projects) {
        projects.forEach(project => {
            const projectContent = document.createElement('div');
            projectContent.classList.add('projectContent', 'hidden');
            projectContent.id = project.UUID;
            const projectHeader = document.createElement('div');
            projectHeader.classList.add('projectHeader');
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
            project.columns.forEach((column) => {
                const col = columnService.createDOMElement(column);
                column.tasks.forEach((task) => {
                    const taskEl = taskService.createDOMElement(task);
                    col.appendChild(taskEl);
                });
                colsWrapper.appendChild(col);
            });
            projectContent.appendChild(colsWrapper);
            dom.projectsWrapper.appendChild(projectContent);
        });
    }
};
//# sourceMappingURL=projectService.js.map