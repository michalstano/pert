import { AoNData } from '../../src/app/sandbox/+state/sandbox.model';
import { dataTest } from '../support/utils';

const selectors = {
  createNodeButton: dataTest('create-node-btn'),
  connectNodesButton: dataTest('connect-nodes-btn'),
  selectedNode: '.selected',
  earliestStartInput: '.earliest-start input',
  duration: '.duration input',
  earliestFinishInput: '.earliest-finish input',
  nameInput: '.name input',
  latestStartInput: '.latest-start input',
  floatInput: '.float input',
  latestFinishInput: '.latest-finish input'
};

const generateAndFillNode = ({
  earliestStart,
  duration,
  earliestFinish,
  name,
  latestStart,
  float,
  latestFinish
}: AoNData): void => {
  cy.get(selectors.createNodeButton).click();

  cy.get(selectors.selectedNode)
    .first()
    .then(node => {
      cy.realPress('Enter');

      cy.wrap(node)
        .find(selectors.earliestStartInput)
        .should('be.focused')
        .type(earliestStart.toString());
      cy.realPress('Tab');

      cy.wrap(node)
        .find(selectors.duration)
        .should('be.focused')
        .type(duration.toString());
      cy.realPress('Tab');

      cy.wrap(node)
        .find(selectors.earliestFinishInput)
        .should('be.focused')
        .type(earliestFinish.toString());
      cy.realPress('Tab');

      cy.wrap(node)
        .find(selectors.nameInput)
        .should('be.focused')
        .type(name);
      cy.realPress('Tab');

      cy.wrap(node)
        .find(selectors.latestStartInput)
        .should('be.focused')
        .type(latestStart.toString());
      cy.realPress('Tab');

      cy.wrap(node)
        .find(selectors.floatInput)
        .should('be.focused')
        .type(float.toString());
      cy.realPress('Tab');

      cy.wrap(node)
        .find(selectors.latestFinishInput)
        .should('be.focused')
        .type(latestFinish.toString());

      cy.realPress('Escape');
      cy.realPress('Escape');
    });
};

const linkTwoNodes = (firstName: string, secondName: string) => {
  cy.get(selectors.connectNodesButton).click();

  cy.contains(firstName)
    .first()
    .parents('.aon-node')
    .click({ force: true });
  cy.contains(secondName)
    .first()
    .parents('.aon-node')
    .click({ force: true });

  cy.realPress('Escape');
};

export const GraphCreationUtils = {
  generateAndFillNode,
  linkTwoNodes
};
