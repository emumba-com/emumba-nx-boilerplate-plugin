# Emumba Frontend CLI Plugin Guide

Welcome to the documentation for the Emumba Plugin project. This project aims to streamline the creation of React applications by providing a CLI tool that sets up a boilerplate project with selected options.

## Table of Contents

- [Introduction](#introduction)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Configuration](#configuration)
- [Understanding the File Structure](#understanding-the-file-structure)

## Introduction

The Emumba Plugin is a CLI tool designed to simplify the process of creating new React applications by providing a set of prompts to customize the project setup. It allows developers to choose various configurations such as UI libraries, data fetching libraries, state management, and more.

## Installation & Setup

1. Clone the Emumba Plugin repository from Gitlab:

   ```bash
   git clone https://github.com/emumba-com/emumba-nx-boilerplate-plugin.git
   ```
2. Setup Verdaccio in the project for local publishing

   ```bash
   npx nx g setup-verdaccio
   ```

3. Install project dependencies:

   ```bash
   npm i
   ```
   
For development/testing purposes, comment the line with @emumba-com:registry in the .npmrc files located at project root, /packages/emumbaplugin and /packages/emumba-project-setup.


4. Set up a local registry for testing and run the project locally. In one terminal, run:

   ```bash
   npx nx local-registry
   ```

5. In a second terminal, publish the package locally using verdaccio (e.g., version 1.0.0):
   ```bash
   npx nx run-many -t publish --ver 1.0.0 --tag latest
   ```

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

## Understanding the File Structure

Here's an overview of the project's directory structure:

```
├── packages
│   ├── emumba-plugin
│   │   ├── src
│   │   │   ├── generators
│   │   │   │   ├── preset
│   │   │   │   │   ├── files
│   │   │   │   │   │   ├── formik_components
│   │   │   │   │   │   ├── jotai_components
│   │   │   │   │   │   ├── react_hook_form_components
│   │   │   │   │   │   ├── react_query_components
│   │   │   │   │   │   ├── redux_components
│   │   │   │   │   │   ├── router_components
│   │   │   │   │   │   ├── src
│   │   │   │   │   │   │   ├── app
│   │   │   │   │   │   │   │   ├── App.css.template
│   │   │   │   │   │   │   │   └── App.tsx.template
│   │   │   │   │   │   │   ├── main.tsx.template
│   │   │   │   │   │   │   └── styles.css.template
│   │   │   │   │   │   ├── storybook_components
│   │   │   │   │   │   ├── swr_components
│   │   │   │   │   │   └── ui_library_components
│   │   │   │   │   ├── generator.ts
│   │   │   │   │   ├── schema.d.ts
│   │   │   │   │   └── schema.json
│   └── emumba-project-setup
│       ├── bin
│       │   └── index.ts
├── project.json
├── README.md
└── tsconfig.base.json
```

## Key Components

### `emumba-project-setup`

This directory contains the core logic for generating boilerplates based on user preferences. It includes the following elements:

- `bin/index.ts`: This is the entry point of the CLI tool. It utilizes the `enquirer` npm package to prompt users and collect their choices regarding project configuration.

### `emumba-plugin/src/generators/preset`

This directory encompasses the code responsible for generating project files and adding dependencies. The central file in this directory is:

- `generator.ts`: This file handles the appropriate file generation and dependency management based on the user's prompt selections.

### `emumba-plugin/src/generators/preset/files`

This directory holds templates for the components that will be generated/added based on the user's selections. It includes subdirectories for various components, such as UI libraries (e.g., Material UI in `/ui_library_components/mui`) and other options.
