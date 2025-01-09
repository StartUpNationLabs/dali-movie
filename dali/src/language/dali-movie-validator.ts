import type { ValidationChecks } from "langium";
import type { DaliMovieAstType } from "./generated/ast.js";
import type { DaliMovieServices } from "./dali-movie-module.js";

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: DaliMovieServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.DaliMovieValidator;
    const checks: ValidationChecks<DaliMovieAstType> = {
        // Person: validator.checkPersonStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class DaliMovieValidator {

    /*checkPersonStartsWithCapital(person: Person, accept: ValidationAcceptor): void {
        if (person.name) {
            const firstChar = person.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
            }
        }
    }*/

}
