import { AsciiTable3 } from 'ascii-table3';
import fs from 'node:fs';
import { ComponentHandlerOptions } from '../../@types';

var table = new AsciiTable3();
table.setHeading('Buttons', 'Stats');

export class ComponentHandler {
  #data: ComponentHandlerOptions;

  constructor({ ...options }: ComponentHandlerOptions) {
    this.#data = options;
  }

  async init() {
    const componentFolders = fs.readdirSync('./src/components');
    for (const folder of componentFolders) {
      const componentFile = fs
        .readdirSync(`./src/components/${folder}`)
        .filter((path) => path.endsWith('.js') || path.endsWith('.ts'));

      switch (folder) {
        case 'buttons':
          for (const file of componentFile) {
            const button = require(`../components/${folder}/${file}`);
            table.addRow(button.data.name, '✅');
            this.#data.client.buttons.set(button.data.name, button);
          }
          break;

        default:
          break;
      }
    }

    console.log(table.toString());
  }
}
