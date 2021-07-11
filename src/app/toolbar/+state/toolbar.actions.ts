import { createAction, props } from '@ngrx/store';
import { PortData } from '../../sandbox/+state/sandbox.model';

const addAoNButtonClicked = createAction('[Toolbar] Add AoN Button Clicked');

const removeAoNButtonClicked = createAction(
  '[Toolbar] Remove AoN Button Clicked'
);

const connectNodesButtonClicked = createAction(
  '[Toolbar] Connect Nodes Button Clicked'
);

const importButtonClicked = createAction(
  '[Toolbar] Import Button Clicked',
  props<{ result: PortData }>()
);

const exportButtonClicked = createAction(
  '[Toolbar] Export Button Clicked',
  props<{ fileName: string }>()
);

export const ToolbarActions = {
  addAoNButtonClicked,
  removeAoNButtonClicked,
  connectNodesButtonClicked,
  importButtonClicked,
  exportButtonClicked
};
