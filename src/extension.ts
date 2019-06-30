import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as rimraf from 'rimraf';

import { SPFxConfig, SPFxManifest } from './models';
import { FileHelper } from './helpers/FileHelper';

/**
 * TODO: Test folder path on windows
 * TODO: Refactor
 * TODO: Documentation
 * TODO: Update contents in package.json
 * TODO: Logo
 * TODO: Publish
 */

const EXTENSION_LOG_NAME = "[SPFx remove]";

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('estruyf.removespfxcomponent', async () => {
		try {
			const wsFolder = vscode.workspace.rootPath;
			if (wsFolder) {
				// Check if git is enabled
				const isGitEnabled = fs.existsSync(path.join(wsFolder, '.git'));
				let proceed = false;
				if (!isGitEnabled) {
					const confirmValue = await vscode.window.showQuickPick(["no", "yes"], {
						placeHolder: "You are not using GIT, are you sure you want to remove the component?",
						canPickMany: false
					});
					proceed = confirmValue === "yes";
				} else {
					proceed = true;
				}

				if (proceed) {
					// Find all manifest files in the current project
					const manifests = await vscode.workspace.findFiles('**/src/**/*.manifest.json', "node_modules");
					if (manifests && manifests.length > 0) {
						let entries = [];
						for (const manifest of manifests) {
							const manifestJson = await FileHelper.getJsonContents<SPFxManifest>(manifest);
							if (manifestJson && manifestJson.alias) {
								entries.push({
									path: manifest.path.replace(wsFolder, "."),
									name: manifestJson.alias
								});
							}
						}

						if (entries.length === 0) {
							vscode.window.showWarningMessage(`${EXTENSION_LOG_NAME}: No component manifest files found.`);
							return;
						}

						// Show a prompt to ask which component to remove
						const removeName = await vscode.window.showQuickPick(entries.map(e => e.name), {
							placeHolder: "Which component do you want to remove?",
							canPickMany: false
						});

						// Start the file / folder deletion
						if (!removeName) {
							return;
						}

						const entryToremove = entries.find(e => e.name === removeName);
						if (!entryToremove) {
							return;
						}

						// Retrieve the global configuration file
						const configFiles = await vscode.workspace.findFiles('**/config/**/config.json', "node_modules", 1);
						if (configFiles && configFiles.length > 0) {
							const config = configFiles[0];
							const configJson = await FileHelper.getJsonContents<SPFxConfig>(config);

							if (!configJson) {
								return;
							}

							// Which entry to update
							const keysToremove: string[] = [];
							for (const bundleName in configJson.bundles) {
								let bundle = configJson.bundles[bundleName];
								// Filter out the components to remove
								bundle.components = bundle.components.filter(c => c.manifest.toLowerCase() !== entryToremove.path.toLowerCase())
								
								if (bundle.components.length === 0) {
									keysToremove.push(bundleName);
								}
							}
							
							// Check if there are bundle entries which can be removed
							for (const keyToremove of keysToremove) {
								remove configJson.bundles[keyToremove];
							}

							// Store the updated config
							fs.writeFileSync(config.path, JSON.stringify(configJson, null, 2));

							// Remove the component folder
							const folderPath = entryToremove.path.substring(0, entryToremove.path.lastIndexOf("/"));
							const absPath = path.join(wsFolder, folderPath);
							if (fs.existsSync(absPath)) {
								rimraf.sync(absPath);
								vscode.window.showInformationMessage(`${EXTENSION_LOG_NAME}: Component ${removeName} was successfully removed.`);
							}
						}
					}
				}
			}
		} catch (e) {
			vscode.window.showErrorMessage(`${EXTENSION_LOG_NAME}: Sorry, something went wrong.`);
			console.error(e);
		}
	});
	
	context.subscriptions.push(disposable);

	console.log('[vscode-spfx-remove-components]: is now active!');
}

export function deactivate() {}