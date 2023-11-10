export interface PresetGeneratorSchema {
  name: string;
  appType: 'standalone' | 'monorepo';
  buildTool: 'webpack' | 'vite';
  appName?: string;
  uiLibrary: 'mui' | 'antd' | 'none';
  reactQuery_swr: 'react-query' | 'swr' | 'none';
  useReactRouter: boolean;
  stateManagement: 'redux' | 'jotai' | 'none';
  formLibrary: 'react-hook-form' | 'formik' | 'none';
  defaultStylesheet: 'css' | 'sass' | 'styled-components';
  useStorybook: boolean;
}
