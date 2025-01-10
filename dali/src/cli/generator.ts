import { toString } from "langium/generate";
import * as fs from "node:fs";
import * as path from "node:path";
import type { Command, Cut, LoadAudio, LoadVideo, Script } from "../language/generated/ast.js";
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

    code += "\n" + daliFunction("export", file(model.export?.file));

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
    return `${command.name} = ${daliFunction("importAudio", file(command.file))}`;
}

function importVideo(command: LoadVideo): string {
    return `${command.name} = ${daliFunction("importVideo", file(command.file))}`;
}

/*function text(command: Text): string {
    console.warn('createText is not implemented');
    const parameters = `${command.name}, backgroundColor=${command.backgroundColor}, textColor=${command.textColor}`;
    return daliFunction("createText", parameters);
}*/

function daliFunction(functionName: string, parameters: string): string {
    return `dali_movie.${functionName}(${parameters})\n`;
}

function file(file?: string): string {
    return file ? `"${file}"` : "";
}

function getTime(time: string): string {
    const split = time.slice(0, time.length - 1).split(/[hm]/);
    return `(${split.join()})`;
}