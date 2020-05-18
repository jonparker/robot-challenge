import { AutoRunner } from '../node_modules/typespec-bdd';

import './RobotSteps';

AutoRunner.run(
    '/specs/Robot.feature'
);