export interface ProjectSetupGeneratorSchema {
  name: string;
  uiLibrary: 'material-ui' | 'antD' | 'none';
  apiLibrary: 'react-query' | 'swr' | 'none';
  utilityLibrary: 'lodash' | 'ramda' | 'none';
  stateManagement: boolean;
  router: boolean;
}