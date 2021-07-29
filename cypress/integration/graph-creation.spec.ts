import { dataTest } from '../support/utils';
import { GraphCreationUtils } from './graph-creation.utils';

const selectors = {
  correctIcon: dataTest('correct-icon')
};

describe('Graph creation', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should create correct graph', () => {
    GraphCreationUtils.generateAndFillNode({
      earliestStart: 0,
      duration: 30,
      earliestFinish: 30,
      name: 'A',
      latestStart: 0,
      float: 0,
      latestFinish: 30
    });
    GraphCreationUtils.generateAndFillNode({
      earliestStart: 30,
      duration: 30,
      earliestFinish: 60,
      name: 'B',
      latestStart: 30,
      float: 0,
      latestFinish: 60
    });
    GraphCreationUtils.linkTwoNodes('A', 'B');

    GraphCreationUtils.generateAndFillNode({
      earliestStart: 60,
      duration: 90,
      earliestFinish: 150,
      name: 'C',
      latestStart: 60,
      float: 0,
      latestFinish: 150
    });
    GraphCreationUtils.linkTwoNodes('B', 'C');

    GraphCreationUtils.generateAndFillNode({
      earliestStart: 150,
      duration: 15,
      earliestFinish: 165,
      name: 'F',
      latestStart: 225,
      float: 75,
      latestFinish: 240
    });
    GraphCreationUtils.linkTwoNodes('C', 'F');

    GraphCreationUtils.generateAndFillNode({
      earliestStart: 150,
      duration: 60,
      earliestFinish: 210,
      name: 'D',
      latestStart: 150,
      float: 0,
      latestFinish: 210
    });
    GraphCreationUtils.linkTwoNodes('C', 'D');

    GraphCreationUtils.generateAndFillNode({
      earliestStart: 150,
      duration: 30,
      earliestFinish: 180,
      name: 'E',
      latestStart: 360,
      float: 210,
      latestFinish: 390
    });
    GraphCreationUtils.linkTwoNodes('C', 'E');

    GraphCreationUtils.generateAndFillNode({
      earliestStart: 210,
      duration: 30,
      earliestFinish: 240,
      name: 'G',
      latestStart: 210,
      float: 0,
      latestFinish: 240
    });
    GraphCreationUtils.linkTwoNodes('D', 'G');

    GraphCreationUtils.generateAndFillNode({
      earliestStart: 240,
      duration: 45,
      earliestFinish: 285,
      name: 'H',
      latestStart: 240,
      float: 0,
      latestFinish: 285
    });
    GraphCreationUtils.linkTwoNodes('F', 'H');
    GraphCreationUtils.linkTwoNodes('G', 'H');

    GraphCreationUtils.generateAndFillNode({
      earliestStart: 240,
      duration: 30,
      earliestFinish: 270,
      name: 'I',
      latestStart: 345,
      float: 105,
      latestFinish: 375
    });
    GraphCreationUtils.linkTwoNodes('G', 'I');

    GraphCreationUtils.generateAndFillNode({
      earliestStart: 285,
      duration: 60,
      earliestFinish: 345,
      name: 'J',
      latestStart: 285,
      float: 0,
      latestFinish: 345
    });
    GraphCreationUtils.linkTwoNodes('H', 'J');

    GraphCreationUtils.generateAndFillNode({
      earliestStart: 345,
      duration: 30,
      earliestFinish: 375,
      name: 'K',
      latestStart: 345,
      float: 0,
      latestFinish: 375
    });
    GraphCreationUtils.linkTwoNodes('J', 'K');

    GraphCreationUtils.generateAndFillNode({
      earliestStart: 375,
      duration: 15,
      earliestFinish: 390,
      name: 'L',
      latestStart: 375,
      float: 0,
      latestFinish: 390
    });
    GraphCreationUtils.linkTwoNodes('K', 'L');
    GraphCreationUtils.linkTwoNodes('I', 'L');

    GraphCreationUtils.generateAndFillNode({
      earliestStart: 390,
      duration: 5,
      earliestFinish: 395,
      name: 'M',
      latestStart: 390,
      float: 0,
      latestFinish: 395
    });
    GraphCreationUtils.linkTwoNodes('L', 'M');
    GraphCreationUtils.linkTwoNodes('E', 'M');

    cy.get(selectors.correctIcon);
  });
});
