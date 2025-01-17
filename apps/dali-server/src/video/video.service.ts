import { LangiumDocument } from 'langium';
import path from 'path';
import { Script } from '@dali-movie/language';
import { EXPORTED_PATH, UPLOAD_PATH } from '../constants.js';

export class VideoService {
  constructor() {}

  static updateFilePath(
    document: LangiumDocument<Script>,
    prefix: string
  ): void {
    const rootNode = document.parseResult?.value;
    if (!rootNode) {
      console.error('Failed to parse the document.');
      return;
    }

    rootNode.commands.forEach((command) => {
      switch (command.$type) {
        case 'LoadVideo':
        case 'LoadAudio':
          command.file = path
            .join(
              UPLOAD_PATH,
              prefix,
              command.file.substring(1, command.file.length - 1)
            )
            .replace(/\\/g, '\\\\');
      }
    });

    const exportValue = rootNode.export;
    if (exportValue) {
      exportValue.file = path
        .join(
          EXPORTED_PATH,
          prefix,
          exportValue.file.substring(1, exportValue.file.length - 1)
        )
        .replace(/\\/g, '\\\\');
    }
    else {
      rootNode.export = {
        file: path
        .join(
          EXPORTED_PATH,
          prefix,
          "output.mp4"
        )
        .replace(/\\/g, '\\\\'),
        $container: rootNode,
        $type: 'Export'
      }
    }
  }
}
