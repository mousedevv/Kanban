import { Project } from "../types/project.js";
import { Column } from "../types/column.js";
import { Task } from "../types/task.js";
import { Subtask } from "../types/subtask.js";
import { ProjectRole, ProjectsPacket } from "../types/types.js";

import { columnService } from "./columnService.js";
import { taskService } from "./taskService.js";
// import { subtaskService } from "./subtaskService.js";

import { notification } from "../../../utils/notification.js";

import { dom } from "../home.js";

import { $, $$ } from "../../../utils/dom/selectors.js";
import { UI } from "../UI/UI.js";

const localDom = {
    projectBtnWrapper: $(".projectBtnWrapper")! as HTMLDivElement,
    projectsWrapper: $(".projectsWrapper")! as HTMLDivElement,
    homeTab: $(".home")! as HTMLDivElement,
}

export const projectService = {
    projects: [] as Project[],

    /*
  [
    {
      "id": 1,
      "UUID": "1e74c082-61d7-4c89-a2bf-8766b6fb4751",
      "name": "TEST PROJECT",
      "description": "Description of the test project",
      "created_at": "2026-04-08T19:22:09.000Z",
      "columns": [
        {
          "id": 5,
          "project_id": 1,
          "name": "Test Column 1",
          "tasks": [
            {
              "id": 2,
              "project_id": 1,
              "column_id": 5,
              "name": "Task 1 Col 1",
              "description": "Task 1 Col 1 description",
              "done": true,
              "label_id": null,
              "created_at": "2026-04-08T19:26:41.000Z",
              "subtasks": [
                {
                  "id": 1,
                  "task_id": 2,
                  "name": "Subtask 1 Task 1 Col 1",
                  "done": 0,
                  "created_at": "2026-04-08T19:29:14.000Z"
                }
              ]
            }
          ]
        },
        {
          "id": 6,
          "project_id": 1,
          "name": "Test Column 2",
          "tasks": [
            {
              "id": 3,
              "project_id": 1,
              "column_id": 6,
              "name": "Task 1 Col 2",
              "description": "Task 1 Col 2 description",
              "done": false,
              "label_id": 1,
              "created_at": "2026-04-08T19:26:41.000Z",
              "subtasks": [
                {
                  "id": 2,
                  "task_id": 3,
                  "name": "Subtask 1 Task 1 Col 2",
                  "done": 1,
                  "created_at": "2026-04-08T19:29:14.000Z"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
    */

    getColumnById(id: number): Column | void {
        return this.projects
            .map(project => project.columns)
            .flat(1)
            .find(col => col.id === id)
    },

    async getProjects() {
        try {
            const res = await fetch(window.location.origin + "/api/project/get-all-projects", {
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
            return;
        }
    },

    async drawProjects(showHomeTab = true, activeProject: Project | null = null) {
        await this.createProjectBtns(this.projects);
        await this.createDOMProjects(this.projects, showHomeTab, activeProject);
    },

    async initProjects() {
        const projects = await this.getProjects();

        this.projects = projects;

        await this.drawProjects();
    },

    async createProjectBtns(projects: Project[]) {
        // Reset project buttons
        localDom.projectBtnWrapper.innerHTML = "";

        const btn = document.createElement('button');

        btn.classList.add('btn', "openHomeBtn");

        btn.addEventListener('click', () => {
            this.openHomeTab();
        });

        const homeIcon = document.createElement('img');
        homeIcon.src = "../../../assets/img/home.png";
        homeIcon.alt = "Home";

        btn.appendChild(homeIcon);

        localDom.projectBtnWrapper.appendChild(btn);

        projects.forEach(project => {
            const btn = document.createElement('button');
            btn.classList.add('btn', "openProjectBtn");
            btn.textContent = project.name;

            btn.addEventListener('click', () => {
                this.changeOpenedProject(project);
            });

            localDom.projectBtnWrapper.appendChild(btn);
        });
    },

    async createDOMProjects(projects: Project[], showHomeTab = true, activeProject: Project | null = null) {
        localDom.projectsWrapper.innerHTML = '';

        // Add home "project"
        // <div class="home">
        //     <h1>Hello!</h1>
        //     <h2>Choose a project or...</h2>
        //     <h2>...create a new one to get started!</h2>
        // </div>
        const home = document.createElement('div');
        home.classList.add('home');

        // Show home tab if there is no active project and showHomeTab is true, otherwise hide it
        UI.activeProject && !showHomeTab ? home.classList.add('hidden') : null;

        home.innerHTML = `
            <h1>Hello!</h1>
            <h2>Choose a project or...</h2>
            <h2>...create a new one to get started!</h2>
        `;
        localDom.projectsWrapper.appendChild(home);

        projects.forEach(project => {
            const projectContent = document.createElement('div');
            projectContent.classList.add('projectContent');

            // Show project if it's the active one, otherwise hide it
            activeProject && activeProject.UUID === project.UUID ? null : projectContent.classList.add('hidden');

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
                dom.windows.wrapper.classList.remove("hidden");
                dom.windows.addTask.wrapper.classList.remove("hidden");
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

            // Create "Add column" button
            const addColBtn = document.createElement('button');
            addColBtn.classList.add('addColBtn', 'addBtn', 'animateOnHover', 'btn');
            addColBtn.textContent = '+';

            colsWrapper.appendChild(addColBtn);
            projectContent.appendChild(colsWrapper);

            localDom.projectsWrapper.appendChild(projectContent);
        });
    },

    openHomeTab() {
        // Select all project wrappers
        const projects = $$(".projectContent");
        projects.forEach(projectContent => {
            projectContent.classList.add('hidden');
        });

        // Show home tab only
        $(".home").classList.remove('hidden');
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
        $(".home").classList.add('hidden');

        UI.updateWindows(project);
    },
};