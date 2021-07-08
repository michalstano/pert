import { createAction, props } from '@ngrx/store';

const addAoNButtonClicked = createAction('[Toolbar] Add AoN Button Clicked');

const connectNodesButtonClicked = createAction(
  '[Toolbar] Connect Nodes Button Clicked'
);

const importButtonClicked = createAction('[Toolbar] Import Button Clicked');

const exportButtonClicked = createAction(
  '[Toolbar] Export Button Clicked',
  props<{ fileName: string }>()
);

export const ToolbarActions = {
  addAoNButtonClicked,
  connectNodesButtonClicked,
  importButtonClicked,
  exportButtonClicked
};
