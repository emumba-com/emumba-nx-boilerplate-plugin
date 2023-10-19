import {
  addDependenciesToPackageJson,
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
  updateJson,
} from '@nx/devkit';
import * as path from 'path';
import { PresetGeneratorSchema } from './schema';
import { exec } from 'child_process';
import { promisify } from 'util';

// npm packages
let dependencies = {};
let devDependencies = {};

// Function to fetch the latest version of a npm package
async function fetchLatestPackageVersion(packageName: string): Promise<string> {
  try {
    const execAsync = promisify(exec);
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
  await addDependencies(
    ['react', 'react-dom', 'react-scripts'],
    ['typescript', '@types/react', '@types/react-dom']
  );

  // Define project paths.
  const projectRoot = `.`;
  const projectSrc = projectRoot + '/src';
  const projectComponentsPath = projectSrc + '/components';
  const projectPagesPath = projectSrc + '/pages';

  // Configure the project in Nx.
  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    projectType: 'application',
    targets: {},
  });

  // Generate files and scripts for webpack.
  if (options.buildTool === 'webpack') {
    generateFiles(
      tree,
      path.join(__dirname, 'files', 'webpack_components'),
      projectRoot,
      options
    );
    updateJson(tree, 'package.json', (json) => {
      json.scripts = json.scripts || {};
      json.scripts.start = 'react-scripts start';
      json.scripts.build = 'react-scripts build';
      json.scripts.test = 'react-scripts test';
      json.scripts.eject = 'react-scripts eject';
      return json;
    });
  } else if (options.buildTool === 'vite') {
    // Generate files and scripts for Vite.
    generateFiles(
      tree,
      path.join(__dirname, 'files', 'vite_components'),
      projectRoot,
      options
    );
    // Add Vite-specific devDependencies.
    await addDependencies(
      [],
      [
        '@typescript-eslint/eslint-plugin',
        '@typescript-eslint/parser',
        '@vitejs/plugin-react',
        'eslint',
        'eslint-plugin-react-hooks',
        'eslint-plugin-react-refresh',
        'vite',
      ]
    );
    // Update package.json scripts.
    updateJson(tree, 'package.json', (json) => {
      json.scripts = json.scripts || {};
      json.scripts.dev = 'vite';
      json.scripts.build = 'tsc && vite build';
      json.scripts.lint =
        'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0';
      json.scripts.preview = 'vite preview';
      return json;
    });
  }
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
      projectSrc + '/components/navbar',
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

  if (options.defaultStylesheet === 'sass') {
    await addDependencies([], ['sass']);
    tree.rename('src/index.css', 'src/index.scss');
    tree.rename('src/App.css', 'src/App.scss');
  } else if (options.defaultStylesheet === 'styled-components') {
    await addDependencies(['styled-components']);
    tree.delete('src/index.css');
    tree.delete('src/App.css');
  }

  // Handle Storybook.
  if (options.useStorybook) {
    await addDependencies(
      [],
      [
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        '@storybook/addon-links',
        '@storybook/addon-onboarding',
        '@storybook/blocks',
        '@storybook/preset-create-react-app',
        '@storybook/react',
        '@storybook/testing-library',
        'babel-plugin-named-exports-order',
        'eslint-plugin-storybook',
        'prop-types',
        'storybook',
      ]
    );

    // Depending on the build tool, add Storybook-specific dependencies.
    if (options.buildTool === 'webpack') {
      await addDependencies([], ['webpack', '@storybook/react-webpack5']);
    } else if (options.buildTool === 'vite') {
      await addDependencies([], ['@storybook/react-vite']);
    }

    // Generate Storybook files and update package.json scripts.
    generateFiles(
      tree,
      path.join(__dirname, 'files', 'storybook_components', '.storybook'),
      projectRoot + '/.storybook',
      options
    );
    generateFiles(
      tree,
      path.join(__dirname, 'files', 'storybook_components', 'stories'),
      projectSrc + '/stories',
      options
    );
    updateJson(tree, 'package.json', (json) => {
      json.scripts = json.scripts || {};
      json.scripts.storybook = 'storybook dev -p 6006';
      json.scripts['build-storybook'] = 'storybook build';
      return json;
    });
  }

  // Format the project files and add the collected dependencies to package.json.
  await formatFiles(tree);
  return addDependenciesToPackageJson(tree, dependencies, devDependencies);
}

export default presetGenerator;
