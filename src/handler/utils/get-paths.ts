import fs from 'fs/promises';
import path from 'path';

export async function getFilePaths(directory: string, nesting?: boolean): Promise<string[]> {
  let filePaths: string[] = [];

  if (!directory) return filePaths;

  const files = await fs.readdir(directory, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(directory, file.name);

    if (file.isFile()) {
      filePaths.push(filePath);
    }

    if (nesting && file.isDirectory()) {
      filePaths = [...filePaths, ...(await getFilePaths(filePath, true))];
    }
  }

  return filePaths;
}

export async function getFolderPaths(directory: string, nesting?: boolean): Promise<string[]> {
  let folderPaths: string[] = [];

  if (!directory) return folderPaths;

  const folders = await fs.readdir(directory, { withFileTypes: true });

  for (const folder of folders) {
    const folderPath = path.join(directory, folder.name);

    if (folder.isDirectory()) {
      folderPaths.push(folderPath);

      if (nesting) {
        folderPaths = [...folderPaths, ...(await getFolderPaths(folderPath, true))];
      }
    }
  }

  return folderPaths;
}
