import {
  addDependenciesToPackageJson,
  formatFiles,
  generateFiles,
  installPackagesTask,
  moveFilesToNewDirectory,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { PresetGeneratorSchema } from './schema';
import { exec, execSync } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

// npm packages
let dependencies = {};
let devDependencies = {};

// Function to fetch the latest version of a npm package
async function fetchLatestPackageVersion(packageName: string): Promise<string> {
  try {
    const { stdout } = await execAsync(`npm show ${packageName} version`);
    return stdout.trim() || 'latest';
  } catch (error) {
    console.log(error);
  }
}

// Function to add dependencies to package.json
async function addDependencies(deps: string[] = [], devDeps: string[] = []) {
  // Fetch the latest versions of both regular and dev dependencies in parallel
  const [latestDeps, latestDevDeps] = await Promise.all([
    Promise.all(deps.map((dep) => fetchLatestPackageVersion(dep))),
    Promise.all(devDeps.map((dep) => fetchLatestPackageVersion(dep))),
  ]);

  // Convert the arrays to objects with dependency names as keys
  const dependencyObj = Object.fromEntries(
    deps.map((dep, index) => [dep, latestDeps[index]])
  );

  const devDependencyObj = Object.fromEntries(
    devDeps.map((dep, index) => [dep, latestDevDeps[index]])
  );

  dependencies = { ...dependencies, ...dependencyObj };
  devDependencies = { ...devDependencies, ...devDependencyObj };
}

export async function presetGenerator(
  tree: Tree,
  options: PresetGeneratorSchema
) {
  // Define project paths.
  let projectRoot = '';
  let projectSrc = '';
  let projectComponentsPath = '';
  let projectPagesPath = '';
  const stylesheet =
    options.defaultStylesheet === 'sass' ? 'scss' : options.defaultStylesheet;

  if (options.appType === 'monorepo') {
    await execAsync(
      `npx create-nx-workspace@latest ${options.name} --preset=react-monorepo --appName=${options.appName} --bundler=${options.buildTool} --e2eTestRunner=none --nxCloud=skip --skipGit=true --style=${stylesheet}`
    );
    moveFilesToNewDirectory(tree, options.name, '.');
    tree.delete(options.name);
    tree.delete(`apps/${options.appName}/src/app`);

    projectRoot = `.`;
    projectSrc = `${projectRoot}/apps/${options.appName}/src`;
    projectComponentsPath = projectSrc + '/components';
    projectPagesPath = projectSrc + '/pages';
  } else {
    await execAsync(
      `npx create-nx-workspace@latest ${options.name} --preset=react-standalone --bundler=${options.buildTool} --e2eTestRunner=none --nxCloud=skip --skipGit=true --style=${stylesheet}`
    );
    moveFilesToNewDirectory(tree, options.name, '.');
    tree.delete(options.name);
    tree.delete('src/app');

    projectRoot = `.`;
    projectSrc = projectRoot + '/src';
    projectComponentsPath = projectSrc + '/components';
    projectPagesPath = projectSrc + '/pages';
  }

  generateFiles(
    tree,
    path.join(__dirname, 'files', 'src'),
    projectSrc,
    options
  );

  // Handle UI library options.
  if (options.uiLibrary === 'antd') {
    await addDependencies(['antd']);
    generateFiles(
      tree,
      path.join(__dirname, 'files', 'ui_library_components', 'antd'),
      projectSrc,
      options
    );
  } else if (options.uiLibrary === 'mui') {
    await addDependencies([
      '@mui/material',
      '@emotion/react',
      '@emotion/styled',
    ]);
    generateFiles(
      tree,
      path.join(__dirname, 'files', 'ui_library_components', 'mui'),
      projectSrc,
      options
    );
  } else if (options.uiLibrary === 'none') {
    generateFiles(
      tree,
      path.join(__dirname, 'files', 'ui_library_components', 'none'),
      projectSrc,
      options
    );
  }

  // Handle data fetching options.
  if (options.reactQuery_swr === 'react-query') {
    await addDependencies(['@tanstack/react-query']);
    if (options.useReactRouter) {
      generateFiles(
        tree,
        path.join(__dirname, 'files', 'react_query_components'),
        projectPagesPath + '/posts',
        options
      );
    } else {
      generateFiles(
        tree,
        path.join(__dirname, 'files', 'react_query_components'),
        projectComponentsPath + '/posts',
        options
      );
    }
  } else if (options.reactQuery_swr === 'swr') {
    await addDependencies(['swr']);
    if (options.useReactRouter) {
      generateFiles(
        tree,
        path.join(__dirname, 'files', 'swr_components'),
        projectPagesPath + '/posts',
        options
      );
    } else {
      generateFiles(
        tree,
        path.join(__dirname, 'files', 'swr_components'),
        projectComponentsPath + '/posts',
        options
      );
    }
  }

  // Handle React Router.
  if (options.useReactRouter) {
    await addDependencies(['react-router-dom']);
    generateFiles(
      tree,
      path.join(__dirname, 'files', 'router_components'),
      projectSrc,
      options
    );
    generateFiles(
      tree,
      path.join(__dirname, 'files', 'ui_library_components', 'navbar'),
      projectComponentsPath + '/navbar',
      options
    );
  }

  // Handle state management options.
  if (options.stateManagement === 'redux') {
    await addDependencies(['react-redux', '@reduxjs/toolkit']);

    switch (options.defaultStylesheet) {
      case 'css':
        generateFiles(
          tree,
          path.join(__dirname, 'files', 'redux_components', 'css'),
          projectSrc,
          options
        );
        break;
      case 'sass':
        generateFiles(
          tree,
          path.join(__dirname, 'files', 'redux_components', 'scss'),
          projectSrc,
          options
        );
        break;
      case 'styled-components':
        generateFiles(
          tree,
          path.join(
            __dirname,
            'files',
            'redux_components',
            'styled-components'
          ),
          projectSrc,
          options
        );
        break;
    }
  } else if (options.stateManagement === 'jotai') {
    await addDependencies(['jotai']);
    switch (options.defaultStylesheet) {
      case 'css':
        generateFiles(
          tree,
          path.join(__dirname, 'files', 'jotai_components', 'css'),
          projectSrc,
          options
        );
        break;
      case 'sass':
        generateFiles(
          tree,
          path.join(__dirname, 'files', 'jotai_components', 'scss'),
          projectSrc,
          options
        );
        break;
      case 'styled-components':
        generateFiles(
          tree,
          path.join(
            __dirname,
            'files',
            'jotai_components',
            'styled-components'
          ),
          projectSrc,
          options
        );
        break;
    }
  }

  // Handle form library options.
  if (options.formLibrary === 'react-hook-form') {
    await addDependencies([
      'react-hook-form',
      '@hookform/resolvers',
      'yup',
      '@types/yup',
    ]);
    generateFiles(
      tree,
      path.join(__dirname, 'files', 'react_hook_form_components'),
      projectComponentsPath,
      options
    );
    generateFiles(
      tree,
      path.join(__dirname, 'files', 'react_hook_form_components', 'login'),
      projectPagesPath + '/login',
      options
    );
  } else if (options.formLibrary === 'formik') {
    await addDependencies(['formik', 'yup'], ['@types/yup']);
    generateFiles(
      tree,
      path.join(__dirname, 'files', 'formik_components'),
      projectComponentsPath,
      options
    );
    generateFiles(
      tree,
      path.join(__dirname, 'files', 'formik_components', 'login'),
      projectPagesPath + '/login',
      options
    );
  }

  // Handle stylesheet options.
  if (options.defaultStylesheet === 'sass') {
    tree.rename(`${projectSrc}/styles.css`, `${projectSrc}/styles.scss`);
    tree.rename(`${projectSrc}/app/App.css`, `${projectSrc}/app/App.scss`);
  } else if (options.defaultStylesheet === 'styled-components') {
    tree.delete(`${projectSrc}/styles.css`);
    tree.delete(`${projectSrc}/app/App.css`);
  }

  // Handle stylesheet options.
  if (options.useStorybook) {
    generateFiles(
      tree,
      path.join(__dirname, 'files', 'storybook_components'),
      projectSrc + '/app',
      options
    );
  }

  // Format the project files and add the collected dependencies to package.json.
  await formatFiles(tree);
  addDependenciesToPackageJson(tree, dependencies, devDependencies);

  return () => {
    installPackagesTask(tree);

    /**
     * * Storybook configuration
     * * The reason of handling storybook configuration at the end is that nx storybook cannot be generate until and unless all the project (nx) is not completed.
     */
    if (options.useStorybook) {
      const projectName =
        options.appType === 'monorepo' ? options.appName : options.name;
      execSync(
        `npx nx g @nx/react:storybook-configuration ${projectName} --interactionTests=false --generateStories=false --configureStaticServe=true`
      );
    }
  };
}

export default presetGenerator;
