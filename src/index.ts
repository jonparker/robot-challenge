import Robot from './Robot'
import { promises as fsPromises } from 'fs'
import { argv, stdout } from 'process'
import { Compass, isError } from './Types'
(async () => {
    const fileContent = (await fsPromises.readFile(argv[2]))
        .toString()
        .split('\n')
    const [initialLocation, commands, ..._] = fileContent
    const finalLocation = Robot(initialLocation, commands)
    const output = isError(finalLocation)
        ? finalLocation.message
        : `${Compass[finalLocation.orientation]} ${finalLocation.x} ${
              finalLocation.y
          }\n`
    stdout.write(output)
})()
