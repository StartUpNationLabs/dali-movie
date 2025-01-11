import { toString } from "langium/generate";
import * as fs from "node:fs";
import * as path from "node:path";
import type { AddMedia, Command, Cut, LoadAudio, LoadVideo, Script } from "../language/generated/ast.js";
import { extractDestinationAndName } from "./cli-util.js";

export function generateMoviePython(model: Script, filePath: string, destination: string | undefined): string {
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.py`;

    let code: string = `from dali_movie.dali_movie import Dali_movie, MODE, ANCHOR_TYPE
from moviepy.audio.AudioClip import AudioClip

#INIT
font_path = "./dali_movie/resources/arial.TTF"
dali_movie = Dali_movie(font_path)

#SCRIPT
`;

    model.commands.forEach(command => code += generateCommand(command));

    code += "\n" + daliFunction("export", quoted(model.export?.file));

    if (!fs.existsSync(data.destination)) {
        fs.mkdirSync(data.destination, { recursive: true });
    }
    fs.writeFileSync(generatedFilePath, toString(code));
    return generatedFilePath;
}

function generateCommand(command: Command): string {
    switch (command.$type) {
        case "AddMedia":
            return addMedia(command);
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

function addMedia(command: AddMedia): string {
    let variableName: string | undefined;
    let cutCode = "";
    if (command.from && command.duration) {
        variableName = `${command.mediaRef.$refText}_${command.from}_${command.duration}`;
        cutCode = cut({
            $container: command.$container,
            $type: "Cut",
            duration: command.duration,
            from: command.from,
            mediaRef: command.mediaRef,
            name: variableName
        });
    }
    return cutCode + daliFunction("add", getParameters(command, variableName));
}

function getParameters(command: AddMedia, variableName?: string): string {
    let parameters = variableName ?? `${command.mediaRef.$refText}`;
    if (command.mode) {
        const mode = command.mode;
        parameters += `, mode=${getMode(mode)}`;
        parameters += `, anchor_type=${quoted(mode.anchor)}`;
        if (mode.offset) parameters += `, offset=${getTime(mode.offset)}`;
    }
    if (command.referential) parameters += `, reference=${command.referential.$refText}`;
    return parameters;
}

function getMode(mode: AddMedia["mode"]): string {
    switch (mode?.$type) {
        case "StartingRule":
            return "MODE.START";
        case "EndingRule":
            return "MODE.END";
        default:
            return "None";
    }
}

/*function addText(command: AddText): string {
    console.warn('addText is not implemented');
    console.warn('\tDifference between title and subtitle is not handled');
    const parameters = `${command.name}, ${command.duration}`;
    return daliFunction("addText", parameters);
}*/

function cut(command: Cut): string {
    const start = command.name + " = ";
    switch (command.from) {
        case "start":
            return start + daliFunction("cut_start", `${command.mediaRef.$refText}, ${getTime(command.duration)}`);
        case "end":
            return start + daliFunction("cut_end", `${command.mediaRef.$refText}, ${getTime(command.duration)}`);
        default:
            return start + daliFunction("cut", `${command.mediaRef.$refText}, ${getTime(command.from)}, ${getTime(command.duration)}`);
    }
}

function importAudio(command: LoadAudio): string {
    return `${command.name} = ${daliFunction("importAudio", quoted(command.file))}`;
}

function importVideo(command: LoadVideo): string {
    return `${command.name} = ${daliFunction("importVideo", quoted(command.file))}`;
}

/*function text(command: Text): string {
    console.warn('createText is not implemented');
    const parameters = `${command.name}, backgroundColor=${command.backgroundColor}, textColor=${command.textColor}`;
    return daliFunction("createText", parameters);
}*/

function daliFunction(functionName: string, parameters: string): string {
    return `dali_movie.${functionName}(${parameters})\n`;
}

function quoted(text?: string): string {
    return text ? `"${text}"` : "";
}

function getTime(time: string): number {
    const split = time.slice(0, time.length - 1).split(/[hm]/);
    return split.reduceRight((acc, val, index) => acc + ~~val * Math.pow(60, split.length - 1 - index), 0);
}