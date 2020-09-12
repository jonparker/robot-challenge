import { Robot, Compass, isError } from './Robot';
import { promises as fsPromises } from 'fs';
import { argv } from 'process';

(async () => {
    const fileContent = (await fsPromises.readFile(argv[2])).toString().split('\n');
    const [initialLocation, commands, ..._] = fileContent;
    const finalLocation = Robot(initialLocation, commands);
    const output = isError(finalLocation) ? finalLocation.message :
        `Final location: ${Compass[finalLocation.orientation]} ${finalLocation.x} ${finalLocation.y}`
    // tslint:disable-next-line: no-console
    console.log(output);
})();