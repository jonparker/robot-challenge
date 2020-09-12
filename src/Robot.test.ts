import { robotParser, Compass } from './Robot';

describe('RobotControl.parser.parseDirection', () => {
    test.each([
        ['N', Compass.North],
        ['S', Compass.South],
        ['E', Compass.East],
        ['W', Compass.West]
    ])('parseDirection("%s") - %s', (input, expected) => {
        const result = robotParser.parseDirection(input);
        expect(result).toBe(expected);
    });
});

describe('RobotControl.parser.parseInitialLocation', () => {
    test.each`
    direction | x      | y      | expectX | expectY | expectOrientation
    ${'N'}    | ${'0'} | ${'0'} | ${0}    | ${0}    | ${Compass.North}
    ${'S'}    | ${'0'} | ${'0'} | ${0}    | ${0}    | ${Compass.South}
    ${'E'}    | ${'0'} | ${'0'} | ${0}    | ${0}    | ${Compass.East}
    ${'W'}    | ${'0'} | ${'0'} | ${0}    | ${0}    | ${Compass.West}
    ${'N'}    | ${'99'}| ${'99'}| ${99}   | ${99}   | ${Compass.North}
    ${'S'}    | ${'99'}| ${'0'} | ${99}   | ${0}    | ${Compass.South}
    `('parseInitialLocation("$direction", "$x", "$y") - { x: $expectX, y: $expectY, orientation: $expectOrientation, portals: {} }', (row : any) => {
        const result = robotParser.parseInitialLocation(row.direction, row.x, row.y);
        expect(result).toEqual({ x: row.expectX, y: row.expectY, orientation: row.expectOrientation, portals: {} });
    });
});

describe('RobotControl.parser.parseRobotCommand', () => {
    type DataRow = { direction: string, x: string, y: string, expectX: number, expectY: number, expectOrientation: Compass};
    test.each`
    direction | x      | y      | expectX | expectY | expectOrientation
    ${'N'}    | ${'0'} | ${'0'} | ${0}    | ${0}    | ${Compass.North}
    ${'S'}    | ${'0'} | ${'0'} | ${0}    | ${0}    | ${Compass.South}
    ${'E'}    | ${'0'} | ${'0'} | ${0}    | ${0}    | ${Compass.East}
    ${'W'}    | ${'0'} | ${'0'} | ${0}    | ${0}    | ${Compass.West}
    ${'N'}    | ${'99'}| ${'99'}| ${99}   | ${99}   | ${Compass.North}
    ${'S'}    | ${'99'}| ${'0'} | ${99}   | ${0}    | ${Compass.South}
    `('parseInitialLocation("$direction", "$x", "$y") - { x: $expectX, y: $expectY, orientation: $expectOrientation, portals: {} }', (row: DataRow) => {
        const result = robotParser.parseInitialLocation(row.direction, row.x, row.y);
        expect(result).toEqual({ x: row.expectX, y: row.expectY, orientation: row.expectOrientation, portals: {} });
    });
});