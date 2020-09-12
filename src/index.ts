import { RobotControl } from './Robot';
import * as fs from 'fs';
import { argv } from 'process';

(async () => {
    const fileContent = (await fs.promises.readFile(argv[2])).toString().split('\n');
    const [initialLocationStr, commandsStr, ..._] = fileContent;
    const [initialDirectionStr, xStr, yStr] = initialLocationStr.split(' ');
    const initialLocation = RobotControl.parseInitialLocation(initialDirectionStr, xStr, yStr);
    if (!initialLocation)
    {
        console.log(`Initial location ${initialLocationStr} could not be parsed.`);
        return;
    }
    enum CommandBuffer { CommandChar, CommandCharAndDigit, Empty };
    type CommandInfo = { command: string, repeats?: number };

    let commandListTmp: CommandInfo[] = [];
    let commandBuffer: CommandBuffer = CommandBuffer.Empty;
    
    commandsStr.split('').forEach(cmdChar => {
        const cmdInt = Number.parseInt(cmdChar);
        const cmdIsInt = !isNaN(cmdInt);

        switch (commandBuffer) {
            case CommandBuffer.Empty:
                commandListTmp.push({ command: cmdChar });
                commandBuffer = CommandBuffer.CommandChar;
                break;
            case CommandBuffer.CommandChar:
                if (cmdIsInt)
                {
                    const cmd = commandListTmp.pop();
                    if (cmd) {
                        commandListTmp.push({ ...cmd, repeats: cmdInt });
                    }
                    commandBuffer = CommandBuffer.CommandCharAndDigit;
                }
                else {
                    commandListTmp.push({ command: cmdChar });
                }
                break;
            case CommandBuffer.CommandCharAndDigit:
                if (cmdIsInt) {
                    const cmd = commandListTmp.pop();
                    if (cmd) {
                        commandListTmp.push({ ...cmd, repeats: (10 * (cmd.repeats || 0)) + cmdInt });
                    }
                    commandBuffer = CommandBuffer.Empty;
                }
                else {
                    commandListTmp.push({ command: cmdChar });
                    commandBuffer = CommandBuffer.CommandChar;
                }
                break;
        }
    });

    const commandList = commandListTmp.map(cmd => RobotControl.parseRobotCommand(cmd.command, cmd.repeats || 1 ));
    const finalLocation = RobotControl.Robot(initialLocation, commandList);
    console.log(`Final location: ${RobotControl.Compass[finalLocation.orientation]} ${finalLocation.x} ${finalLocation.y}`);
})();