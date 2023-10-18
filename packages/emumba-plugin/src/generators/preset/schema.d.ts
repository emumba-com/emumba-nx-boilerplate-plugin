export interface PresetGeneratorSchema {
  name: string;
  buildTool: 'webpack' | 'vite';
  uiLibrary: 'mui' | 'antd' | 'none';
  reactQuery_swr: 'react-query' | 'swr' | 'none';
  useReactRouter: boolean;
  stateManagement: 'redux' | 'jotai' | 'none';
  formLibrary: 'react-hook-form' | 'formik' | 'none';
  defaultStylesheet: 'css' | 'sass' | 'styled-components';
  useStorybook: boolean;
}
