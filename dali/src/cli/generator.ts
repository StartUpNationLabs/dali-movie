import { toString } from "langium/generate";
import * as fs from "node:fs";
import * as path from "node:path";
import type { Command, Cut, LoadAudio, LoadVideo, Script } from "../language/generated/ast.js";
import { extractDestinationAndName } from "./cli-util.js";

export function generateMoviePython(model: Script, filePath: string, destination: string | undefined): string {
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.py`;

    let code: string = `from dali_movie.dali_movie import Dali_movie
from moviepy.audio.AudioClip import AudioClip

FONT_PATH = "./dali_movie/resources/arial.TTF"

dali_movie = Dali_movie()

`;

    model.commands.forEach(command => code += generateCommand(command));

    code += daliFunction("export", model.export?.outputFilepath ?? "");

    if (!fs.existsSync(data.destination)) {
        fs.mkdirSync(data.destination, { recursive: true });
    }
    fs.writeFileSync(generatedFilePath, toString(code));
    return generatedFilePath;
}

function generateCommand(command: Command): string {
    switch (command.$type) {
        case "AddMedia":
            throw new Error(`Unsupported command type: AddMedia`);
        // return addMedia(command);
        case "AddText":
            throw new Error(`Unsupported command type: AddText`);
        // return addText(command);
        case "Cut":
            return cut(command);
        case "LoadAudio":
            return importAudio(command);
        case "LoadVideo":
            return importVideo(command);
        case "Text":
            throw new Error(`Unsupported command type: Text`);
        // return text(command);
        default:
            throw new Error(`Unsupported command type`);
    }
}

/*function addMedia(command: AddMedia): string {
    const cutCode = command.from && command.duration ? cut({
        $container: command.$container,
        $type: "Cut",
        duration: command.duration,
        from: command.from,
        mediaRef: command.mediaRef,
        name: command.mediaRef.$refText
    }) : '';

    const parameters = `${command.mediaRef.$refText}, mode=${command.mode}, offset=${command.offset}, reference=${command.referential?.$refText}`;
    return cutCode + daliFunction("add", parameters);
}*/

/*function addText(command: AddText): string {
    console.warn('addText is not implemented');
    console.warn('\tDifference between title and subtitle is not handled');
    const parameters = `${command.name}, ${command.duration}`;
    return daliFunction("addText", parameters);
}*/

function cut(command: Cut): string {
    switch (command.from) {
        case "start":
            return daliFunction("cut_start", `${command.name}, ${command.duration}`);
        case "end":
            return daliFunction("cut_end", `${command.name}, ${command.duration}`);
        default:
            return daliFunction("cut", `${command.name}, ${command.from}, ${command.duration}`);
    }
}

function importAudio(command: LoadAudio): string {
    return `${command.name} = ${daliFunction("importAudio", command.file)}`;
}

function importVideo(command: LoadVideo): string {
    return `${command.name} = ${daliFunction("importVideo", command.file)}`;
}

/*function text(command: Text): string {
    console.warn('createText is not implemented');
    const parameters = `${command.name}, backgroundColor=${command.backgroundColor}, textColor=${command.textColor}`;
    return daliFunction("createText", parameters);
}*/

function daliFunction(functionName: string, parameters: string): string {
    return `dali_movie.${functionName}(${parameters})\n`;
}

function getTime(time: string): string {
    const seconds = new Date(time).
}