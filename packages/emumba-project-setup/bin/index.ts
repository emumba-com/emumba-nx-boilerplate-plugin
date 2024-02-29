#!/usr/bin/env node

import { createWorkspace } from 'create-nx-workspace';
import { prompt } from 'enquirer';

async function main() {
  try {
    let name = process.argv[2]; // TODO: use libraries like yargs or enquirer to set your workspace name
    if (!name) {
      const response = await prompt<{ name: string }>({
        required: true,
        type: 'input',
        name: 'name',
        message: 'What is the name of the project?',
      });
      name = response.name;
    }

    // Integrated monorepo, or standalone project?
    let appType = process.argv[3];
    let appName = '';
    if (!appType) {
      appType = (
        await prompt<{ appType: 'standalone' | 'monorepo' }>({
          name: 'appType',
          message: 'Integrated monorepo, or standalone project?',
          initial: 'standalone' as any,
          type: 'autocomplete',
          choices: [
            { name: 'standalone', message: 'Standalone' },
            { name: 'monorepo', message: 'Monorepo' },
          ],
        })
      ).appType;
    }
    if (appType === 'monorepo') {
      appName = (
        await prompt<{ appName: string }>({
          type: 'input',
          name: 'appName',
          message: 'Application name?',
          validate(value) {
            if (value.length === 0) {
              return 'App name is required';
            }
            return true;
          },
          required: true,
        })
      ).appName;
    }

    let buildTool = process.argv[4];
    if (!buildTool) {
      buildTool = (
        await prompt<{ buildTool: 'webpack' | 'vite' }>({
          name: 'buildTool',
          message: 'Which build tool do you want to use?',
          initial: 'webpack' as any,
          type: 'autocomplete',
          choices: [
            { name: 'webpack', message: 'Webpack' },
            { name: 'vite', message: 'Vite' },
          ],
        })
      ).buildTool;
    }

    let uiLibrary = process.argv[5];
    if (!uiLibrary) {
      uiLibrary = (
        await prompt<{ uiLibrary: 'mui' | 'antd' | 'none' }>({
          name: 'uiLibrary',
          message: 'Which UI Library do you want to use?',
          initial: 'none' as any,
          type: 'autocomplete',
          choices: [
            { name: 'mui', message: 'Material UI' },
            { name: 'antd', message: 'Ant Design' },
            { name: 'none', message: 'None' },
          ],
        })
      ).uiLibrary;
    }

    let reactQuery_swr = process.argv[6];
    if (!reactQuery_swr) {
      reactQuery_swr = (
        await prompt<{
          reactQuery_swr: 'react-query' | 'swr' | 'none';
        }>({
          name: 'reactQuery_swr',
          message: 'Which data fetching library do you want to use?',
          initial: 'none' as any,
          type: 'autocomplete',
          choices: [
            { name: 'react-query', message: 'React Query' },
            { name: 'swr', message: 'SWR' },
            { name: 'none', message: 'None' },
          ],
        })
      ).reactQuery_swr;
    }

    const router = process.argv[7];
    let useReactRouter = true;
    if (!router) {
      useReactRouter = (
        await prompt<{ useReactRouter: boolean }>({
          type: 'confirm',
          name: 'useReactRouter',
          message:
            'Would you like to include React Router for handling navigation in your project? (Y/n)',
          initial: true,
        })
      ).useReactRouter;
    }

    let stateManagement = process.argv[8];
    if (!stateManagement) {
      stateManagement = (
        await prompt<{ stateManagement: 'redux' | 'jotai' | 'none' }>({
          name: 'stateManagement',
          message: 'Which state management library do you want to use?',
          initial: 'none' as any,
          type: 'autocomplete',
          choices: [
            { name: 'redux', message: 'Redux' },
            { name: 'jotai', message: 'Jotai' },
            { name: 'none', message: 'None' },
          ],
        })
      ).stateManagement;
    }

    let formLibrary = process.argv[9];
    if (!formLibrary) {
      formLibrary = (
        await prompt<{ formLibrary: 'react-hook-form' | 'formik' | 'none' }>({
          name: 'formLibrary',
          message: 'Which form library do you want to use?',
          initial: 'none' as any,
          type: 'autocomplete',
          choices: [
            { name: 'react-hook-form', message: 'React Hook Form' },
            { name: 'formik', message: 'Formik' },
            { name: 'none', message: 'None' },
          ],
        })
      ).formLibrary;
    }

    let defaultStylesheet = process.argv[10];
    if (!defaultStylesheet) {
      defaultStylesheet = (
        await prompt<{
          defaultStylesheet: 'css' | 'sass' | 'styled-components';
        }>({
          name: 'defaultStylesheet',
          message: 'Default stylesheet format',
          initial: 'css' as any,
          type: 'autocomplete',
          choices: [
            { name: 'css', message: 'CSS' },
            { name: 'sass', message: 'SASS' },
            { name: 'styled-components', message: 'Styled-Components' },
          ],
        })
      ).defaultStylesheet;
    }

    const storybook = process.argv[11];
    let useStorybook = true;
    if (!storybook) {
      useStorybook = (
        await prompt<{ useStorybook: boolean }>({
          type: 'confirm',
          name: 'useStorybook',
          message: 'Do you want to add Storybook to your project? (Y/n)',
          initial: false,
        })
      ).useStorybook;
    }

    console.log(`Creating the workspace: ${name}`);

    // This assumes "emumba-plugin" and "emumba-project-setup" are at the same version
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const presetVersion = require('../package.json').version;

    // TODO: update below to customize the workspace
    const { directory } = await createWorkspace(
      `@emumba-com/nx-plugin@${presetVersion}`,
      {
        name,
        buildTool,
        appType,
        appName,
        nxCloud: 'skip',
        packageManager: 'npm',
        uiLibrary,
        reactQuery_swr,
        useReactRouter,
        stateManagement,
        formLibrary,
        defaultStylesheet,
        useStorybook,
      }
    );

    console.log(`Successfully created the workspace: ${directory}.`);
  } catch (error) {
    process.exit(1);
  }
}

main();
