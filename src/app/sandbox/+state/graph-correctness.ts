import { Dictionary } from '@ngrx/entity';
import { Edge, Node } from '@swimlane/ngx-graph';
import { AoNData } from './sandbox.model';

export const getAreSourceNodesCorrect = (
  links: Edge[],
  nodeEntities: Dictionary<Node>,
  currentNode: Node
): boolean => {
  const currentNodeData: AoNData = currentNode.data.aonData;
  const sourceNodes: Node[] = links
    .filter(link => link.target === currentNode.id)
    .map(link => nodeEntities[link.source]);

  const areSourceNodesCorrect = sourceNodes.every(node => {
    const nodeData: AoNData = node.data.aonData;

    const rules: boolean[] = [
      nodeData.earliestFinish <= currentNodeData.earliestStart,
      nodeData.latestFinish <= currentNodeData.latestStart
    ];

    return rules.every(rule => !!rule);
  });
  const isSomeSourceNodeCorrect = sourceNodes.length
    ? sourceNodes.some(node => {
        const nodeData: AoNData = node.data.aonData;

        const rules: boolean[] = [
          nodeData.earliestFinish === currentNodeData.earliestStart
        ];

        return rules.every(rule => !!rule);
      })
    : true;

  return areSourceNodesCorrect && isSomeSourceNodeCorrect;
};
