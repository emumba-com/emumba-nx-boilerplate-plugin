import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { projectSetupGenerator } from './generator';
import { ProjectSetupGeneratorSchema } from './schema';

describe('project-setup generator', () => {
  let tree: Tree;
  const options: ProjectSetupGeneratorSchema = { name: 'test', uiLibrary: 'none', apiLibrary: 'none', uitilityLibrary: 'none', stateManagement: false, router: false };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await projectSetupGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
