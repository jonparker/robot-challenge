import { RobotControl as r } from './Robot';

describe('RobotControl.parser.parseDirection', () => {
    test.each([
        ['N', r.Compass.North],
        ['S', r.Compass.South],
        ['E', r.Compass.East],
        ['W', r.Compass.West]
    ])('parseDirection("%s") - %s', (input, expected) => {
        const result = r.parser.parseDirection(input);
        expect(result).toBe(expected);
    });
});

describe('RobotControl.parser.parseInitialLocation', () => {
    test.each`
    direction | x | y | expectX | expectY | expectOrientation
    ${'N'} | ${'0'} | ${'0'} | ${0} | ${0} | ${r.Compass.North}
    `('parseInitialLocation("$direction", "$x", "$y") - { x: $expectX, y: $expectY, orientation: $expectOrientation, portals: {} }', (row : any) => {
        const result = r.parser.parseInitialLocation(row.direction, row.x, row.y);
        expect(result).toEqual({ x: row.expectX, y: row.expectY, orientation: row.expectOrientation, portals: {} });
    });
});