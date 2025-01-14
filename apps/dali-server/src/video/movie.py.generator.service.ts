import {Injectable} from "@nestjs/common";
import path from "node:path";
import {EXPORTED_PATH, FONT_PATH, GENERATED_PATH, UPLOAD_PATH} from "../constants";


@Injectable()
export class MoviePyGeneratorService {
  public createDaliMovieServices;
  public EmptyFileSystem;
  public URI;
  public generateMovieFromServerPython;

  async load() {
    this.EmptyFileSystem = (await (eval(`import("langium")`))).EmptyFileSystem;
    this.URI = (await (eval(`import("langium")`))).URI;
    this.createDaliMovieServices = (await (eval(`import("../../libs/language")`))).createDaliMovieServices;
    this.generateMovieFromServerPython = (await (eval(`import("@dali-movie/generator")`))).generateMovieFromServerPython;

  }

  async generateMoviePyScript(daliCode: string, sessionId: string) {
    if (!this.createDaliMovieServices) {
      await this.load();
    }
    const services = this.createDaliMovieServices(this.EmptyFileSystem);
    const documentBuilder = services.shared.workspace.DocumentBuilder;
    const document = services.shared.workspace.LangiumDocumentFactory.fromString(daliCode, this.URI.file(sessionId), {});
    services.shared.workspace.LangiumDocuments.addDocument(document);
    await documentBuilder.build([document]);
    const model = document.parseResult.value;
    this.updateFilePath(document, sessionId);

    this.generateMovieFromServerPython(
      model,
      GENERATED_PATH + sessionId,
      'main.py',
      FONT_PATH.replace(/\\/g, '\\\\')
    );
    return path.join(GENERATED_PATH, sessionId, 'main.py');
  }

  updateFilePath(
    document: any,
    sessionId: string
  ): void {
    const rootNode = document.parseResult?.value;
    if (!rootNode) {
      console.error('Failed to parse the document.');
      return;
    }

    document.parseResult.value.commands.forEach((command: any) => {
      switch (command.$type) {
        case 'LoadVideo':
        case 'LoadAudio':
          command.file = path
            .join(UPLOAD_PATH, sessionId, command.file)
            .replace(/\\/g, '\\\\');
      }
    });

    const exportValue = document.parseResult.value.export;
    if (exportValue) {
      exportValue.file = path
        .join(EXPORTED_PATH, sessionId, exportValue.file)
        .replace(/\\/g, '\\\\');
    }
  }
}
