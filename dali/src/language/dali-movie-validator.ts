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
    Script: [validator.validateScriptUnicityOfIds, validator.validateStartBeforeEnd, validator.validatorScriptPreventEmptyFilename],
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

  validatorScriptPreventEmptyFilename(script: Script, accept: ValidationAcceptor): void {
    const validateFilepath = (filepath: string, command: any, errorMessage: string) => {
      if (!filepath || filepath === "") {
        accept(
          "error",
          errorMessage,
          {
            node: command,
            property: "file",
          }
        );
      }
    };

    script.commands.forEach((command) => {
      switch (command.$type) {
        case "LoadAudio":
        case "LoadVideo":
          let filepath = (command as any).file;
          validateFilepath(filepath, command, "The filepath of the file is empty. Please enter a filepath.");
          break;
        case "AddText":
          case "Text":
          let text = (command as AddText).content;
          if (text === "") {
            accept(
              "error",
              "The text to add is empty. Please enter a text.",
              {
                node: command,
                property: "content",
              }
            );
          }
          break;
        }
      });

      if (script.export) {
        validateFilepath(script.export.file, script.export, "The filepath of the output file is empty. Please enter a valid output path.");
      }
  }

  private startAfterEnd(
    from: string | undefined,
    to: string | undefined
  ): boolean {
    if (!from || !to) return false;
    
    return this.timeToSecond(from) > this.timeToSecond(to);
  }

  private timeToSecond(time: string) : number {
    let res = 0;
    let index = 0;

    if (time.includes("h")) {
        res += parseInt(time.substring(0, time.indexOf("h"))) * 3600;
        index=time.indexOf("h")+1
    }

    if (time.includes("m")) {
      res += parseInt(time.substring(index, time.indexOf("m"))) * 60;
      index=time.indexOf("m")+1
    }

    res += parseInt(time.substring(index, time.length-1));

    return res;
  }
}
