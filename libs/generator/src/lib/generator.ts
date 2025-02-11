import { toString } from 'langium/generate';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import { extractDestinationAndName } from './cli-util.js';
import {
  AddMedia,
  AddText,
  Command,
  Cut,
  Cutable,
  LoadAudio,
  LoadVideo,
  Script,
  Text,
} from '@dali-movie/language';
import { Reference } from 'langium';

export function generateMoviePython(
  model: Script,
  filePath: string,
  destination: string | undefined,
  fontPath: string | undefined = ''
): string {
  const data = extractDestinationAndName(filePath, destination);
  const generatedFilePath = `${path.join(data.destination, data.name)}.py`;
  return generateMoviePythonShell(
    model,
    data.destination,
    generatedFilePath,
    fontPath
  );
}

export function generateMovieFromServerPython(
  model: Script,
  destination: string,
  filename: string,
  fontPath: string | undefined = ''
): string {
  const generatedFilePath = path.join(destination, filename);
  return generateMoviePythonShell(
    model,
    destination,
    generatedFilePath,
    fontPath
  );
}

function generateMoviePythonShell(
  model: Script,
  destination: string,
  outputPythonPath: string,
  fontPath: string | undefined
): string {
  if (!fontPath) {
    fontPath = './dali_movie/resources/arial.TTF';
  }
  let code: string = `from dali_movie.dali_movie import Dali_movie, MODE, ANCHOR_TYPE
from moviepy.audio.AudioClip import AudioClip

#INIT
font_path = "${fontPath}"
dali_movie = Dali_movie(font_path)

#SCRIPT
`;

  model.commands.forEach((command) => (code += generateCommand(command)));

  code += '\n' + daliFunction('export', quoted(model.export?.file));

  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }
  fs.writeFileSync(outputPythonPath, toString(code));
  return outputPythonPath;
}

function generateCommand(command: Command): string {
  switch (command.$type) {
    case 'AddMedia':
      return addMedia(command);
    case 'AddText':
      return addText(command);
    case 'Cut':
      return cut(command);
    case 'LoadAudio':
      return importAudio(command);
    case 'LoadVideo':
      return importVideo(command);
    case 'Text':
      return text(command);
    default:
      throw new Error(`Unsupported command type`);
  }
}

function addMedia(command: AddMedia): string {
  let variableName: string | undefined;
  let cutCode = '';
  if (command.from && command.duration) {
    variableName = `${command.mediaRef.$refText}_${command.from}_${command.duration}`;
    cutCode = cut({
      $container: command.$container,
      $type: 'Cut',
      duration: command.duration,
      from: command.from,
      mediaRef: command.mediaRef as Reference<Cutable>,
      name: variableName,
    });
  }
  return cutCode + daliFunction('add', getAddMediaParameters(command, variableName));
}

function getAddMediaParameters(command: AddMedia, variableName?: string): string {
  let parameters = variableName ?? `${command.mediaRef.$refText}`;
  if (command.mode) {
    const mode = command.mode;
    parameters += `, mode=${getAddMediaMode(mode)}`;
    parameters += `, anchor_type=${quoted(mode.anchor)}`;
    if (mode.offset) parameters += `, offset=${getTime(mode.offset)}`;
  }
  if (command.referential) parameters += `, reference=${command.referential.$refText}`;
  return parameters;
}

function getAddMediaMode(mode: AddMedia['mode']): string {
  switch (mode?.$type) {
    case 'StartingRule':
      return 'MODE.START';
    case 'EndingRule':
      return 'MODE.END';
    default:
      return 'None';
  }
}

function addText(command: AddText): string {
  let variableName = command.name ?? getTextVariableName();
  const textCommand: Text = {
    $container: command.$container,
    $type: 'Text',
    content: command.content,
    duration: command.duration,
    name: variableName,
    backgroundColor: command.backgroundColor,
    textColor: command.textColor,
    percentageFromLeft: command.percentageFromLeft,
    percentageFromTop: command.percentageFromTop,
  };
  let textCode = text(textCommand);
  return textCode + addMedia({
    $container: command.$container,
    $type: 'AddMedia',
    mediaRef: { ref: textCommand, $refText: variableName },
    mode: command.mode,
    referential: command.referential,
  });
}

function cut(command: Cut): string {
  const start = command.name + ' = ';
  switch (command.from) {
    case 'start': {
      const params = `${quoted(command.name)}, ${command.mediaRef.$refText}, ${getTime(command.duration)}`;
      return start + daliFunction('cut_start', params);
    }
    case 'end': {
      const params = `${quoted(command.name)}, ${command.mediaRef.$refText}, ${getTime(command.duration)}`;
      return start + daliFunction('cut_end', params);
    }
    default: {
      const params = `${quoted(command.name)}, ${command.mediaRef.$refText}, ${getTime(command.from)}, ${getTime(command.duration)}`;
      return start + daliFunction('cut', params);
    }
  }
}

function importAudio(command: LoadAudio): string {
  const params = `${quoted(command.name)}, ${quoted(command.file)}`;
  return `${command.name} = ${daliFunction('importAudio', params)}`;
}

function importVideo(command: LoadVideo): string {
  const params = `${quoted(command.name)}, ${quoted(command.file)}`;
  return `${command.name} = ${daliFunction('importVideo', params)}`;
}

function text(command: Text): string {
  const start = command.name + ' = ';
  return start + daliFunction('text', getTextParameters(command));
}

function getTextParameters(command: Text): string {
  let parameters = `${quoted(command.name)}, ${getTextContent(command.content)}, duration=${getTime(command.duration)}`;
  if (command.backgroundColor) parameters += `, backgroundColor=${quoted(command.backgroundColor.toLowerCase())}`;
  if (command.textColor) parameters += `, textColor=${quoted(command.textColor.toLowerCase())}`;
  if (command.percentageFromLeft && command.percentageFromTop)
    parameters += `, position=(${command.percentageFromLeft / 100}, ${command.percentageFromTop / 100})`;
  return parameters;
}

function getTextContent(content: string): string {
  return quoted(content.slice(1, content.length - 1).replaceAll(/"/g, '\\"')); // ["texte"] -> "\"texte\""
}

function daliFunction(functionName: string, parameters: string): string {
  return `dali_movie.${functionName}(${parameters})\n`;
}

function getTextVariableName(): string {
  return `text_${uuidv4().replaceAll('-', '_')}`;
}

function quoted(text?: string): string {
  return text ? `"${text}"` : '';
}

function getTime(time: string): number {
  const split = time.slice(0, time.length - 1).split(/[hm]/);
  return split.reduceRight((acc, val, index) => acc + ~~val * Math.pow(60, split.length - 1 - index), 0);
}
