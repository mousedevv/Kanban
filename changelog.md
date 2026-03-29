DEV v0.0.1 - (INIT COMMIT):
    - Add initial Kanban app scaffold: 
      - TypeScript source files (src/) 
      - Compiled distribution (dist/): 
        - Express.js server, 
        - Static public pages (welcome, home, error pages 403 and 404),
        - Global CSS and font assets with license/  README, 
        - Project config (package.json, tsconfig.json, .gitignore), 
    - Move Kanban plan image into a hidden planning folder.

DEV v0.1.0 - Add registration, auth middleware, and assets:
    - Implement user registration flow and strengthen server routing: 
      - add dotenv support and env-based URL/PORT, 
      - Introduce authentication middleware with a public-path whitelist and static file serving, 
      - Implement /register handler using a new register util that hashes passwords and persists users. 
    - Refactor file utilities: 
      - Rename and consolidate load/save logic (loadAndSaveUsers.ts) and add saveUsers, 
      - fix loadUsers paths and User constructor ordering. 
      - Add findUserByPassword to use hashed passwords and wire up auth helpers. 
    - Add simple login/register frontend assets (CSS/HTML/TS placeholders) and part of CSS.
    - Add dotenv dependency and expose some globals for debugging.