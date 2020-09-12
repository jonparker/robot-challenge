import { AutoRunner } from 'typespec-bdd';

import './RobotSteps';

AutoRunner.run(
    '/specs/Robot.feature'
);