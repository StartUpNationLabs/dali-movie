import chalk from 'chalk';
import {Command} from 'commander';
import {NodeFileSystem} from 'langium/node';
import {createDaliMovieServices, DaliMovieLanguageMetaData, Script} from "@dali-movie/language";
import {extractAstNode, generateMoviePython} from "@dali-movie/generator";

export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
  const services = createDaliMovieServices(NodeFileSystem).DaliMovie;
  const model = await extractAstNode<Script>(fileName, services);
  const generatedFilePath = generateMoviePython(model, fileName, opts.destination);
  console.log(chalk.green(`Python code generated successfully: ${generatedFilePath}`));
};

export type GenerateOptions = {
  destination?: string;
}

export const main = function (): void {
  const program = new Command();

  const fileExtensions = DaliMovieLanguageMetaData.fileExtensions.join(', ');
  program
    .command('generate')
    .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
    .option('-d, --destination <dir>', 'destination directory of generating')
    .description('generates Python code that prints the API functions in a source file')
    .action(generateAction);

  program.parse(process.argv);
}

main();
