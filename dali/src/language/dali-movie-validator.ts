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
    Script: validator.validateScriptUnicityOfIds,
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
          name = (command as any).name;
          break;
        case "AddText":
          if ((command as AddText).name) {
            name = (command as AddText).name;
          }
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

  private startAfterEnd(
    from: string | undefined,
    to: string | undefined
  ): boolean {
    if (!from || !to) return false;
    return false;
  }
}
