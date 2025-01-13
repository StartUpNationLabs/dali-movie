import { MonacoEditorLanguageClientWrapper, UserConfig } from 'monaco-editor-wrapper';
import { configureWorker, defineUserServices } from './setupCommon.js';
import {monarch} from "@dali-movie/language";

export const setupConfigClassic = (): UserConfig => {
  return {
    wrapperConfig: {
      serviceConfig: defineUserServices(),
      editorAppConfig: {
        $type: 'classic',
        languageId: 'dali-movie',
        code: ``,
        useDiffEditor: false,
        languageExtensionConfig: { id: 'langium' },
        languageDef: monarch.default,
        editorOptions: {
          'semanticHighlighting.enabled': true,
          theme: 'vs-dark'
        }
      }
    },
    languageClientConfig: configureWorker()
  };
};
export const executeClassic = async (htmlElement: HTMLElement) => {
    const userConfig = setupConfigClassic();
    const wrapper = new MonacoEditorLanguageClientWrapper();
    await wrapper.initAndStart(userConfig, htmlElement);
};
