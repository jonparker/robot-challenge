import { Robot } from './Robot';
import { Compass, isError } from './Types';

describe('Robot', () => {
    type DataRow = { initialLocation: string, commands: string, expected: string };
    test.each`
    initialLocation | commands              | expected
    ${'N 0 0'}      | ${'M1RM4L3M2'}        | ${'S 4 99'}
    ${'N 99 99'}    | ${'M1M1M1M1M1'}       | ${'N 99 4'}
    ${'S 99 0'}     | ${'M1M1M1M1M1'}       | ${'S 99 95'}
    ${'W 0 0'}      | ${'M10M10M10M10M10'}  | ${'W 50 0'}
    ${'W 0 0'}      | ${'M10L1M10M10M10'}   | ${'S 90 70'}
    `('Robot("$input.initialLocation", "$input.commands") - $input.expected', (row: DataRow) => {
        const result = Robot(row.initialLocation, row.commands);
        expect(isError(result)).toBeFalsy();
        if (!isError(result))
            expect(`${Compass[result.orientation]} ${result.x} ${result.y}`).toBe(row.expected);
    });
});