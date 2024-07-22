import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';

// Function to convert .ipynb to .md using Jupytext
function convertIpynbToMd(filePath: string) {
    // Path to the bundled Python interpreter on Windows
    const pythonPath = path.join(__dirname, 'jupytext_env', 'python.exe');

    // Command to convert .ipynb to .md
    const command = `"${pythonPath}" -m jupytext --to md "${filePath}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            vscode.window.showErrorMessage(`Error converting notebook to Markdown: ${error.message}`);
            return;
        }
        if (stderr) {
            vscode.window.showWarningMessage(`Warning: ${stderr}`);
        }
        vscode.window.showInformationMessage(`Converted notebook to Markdown successfully.`);
    });
}

export function activate(context: vscode.ExtensionContext) {
    // Watch for .ipynb file saves
    const watcher = vscode.workspace.createFileSystemWatcher('**/*.ipynb');

    // On save event
    watcher.onDidChange((uri: vscode.Uri) => {
        convertIpynbToMd(uri.fsPath);
    });

    watcher.onDidCreate((uri: vscode.Uri) => {
        convertIpynbToMd(uri.fsPath);
    });

    context.subscriptions.push(watcher);
}

export function deactivate() {}
