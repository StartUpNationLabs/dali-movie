import chalk from 'chalk';
import { Command } from 'commander';
import { NodeFileSystem } from 'langium/node';
import {
  createDaliMovieServices,
  DaliMovieLanguageMetaData,
  Script,
} from '@dali-movie/language';
import { extractAstNode, generateMoviePython } from '@dali-movie/generator';

export const generateAction = async (
  fileName: string,
  opts: GenerateOptions
): Promise<void> => {
  const services = createDaliMovieServices(NodeFileSystem).DaliMovie;
  const model = await extractAstNode<Script>(fileName, services);
  updateFilePath(model);

  const generatedFilePath = generateMoviePython(
    model,
    fileName,
    opts.destination
  );
  console.log(
    chalk.green(`Python code generated successfully: ${generatedFilePath}`)
  );
};

function updateFilePath(document: Script): void {
  document.commands.forEach((command) => {
    switch (command.$type) {
      case 'LoadVideo':
      case 'LoadAudio':
        command.file = command.file.substring(1, command.file.length - 1);
    }
  });

  const exportValue = document.export;
  if (exportValue) {
    exportValue.file = exportValue.file.substring(
      1,
      exportValue.file.length - 1
    );
  }
}

export type GenerateOptions = {
  destination?: string;
};

export const main = function (): void {
  const program = new Command();

  const fileExtensions = DaliMovieLanguageMetaData.fileExtensions.join(', ');
  program
    .command('generate')
    .argument(
      '<file>',
      `source file (possible file extensions: ${fileExtensions})`
    )
    .option('-d, --destination <dir>', 'destination directory of generating')
    .description(
      'generates Python code that prints the API functions in a source file'
    )
    .action(generateAction);

  program.parse(process.argv);
};

main();
