import {
  addDependenciesToPackageJson,
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { ProjectSetupGeneratorSchema } from './schema';

/**
 * Generate a project setup based on specified options.
 * @param {Tree} tree - The tree object representing the file system.
 * @param {ProjectSetupGeneratorSchema} options - The options for project setup.
 * @returns {Promise<void>} A Promise that resolves when the setup is complete.
 */
export async function projectSetupGenerator(
  tree: Tree,
  options: ProjectSetupGeneratorSchema
) {
  const projectRoot = `libs`;

  // Add project configuration
  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    projectType: 'library',
    sourceRoot: `${projectRoot}/src`,
    targets: {},
  });

  // Create an object to hold package dependencies
  const pkgDependencies = {};

  // UI Libraries
  if (options.uiLibrary === 'material-ui') {
    pkgDependencies['@mui/material'] = 'latest';
    pkgDependencies['@emotion/react'] = 'latest';
    pkgDependencies['@emotion/styled'] = 'latest';
    // Generate files for Material-UI
    generateFiles(tree, path.join(__dirname, 'files/src/material-ui'), `${projectRoot}/mui`, options);
    await formatFiles(tree);
  } else if (options.uiLibrary === 'antD') {
    pkgDependencies['antd'] = 'latest';
  }

  // API Libraries
  if (options.apiLibrary === 'react-query') {
    pkgDependencies['react-query'] = 'latest';
  } else if (options.apiLibrary === 'swr') {
    pkgDependencies['swr'] = 'latest';
  }

  // Utility Libraries
  if (options.utilityLibrary === 'lodash') {
    pkgDependencies['lodash'] = 'latest';
  } else if (options.utilityLibrary === 'ramda') {
    pkgDependencies['ramda'] = 'latest';
  }

  // State Management
  if (options.stateManagement === true) {
    pkgDependencies['@reduxjs/toolkit'] = 'latest';
    // Generate files for Redux
    generateFiles(tree, path.join(__dirname, 'files/src/redux'), `${projectRoot}/redux`, options);
    await formatFiles(tree);
  }

  // React Router
  if (options.router === true) {
    pkgDependencies['react-router-dom'] = 'latest';
    // Generate files for Router
    generateFiles(tree, path.join(__dirname, 'files/src/router'), `${projectRoot}/router`, options);
  }

  // Add all package dependencies to package.json
  return addDependenciesToPackageJson(tree, pkgDependencies, {});
}

export default projectSetupGenerator;