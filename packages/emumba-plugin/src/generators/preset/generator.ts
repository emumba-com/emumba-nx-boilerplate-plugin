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

async function getLatestVersion(packageName: string): Promise<string> {
  const execAsync = promisify(exec);
  const { stdout } = await execAsync(`npm show ${packageName} version`);
  return stdout.trim() || 'latest';
}

export async function presetGenerator(
  tree: Tree,
  options: PresetGeneratorSchema
) {
  const reactDeps = await Promise.all([
    getLatestVersion('react'),
    getLatestVersion('react-dom'),
    getLatestVersion('react-scripts'),
  ]);
  const reactDevDeps = await Promise.all([
    getLatestVersion('typescript'),
    getLatestVersion('@types/react'),
    getLatestVersion('@types/react-dom'),
  ]);
  const dependencies = {
    react: reactDeps.at(0),
    'react-dom': reactDeps.at(1),
    'react-scripts': reactDeps.at(2),
  };
  const devDependencies = {
    typescript: reactDevDeps.at(0),
    '@types/react': reactDevDeps.at(1),
    '@types/react-dom': reactDevDeps.at(2),
  };

  const projectRoot = `.`;
  const projectSrc = projectRoot + '/src';
  const projectComponentsPath = projectSrc + '/components';
  const projectPagesPath = projectSrc + '/pages';

  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    projectType: 'application',
    targets: {},
  });
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
    generateFiles(
      tree,
      path.join(__dirname, 'files', 'vite_components'),
      projectRoot,
      options
    );
    const devDeps = await Promise.all([
      getLatestVersion('@typescript-eslint/eslint-plugin'),
      getLatestVersion('@typescript-eslint/parser'),
      getLatestVersion('@vitejs/plugin-react'),
      getLatestVersion('eslint'),
      getLatestVersion('eslint-plugin-react-hooks'),
      getLatestVersion('eslint-plugin-react-refresh'),
      getLatestVersion('vite'),
    ]);
    devDependencies['@typescript-eslint/eslint-plugin'] = devDeps.at(0);
    devDependencies['@typescript-eslint/parser'] = devDeps.at(1);
    devDependencies['@vitejs/plugin-react'] = devDeps.at(2);
    devDependencies['eslint'] = devDeps.at(3);
    devDependencies['eslint-plugin-react-hooks'] = devDeps.at(4);
    devDependencies['eslint-plugin-react-refresh'] = devDeps.at(5);
    devDependencies['vite'] = devDeps.at(6);
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
  if (options.uiLibrary === 'antd') {
    dependencies['antd'] = await getLatestVersion('antd');
    generateFiles(
      tree,
      path.join(__dirname, 'files', 'ui_library_components', 'antd'),
      projectSrc,
      options
    );
  } else if (options.uiLibrary === 'mui') {
    const deps = await Promise.all([
      getLatestVersion('@mui/material'),
      getLatestVersion('@emotion/react'),
      getLatestVersion('@emotion/styled'),
    ]);
    dependencies['@mui/material'] = deps.at(0);
    dependencies['@emotion/react'] = deps.at(1);
    dependencies['@emotion/styled'] = deps.at(2);
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
  if (options.reactQuery_swr === 'react-query') {
    dependencies['@tanstack/react-query'] = await getLatestVersion(
      '@tanstack/react-query'
    );
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
    dependencies['swr'] = await getLatestVersion('swr');
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
  if (options.useReactRouter) {
    dependencies['react-router-dom'] = await getLatestVersion(
      'react-router-dom'
    );
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
  if (options.stateManagement === 'redux') {
    const deps = await Promise.all([
      getLatestVersion('react-redux'),
      getLatestVersion('@reduxjs/toolkit'),
    ]);
    dependencies['react-redux'] = deps.at(0);
    dependencies['@reduxjs/toolkit'] = deps.at(1);

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
    dependencies['jotai'] = await getLatestVersion('jotai');
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

  if (options.formLibrary === 'react-hook-form') {
    const deps = await Promise.all([
      getLatestVersion('react-hook-form'),
      getLatestVersion('@hookform/resolvers'),
      getLatestVersion('yup'),
      getLatestVersion('@types/yup'),
    ]);
    dependencies['react-hook-form'] = deps.at(0);
    dependencies['@hookform/resolvers'] = deps.at(1);
    dependencies['yup'] = deps.at(2);
    devDependencies['@types/yup'] = deps.at(3);
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
    const deps = await Promise.all([
      getLatestVersion('formik'),
      getLatestVersion('yup'),
      getLatestVersion('@types/yup'),
    ]);
    dependencies['formik'] = deps.at(0);
    dependencies['yup'] = deps.at(1);
    devDependencies['@types/yup'] = deps.at(2);
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

  if (options.defaultStylesheet === 'css') {
  } else if (options.defaultStylesheet === 'sass') {
    devDependencies['sass'] = await getLatestVersion('sass');
    tree.rename('src/index.css', 'src/index.scss');
    tree.rename('src/App.css', 'src/App.scss');
  } else if (options.defaultStylesheet === 'styled-components') {
    dependencies['styled-components'] = await getLatestVersion(
      'styled-components'
    );
    tree.delete('src/index.css');
    tree.delete('src/App.css');
  }

  if (options.useStorybook) {
    const devDeps = await Promise.all([
      getLatestVersion('@storybook/addon-essentials'),
      getLatestVersion('@storybook/addon-interactions'),
      getLatestVersion('@storybook/addon-links'),
      getLatestVersion('@storybook/addon-onboarding'),
      getLatestVersion('@storybook/blocks'),
      getLatestVersion('@storybook/preset-create-react-app'),
      getLatestVersion('@storybook/react'),
      getLatestVersion('@storybook/testing-library'),
      getLatestVersion('babel-plugin-named-exports-order'),
      getLatestVersion('eslint-plugin-storybook'),
      getLatestVersion('prop-types'),
      getLatestVersion('storybook'),
    ]);
    devDependencies['@storybook/addon-essentials'] = devDeps.at(0);
    devDependencies['@storybook/addon-interactions'] = devDeps.at(1);
    devDependencies['@storybook/addon-links'] = devDeps.at(2);
    devDependencies['@storybook/addon-onboarding'] = devDeps.at(3);
    devDependencies['@storybook/blocks'] = devDeps.at(4);
    devDependencies['@storybook/preset-create-react-app'] = devDeps.at(5);
    devDependencies['@storybook/react'] = devDeps.at(6);
    devDependencies['@storybook/testing-library'] = devDeps.at(7);
    devDependencies['babel-plugin-named-exports-order'] = devDeps.at(8);
    devDependencies['eslint-plugin-storybook'] = devDeps.at(9);
    devDependencies['prop-types'] = devDeps.at(10);
    devDependencies['storybook'] = devDeps.at(11);

    if (options.buildTool === 'webpack') {
      devDependencies['webpack'] = await getLatestVersion('webpack');
      devDependencies['@storybook/react-webpack5'] = await getLatestVersion(
        '@storybook/react-webpack5'
      );
    } else if (options.buildTool === 'vite') {
      devDependencies['@storybook/react-vite'] = await getLatestVersion(
        '@storybook/react-vite'
      );
    }
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
  await formatFiles(tree);
  return addDependenciesToPackageJson(tree, dependencies, devDependencies);
}

export default presetGenerator;
