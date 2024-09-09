<div align="center">
    <h1>Toodoo 📝🔒</h1>
    <p>Keep your tasks private and securely manage your to-do list.</p>
</div>

## Accessing the App

You can access the app with the following link: https://toodoo-web.vercel.app/

> ![note]
> Since this application is running on free-tier services, it may not work or be extremely slow. For a better experience, I recommend running it locally, either using Docker or setting it up manually.

### Running locally

#### Docker (easier)

Clone the repo and cd into it's directory

```sh
git clone https://github.comm/lucasmartinsvieira/toodoo.git
cd toodoo
```

Copy the contents of this environment file into `toodoo-api/.env.production`

```env
PORT=3000
MYSQL_HOST=db
MYSQL_PORT=3306
MYSQL_USER=toodoo-user
MYSQL_PASSWORD=kQa7fDmF6yQpymuy46YN8PxNua2DVAcY
MYSQL_DATABASE=toodoo
MYSQL_ROOT_PASSWORD=57Ba#%6gf%l3HAhNHDv35ACeDJVi9%b3

JWT_SECRET=Xn672@538dUfw#B#
ENCRYPTION_KEY=33a20b644ae44db9190d5a00173a41d078413baac969564dcb9fc65b35abb202
```

Copy the following contents into `toodoo-web/.env.production`

```env
VITE_API_URL="http://localhost:3000/api"
```

Run the following docker compose command on the root of the project's directory

```sh
docker compose -f compose.prod.yaml up --build
docker compose -f compose.prod.yaml down # To take the containers down
```

- Go to `localhost:4000/` to access the toodoo
- Go to `localhost:3000/api` to access swagger (toodoo-api)

#### Manually (harder)

Clone the repo and cd into it's directory

```sh
git clone https://github.comm/lucasmartinsvieira/toodoo.git
cd toodoo
```

Copy the contents of this environment file into `toodoo-api/.env.production`

```env
PORT=3000
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=toodoo-user
MYSQL_PASSWORD=kQa7fDmF6yQpymuy46YN8PxNua2DVAcY
MYSQL_DATABASE=toodoo
MYSQL_ROOT_PASSWORD=57Ba#%6gf%l3HAhNHDv35ACeDJVi9%b3

JWT_SECRET=Xn672@538dUfw#B#
ENCRYPTION_KEY=33a20b644ae44db9190d5a00173a41d078413baac969564dcb9fc65b35abb202
```

Copy the following contents into `toodoo-web/.env.production`

```env
VITE_API_URL="http://localhost:3000/api"
```

Setup a MySQL database manually

On the project root, cd into `toodoo-web`

```sh
cd toodoo-web
npm ci --omit dev
npm run build
npm run preview
```

On the project root, cd into `toodoo-api`

```sh
cd toodoo-web
npm ci --omit dev
npm run build
npm run start:prod
```

- Go to `localhost:4000/` to access the toodoo
- Go to `localhost:3000/api` to access swagger (toodoo-api)

## Development Steps

1. **Initialized NestJS Application**

   - Generated the application using the NestJS CLI.

2. **User Resource Creation**

   - Created the `users` resource via CLI.
   - Defined the `users` entity.
   - Implemented CRUD operations for `users`.

3. **Database Setup**

   - Created a `docker-compose.yaml` for MySQL database configuration.
   - Configured environment variables using the `@nestjs/config` package.
   - Connected and configured the database.

4. **Task Resource Development**

   - Generated the `tasks` resource using the CLI.
   - Created the `tasks` entity.
   - Implemented CRUD operations for `tasks`.

5. **Authentication Implementation**

   - Generated the authentication resource via CLI.
   - Integrated JWT for secure authentication.

6. **Frontend Development**

   - Generated the frontend using Vite.
   - Configured Tailwind CSS for styling.
   - Set up routing with `react-router-dom`.
   - Integrated `shadcn/ui` for UI components.

7. **Task Encryption**

   - Added encryption to tasks on the backend using AES-GCM for simplicity, with the encryption key stored in an `.env` file.

8. **Frontend Features**

   - Added a home page.
   - Implemented a navbar.
   - Created a registration page.
   - Developed a `useAuth` hook for DRY code practices.
   - Added a login page.
   - Created a profile page with a delete account button using `shadcn/ui`'s alert-dialog.
   - Added a tasks page.
   - Developed a task detail page.

9. **Docker Support**

   - Added Docker support for both production and development environments.
     - Dockerfiles for development and production environments
     - Compose files for development and production environments

10. **Additional Enhancements**

    - Created a reusable Header component.
    - Added Swagger documentation for API endpoints.
    - Included `toodoo.svg` for branding.

11. **Tests**

    - Created tests on `toodoo-api` for:
      - `users.service.ts`
      - `auth.controller.ts`
      - `auth.service.ts`
      - `tasks.controller.ts`
      - `tasks.service.ts`

12. **Deployment**
    - Deployed the frontend (`toodoo-web`) on Vercel.
    - Deployed the backend API (`toodoo-api`) on Render.
    - Deployed the database (`toodoo-db`) on Clever Cloud.

## Todo's

- [ ] Do e2e test on toodoo-api
- [ ] Do tests on toodoo-web
- [ ] Use another method of encryption for tasks that isn't AES-GCM
- [ ] Only use one .env file for both applications
- [ ] Create a docker image and host it on docker hub
