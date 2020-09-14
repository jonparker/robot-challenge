import { Robot } from './Robot';
import { Compass, isError } from './Types';

describe('Robot', () => {
    type DataRow = { initialLocation: string, commands: string, expected: string };
    test.each`
    initialLocation | commands       | expected
    ${'N 0 0'}      | ${'M1RM4L3M2'} | ${'South 4 99'}
    `('Robot("$input.initialLocation", "$input.commands") - $input.expected', (row: DataRow) => {
        const result = Robot(row.initialLocation, row.commands);
        expect(isError(result)).toBeFalsy();
        if (!isError(result))
            expect(`${Compass[result.orientation]} ${result.x} ${result.y}`).toBe(row.expected);
    });
});