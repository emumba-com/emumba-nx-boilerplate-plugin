# Emumba Project Setup

## Usage

To create a new React project using the Emumba Plugin, follow these simple steps:

1. Open your terminal.

2. Generate a Personal Access Token from Github.

3. Run the following command to login and use your generated token when asked.

```bash
npm login --registry=https://npm.pkg.github.com --scope=@emumba-com
```

4. Run the following command:

```bash
npx @emumba-com/nx-project-setup@latest my-app
```
5. Follow the on-screen prompts to configure your project. You can select options for UI libraries, data fetching libraries, state management, React Router, Storybook, the type of application (standalone or monorepo), and the build tool you want to use.

6. The Emumba Plugin will create the project with your chosen configurations.

7. To start your project, navigate to the project directory. If you've created a standalone app, use the command `npm start`. For a monorepo project, use `nx serve your_monorepo_appName`.
8. If you've chosen the Storybook option as true, you can run the Storybook by using the following commands. For a standalone project, use `nx storybook`. If you've selected a monorepo, use `nx storybook your_monorepo_appName`.

## Configuration

The Emumba Plugin allows you to configure various aspects of your project, including:

- **Type of Application:** Choose between Standalone or Monorepo project.

- **Build Tool:** Choose between Webpack or Vite.

- **UI Library:** Choose between Material UI, Ant Design, or None.

- **Data Fetching Library:** Choose between React Query, SWR, or None.

- **Form Library:** Choose between React Hook Form, Formik, or None.

- **Default Stylesheet:** Choose between CSS, SASS, or Styled-Components.

- **React Router:** Configure whether or not to include React Router for handling navigation.

- **State Management Library:** Choose between Redux, Jotai, or None.

- **Storybook:** Configure whether or not to include Storybook for component development.

You can customize these options during project setup, and the Emumba Plugin will generate a project that adheres to your choices.

