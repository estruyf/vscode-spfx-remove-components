import * as vscode from 'vscode';
import * as stripJsonComments from 'strip-json-comments';

export class FileHelper {

  /**
   * Retrieve the JSON file contents
   * 
   * @param fileUri 
   */
  public static async getJsonContents<T>(fileUri: vscode.Uri): Promise<T | null> {
    const file = await vscode.workspace.openTextDocument(fileUri.path);
    if (file) {
      const contents = file.getText();
      if (contents) {
        const configJson: T = JSON.parse(stripJsonComments(contents));
        return configJson;
      }
    }
    return null;
  }
}