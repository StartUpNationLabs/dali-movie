/******************************************************************************
 * This file was generated by langium-cli 3.3.0.
 * DO NOT EDIT MANUALLY!
 ******************************************************************************/

/* eslint-disable */
import type { AstNode, Reference, ReferenceInfo, TypeMetaData } from 'langium';
import { AbstractAstReflection } from 'langium';

export const DaliMovieTerminals = {
    WS: /\s+/,
    ID: /[_a-zA-Z][\w_]*/,
    QUOTED_STRING: /(["'])(?:(?=(\\?))\2.)*?\1/,
    TIME: /\d+(m\d+)?s/,
    HEX_COLOR: /#?([0-9a-f]{6}|[0-9a-f]{3})/,
    PERCENTAGE: /([0-9]{1,2})/,
    ML_COMMENT: /\/\*[\s\S]*?\*\//,
    SL_COMMENT: /\/\/[^\n\r]*/,
};

export type DaliMovieTerminalNames = keyof typeof DaliMovieTerminals;

export type DaliMovieKeywordNames = 
    | ","
    | "100"
    | "BEIGE"
    | "BLACK"
    | "BLUE"
    | "BROWN"
    | "CYAN"
    | "GOLD"
    | "GRAY"
    | "GREEN"
    | "INDIGO"
    | "LIME"
    | "MAGENTA"
    | "ORANGE"
    | "PINK"
    | "PURPLE"
    | "RED"
    | "SILVER"
    | "TEAL"
    | "VIOLET"
    | "WHITE"
    | "YELLOW"
    | "add"
    | "after"
    | "at"
    | "audio"
    | "background"
    | "before"
    | "color"
    | "cut"
    | "end"
    | "ending"
    | "export"
    | "for"
    | "from"
    | "here"
    | "import"
    | "named"
    | "position"
    | "start"
    | "starting"
    | "text"
    | "to"
    | "video";

export type DaliMovieTokenNames = DaliMovieTerminalNames | DaliMovieKeywordNames;

export type Color = 'BEIGE' | 'BLACK' | 'BLUE' | 'BROWN' | 'CYAN' | 'GOLD' | 'GRAY' | 'GREEN' | 'INDIGO' | 'LIME' | 'MAGENTA' | 'ORANGE' | 'PINK' | 'PURPLE' | 'RED' | 'SILVER' | 'TEAL' | 'VIOLET' | 'WHITE' | 'YELLOW' | string;

export function isColor(item: unknown): item is Color {
    return item === 'RED' || item === 'BLUE' || item === 'GREEN' || item === 'YELLOW' || item === 'ORANGE' || item === 'PURPLE' || item === 'PINK' || item === 'BLACK' || item === 'WHITE' || item === 'GRAY' || item === 'BROWN' || item === 'CYAN' || item === 'MAGENTA' || item === 'LIME' || item === 'TEAL' || item === 'INDIGO' || item === 'VIOLET' || item === 'GOLD' || item === 'SILVER' || item === 'BEIGE' || (typeof item === 'string' && (/#?([0-9a-f]{6}|[0-9a-f]{3})/.test(item)));
}

export type Command = AddMedia | AddText | Cut | LoadAudio | LoadVideo | Text;

export const Command = 'Command';

export function isCommand(item: unknown): item is Command {
    return reflection.isInstance(item, Command);
}

export type Media = Cut | LoadAudio | LoadVideo | Text;

export const Media = 'Media';

export function isMedia(item: unknown): item is Media {
    return reflection.isInstance(item, Media);
}

export type Percentage = number;

export function isPercentage(item: unknown): item is Percentage {
    return typeof item === 'number';
}

export type Referentials = AddText | Cut | LoadAudio | LoadVideo | Text;

export const Referentials = 'Referentials';

export function isReferentials(item: unknown): item is Referentials {
    return reflection.isInstance(item, Referentials);
}

export interface AddMedia extends AstNode {
    readonly $container: Script;
    readonly $type: 'AddMedia';
    duration?: string;
    from?: 'end' | 'start' | string;
    mediaRef: Reference<Media>;
    mode?: EndingRule | StartingRule;
    referential?: Reference<Referentials>;
}

export const AddMedia = 'AddMedia';

export function isAddMedia(item: unknown): item is AddMedia {
    return reflection.isInstance(item, AddMedia);
}

export interface AddText extends AstNode {
    readonly $container: Script;
    readonly $type: 'AddText';
    content: string;
    duration: string;
    mode?: EndingRule | StartingRule;
    name?: string;
    referential?: Reference<Referentials>;
}

export const AddText = 'AddText';

export function isAddText(item: unknown): item is AddText {
    return reflection.isInstance(item, AddText);
}

export interface Cut extends AstNode {
    readonly $container: Script;
    readonly $type: 'Cut';
    duration: string;
    from: 'end' | 'start' | string;
    mediaRef: Reference<Media>;
    name: string;
}

export const Cut = 'Cut';

export function isCut(item: unknown): item is Cut {
    return reflection.isInstance(item, Cut);
}

export interface EndingRule extends AstNode {
    readonly $container: AddMedia | AddText;
    readonly $type: 'EndingRule';
    anchor: 'at' | 'before';
    offset?: string;
}

export const EndingRule = 'EndingRule';

export function isEndingRule(item: unknown): item is EndingRule {
    return reflection.isInstance(item, EndingRule);
}

export interface Export extends AstNode {
    readonly $container: Script;
    readonly $type: 'Export';
    outputFilepath: string;
}

export const Export = 'Export';

export function isExport(item: unknown): item is Export {
    return reflection.isInstance(item, Export);
}

export interface LoadAudio extends AstNode {
    readonly $container: Script;
    readonly $type: 'LoadAudio';
    file: string;
    name: string;
}

export const LoadAudio = 'LoadAudio';

export function isLoadAudio(item: unknown): item is LoadAudio {
    return reflection.isInstance(item, LoadAudio);
}

export interface LoadVideo extends AstNode {
    readonly $container: Script;
    readonly $type: 'LoadVideo';
    file: string;
    name: string;
}

export const LoadVideo = 'LoadVideo';

export function isLoadVideo(item: unknown): item is LoadVideo {
    return reflection.isInstance(item, LoadVideo);
}

export interface Script extends AstNode {
    readonly $type: 'Script';
    commands: Array<Command>;
    export?: Export;
}

export const Script = 'Script';

export function isScript(item: unknown): item is Script {
    return reflection.isInstance(item, Script);
}

export interface StartingRule extends AstNode {
    readonly $container: AddMedia | AddText;
    readonly $type: 'StartingRule';
    anchor: 'after' | 'at';
    offset?: string;
}

export const StartingRule = 'StartingRule';

export function isStartingRule(item: unknown): item is StartingRule {
    return reflection.isInstance(item, StartingRule);
}

export interface Text extends AstNode {
    readonly $container: Script;
    readonly $type: 'Text';
    backgroundColor?: Color;
    content: string;
    duration: string;
    name: string;
    percentageFromLeft?: Percentage;
    percentageFromTop?: Percentage;
    textColor?: Color;
}

export const Text = 'Text';

export function isText(item: unknown): item is Text {
    return reflection.isInstance(item, Text);
}

export type DaliMovieAstType = {
    AddMedia: AddMedia
    AddText: AddText
    Command: Command
    Cut: Cut
    EndingRule: EndingRule
    Export: Export
    LoadAudio: LoadAudio
    LoadVideo: LoadVideo
    Media: Media
    Referentials: Referentials
    Script: Script
    StartingRule: StartingRule
    Text: Text
}

export class DaliMovieAstReflection extends AbstractAstReflection {

    getAllTypes(): string[] {
        return [AddMedia, AddText, Command, Cut, EndingRule, Export, LoadAudio, LoadVideo, Media, Referentials, Script, StartingRule, Text];
    }

    protected override computeIsSubtype(subtype: string, supertype: string): boolean {
        switch (subtype) {
            case AddMedia: {
                return this.isSubtype(Command, supertype);
            }
            case AddText: {
                return this.isSubtype(Command, supertype) || this.isSubtype(Referentials, supertype);
            }
            case Cut:
            case LoadAudio:
            case LoadVideo:
            case Text: {
                return this.isSubtype(Command, supertype) || this.isSubtype(Media, supertype) || this.isSubtype(Referentials, supertype);
            }
            default: {
                return false;
            }
        }
    }

    getReferenceType(refInfo: ReferenceInfo): string {
        const referenceId = `${refInfo.container.$type}:${refInfo.property}`;
        switch (referenceId) {
            case 'AddMedia:mediaRef':
            case 'Cut:mediaRef': {
                return Media;
            }
            case 'AddMedia:referential':
            case 'AddText:referential': {
                return Referentials;
            }
            default: {
                throw new Error(`${referenceId} is not a valid reference id.`);
            }
        }
    }

    getTypeMetaData(type: string): TypeMetaData {
        switch (type) {
            case AddMedia: {
                return {
                    name: AddMedia,
                    properties: [
                        { name: 'duration' },
                        { name: 'from' },
                        { name: 'mediaRef' },
                        { name: 'mode' },
                        { name: 'referential' }
                    ]
                };
            }
            case AddText: {
                return {
                    name: AddText,
                    properties: [
                        { name: 'content' },
                        { name: 'duration' },
                        { name: 'mode' },
                        { name: 'name' },
                        { name: 'referential' }
                    ]
                };
            }
            case Cut: {
                return {
                    name: Cut,
                    properties: [
                        { name: 'duration' },
                        { name: 'from' },
                        { name: 'mediaRef' },
                        { name: 'name' }
                    ]
                };
            }
            case EndingRule: {
                return {
                    name: EndingRule,
                    properties: [
                        { name: 'anchor' },
                        { name: 'offset' }
                    ]
                };
            }
            case Export: {
                return {
                    name: Export,
                    properties: [
                        { name: 'outputFilepath' }
                    ]
                };
            }
            case LoadAudio: {
                return {
                    name: LoadAudio,
                    properties: [
                        { name: 'file' },
                        { name: 'name' }
                    ]
                };
            }
            case LoadVideo: {
                return {
                    name: LoadVideo,
                    properties: [
                        { name: 'file' },
                        { name: 'name' }
                    ]
                };
            }
            case Script: {
                return {
                    name: Script,
                    properties: [
                        { name: 'commands', defaultValue: [] },
                        { name: 'export' }
                    ]
                };
            }
            case StartingRule: {
                return {
                    name: StartingRule,
                    properties: [
                        { name: 'anchor' },
                        { name: 'offset' }
                    ]
                };
            }
            case Text: {
                return {
                    name: Text,
                    properties: [
                        { name: 'backgroundColor' },
                        { name: 'content' },
                        { name: 'duration' },
                        { name: 'name' },
                        { name: 'percentageFromLeft' },
                        { name: 'percentageFromTop' },
                        { name: 'textColor' }
                    ]
                };
            }
            default: {
                return {
                    name: type,
                    properties: []
                };
            }
        }
    }
}

export const reflection = new DaliMovieAstReflection();
