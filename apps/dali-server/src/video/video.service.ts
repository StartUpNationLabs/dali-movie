import { LangiumDocument } from 'langium';
import path from 'path';
import { Script } from '@dali-movie/language';

export class VideoService {
  constructor() {}

  updateFilePath(
    document: LangiumDocument<Script>,
    prefix: string,
    basePath: string
  ): void {
    const rootNode = document.parseResult?.value;
    if (!rootNode) {
      console.error('Failed to parse the document.');
      return;
    }

    document.parseResult.value.commands.forEach((command) => {
      switch (command.$type) {
        case 'LoadVideo':
        case 'LoadAudio':
          command.file = path
            .join(
              basePath,
              'uploads',
              prefix,
              command.file.substring(1, command.file.length - 1)
            )
            .replace(/\\/g, '\\\\');
      }
    });

    const exportValue = document.parseResult.value.export;
    if (exportValue) {
      exportValue.file = path
        .join(
          basePath,
          'uploads',
          prefix,
          exportValue.file.substring(1, exportValue.file.length - 1)
        )
        .replace(/\\/g, '\\\\');
    }
  }
}
