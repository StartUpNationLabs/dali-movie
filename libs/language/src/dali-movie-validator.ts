import type { ValidationAcceptor, ValidationChecks } from "langium";
import {
  Cut,
  type DaliMovieAstType,
  type Script,
  type Command,
  type AddText,
  AddMedia,
} from "./generated/ast.js";
import type { DaliMovieServices } from "./dali-movie-module.js";

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: DaliMovieServices) {
  const registry = services.validation.ValidationRegistry;
  const validator = services.validation.DaliMovieValidator;
  const checks: ValidationChecks<DaliMovieAstType> = {
    Script: [
      validator.validateScriptUnicityOfIds,
      validator.validateStartBeforeEnd,
      validator.validatorScriptPreventEmptyFilename,
      validator.validateAllTimeFormat,
      validator.validateIllegalIdReferences,
      validator.validateQuotedFilename,
      validator.preventMultipleUseOfSameMedia
    ],
  };
  registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class DaliMovieValidator {
  validateScriptUnicityOfIds(script: Script, accept: ValidationAcceptor): void {
    const seenNames = new Map<string, Command>();

    script.commands.forEach((command) => {
      let name: string | undefined;
      switch (command.$type) {
        case "LoadAudio":
        case "LoadVideo":
        case "Cut":
        case "Text":
        case "AddText":
          name = (command as any).name;
          break;
      }

      if (name) {
        if (seenNames.has(name)) {
          accept("error", `The name '${name}' is already in use.`, {
            node: command,
            property: "name",
          });
        } else {
          seenNames.set(name, command);
        }
      }
    });
  }

  validateIllegalIdReferences(
    script: Script,
    accept: ValidationAcceptor
  ): void {
    let referential: string | undefined;
    script.commands.forEach((command) => {
      switch (command.$type) {
        case "Cut":
          let cut = command as Cut;
          if (cut.mediaRef?.ref?.name === cut.name) {
            accept(
              "error",
              "The name of the media addition cannot be the same as the name of the cut.",
              {
                node: command,
                property: "name",
              }
            );
          }
          break;
        case "AddMedia":
          let addMedia = command as AddMedia;
          let mediaRef = addMedia.mediaRef?.ref?.name;
          referential = addMedia.referential?.ref?.name;
          if (mediaRef && mediaRef === referential) {
            accept(
              "error",
              "can't add a media relatively to itself.",
              {
                node: command,
                property: "referential",
              }
            );
          }
          break;
        case "AddText":
          let addText = command as AddText;
          let name = addText.name;
          referential = addText.referential?.ref?.name;
          if (name && name === referential) {
            accept(
              "error",
              "can't add a text relatively to itself.",
              {
                node: command,
                property: "referential",
              }
            );
          }
      }
    });
  }

  validateStartBeforeEnd(script: Script, accept: ValidationAcceptor): void {
    script.commands.forEach((command) => {
      switch (command.$type) {
        case "Cut":
          let cut = command as Cut;
          if (this.startAfterEnd(cut.from, cut.duration)) {
            accept("error", "The end of the cut is before the start.", {
              node: command,
              property: "duration",
            });
          }
          break;
        case "AddMedia":
          let addMedia = command as AddMedia;
          if (this.startAfterEnd(addMedia.from, addMedia.duration)) {
            accept(
              "error",
              "The end of the cut made in the media addition is before his own start.",
              {
                node: command,
                property: "duration",
              }
            );
          }
          break;
      }
    });
  }

  validatorScriptPreventEmptyFilename(
    script: Script,
    accept: ValidationAcceptor
  ): void {
    const validateFilepath = (
      filepath: string,
      command: any,
      errorMessage: string
    ) => {
      if (!filepath || filepath === "") {
        accept("error", errorMessage, {
          node: command,
          property: "file",
        });
      }
    };

    script.commands.forEach((command) => {
      switch (command.$type) {
        case "LoadAudio":
        case "LoadVideo":
          let filepath = (command as any).file;
          validateFilepath(
            filepath,
            command,
            "The filepath of the file is empty. Please enter a filepath."
          );
          break;
        case "AddText":
        case "Text":
          let text = (command as AddText).content;
          if (text === "") {
            accept("error", "The text to add is empty. Please enter a text.", {
              node: command,
              property: "content",
            });
          }
          break;
      }
    });

    if (script.export) {
      validateFilepath(
        script.export.file,
        script.export,
        "The filepath of the output file is empty. Please enter a valid output path."
      );
    }
  }

  validateAllTimeFormat(script: Script, accept: ValidationAcceptor): void {
    const validateTime = (
      time: string,
      command: any,
      errorMessage: string,
      property: string
    ) => {
      if (!["start", "end"].includes(time) && !this.validateTimeFormat(time)) {
        accept("error", errorMessage, {
          node: command,
          property: property,
        });
      }
    };

    let commands: Command[] = [];

    script.commands.forEach((command) => {
      switch (command.$type) {
        case "Cut":
          break;
        case "AddMedia":
          let from = (command as any).from;
          if (from && from !== "") {
            validateTime(
              from,
              command,
              "Invalid start time format. Use XhYmZs (e.g. 1h2m3s or 2m3s or 3s), where X, Y, and Z are numbers (Y and Z ≤ 59).",
              "from"
            );
          }
          break;
        case "AddText":
        case "Text":
          let duration = (command as any).duration;
          if (duration && duration !== "") {
            validateTime(
              duration,
              command,
              "Invalid end time format. Use XhYmZs (e.g. 1h2m3s or 2m3s or 3s), where X, Y, and Z are numbers (Y and Z ≤ 59).",
              "duration"
            );
          }

          if (!["Cut", "Text"].includes(command.$type)) {
            commands.push(command);
          }
          break;
        default:
          break;
      }
    });

    commands.forEach((command) => {
      if (!(command as any).mode) {
        return;
      }

      let mode = (command as any).mode;
      let offset = (mode as any).offset;
      if (!offset || offset === "") {
        return;
      }
      validateTime(
        offset,
        mode,
        "Invalid offset time format. Use XhYmZs (e.g. 1h2m3s or 2m3s or 3s), where X, Y, and Z are numbers (Y and Z ≤ 59).",
        "offset"
      );
    });
  }

  private startAfterEnd(
    from: string | undefined,
    to: string | undefined
  ): boolean {
    if (!from || !to) return false;

    return this.timeToSecond(from) > this.timeToSecond(to);
  }

  private timeToSecond(time: string): number {
    let res = 0;
    let index = 0;

    if (time.includes("h")) {
      res += parseInt(time.substring(0, time.indexOf("h"))) * 3600;
      index = time.indexOf("h") + 1;
    }

    if (time.includes("m")) {
      res += parseInt(time.substring(index, time.indexOf("m"))) * 60;
      index = time.indexOf("m") + 1;
    }

    res += parseInt(time.substring(index, time.length - 1));

    return res;
  }

  private validateTimeFormat(time: string): boolean {
    if (!/^\d+((h\d+)?m\d+)?s$/.test(time)) {
      return false;
    }
    let index = 0;

    if (time.includes("h")) {
      index = time.indexOf("h") + 1;
    }

    if (time.includes("m")) {
      if (parseInt(time.substring(index, time.indexOf("m"))) > 59) {
        return false;
      }
      index = time.indexOf("m") + 1;
    }

    return parseInt(time.substring(index, time.length - 1)) <= 59;
  }

  validateQuotedFilename(script: Script, accept: ValidationAcceptor) {
    const regex = /[a-zA-Z0-9_\-\/\\. ]+\.[a-zA-Z0-9]+/;

    script.commands.forEach((command) => {
      if (command.$type === "LoadAudio" || command.$type === "LoadVideo") {
        let file = (command as any).file;
        if (!regex.test(file.substring(1, file.length - 1))) {
          accept(
            "error",
            "The filepath of the file is invalid. It must be of format 'path_to_file.file_extension'.",
            {
              node: command,
              property: "file",
            }
          );
        }
      }
    });

    if (script.export) {
      const filename = script.export.file;
      if (!regex.test(filename.substring(1, filename.length - 1))) {
        accept(
          "error",
          "The filepath of the file is invalid. Please enter a valid filepath.",
          {
            node: script,
            property: "export",
          }
        );
      }
    }
  }

  preventMultipleUseOfSameMedia(script: Script, accept: ValidationAcceptor) {
    const seenNames = new Map<string, Command>();

    script.commands.forEach((command) => {
      if (command.$type === "AddMedia") {
        let name = (command as AddMedia).mediaRef.ref?.name;
        if (name) {
          if (seenNames.has(name)) {
            accept(
              "error",
              `The media '${name}' is already used in the timeline, multiple usage of same media is forbidden.`,
              {
                node: command,
                property: "mediaRef",
              }
            );
          }
          else {
            seenNames.set(name, command);
          }
        }
      }
    });
  }
}
