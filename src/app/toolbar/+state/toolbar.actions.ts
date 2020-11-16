import { createAction } from '@ngrx/store';

const addAoNButtonClicked = createAction('[Toolbar] Add AoN Button Clicked');

const connectNodesButtonClicked = createAction(
  '[Toolbar] Connect Nodes Button Clicked'
);

export const ToolbarActions = {
  addAoNButtonClicked,
  connectNodesButtonClicked
};
