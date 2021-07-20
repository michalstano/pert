import { Dictionary } from '@ngrx/entity';
import { Edge, Node } from '@swimlane/ngx-graph';
import { difference } from 'lodash';
import { AoNData } from './sandbox.model';

const getConnectedNodes = (
  nodesEntities: Dictionary<Node>,
  links: Edge[]
): Node[] => {
  const connectedNodeIdsSet = new Set<Node>();

  links.forEach(({ source, target }) => {
    connectedNodeIdsSet.add(nodesEntities[source]);
    connectedNodeIdsSet.add(nodesEntities[target]);
  });

  const connectedNodeIds: Node[] = Array.from(connectedNodeIdsSet);

  return connectedNodeIds;
};

const getAreAllNodesConnected = (
  nodes: Node[],
  connectedNodes: Node[]
): boolean => {
  const connectedNodeIds: string[] = connectedNodes.map(({ id }) => id);
  const nodesIds: string[] = nodes.map(({ id }) => id);

  const areAllNodesConnected = !difference(nodesIds, connectedNodeIds).length;

  return areAllNodesConnected;
};

const getAreAllConnectedNodesValid = (connectedNodes: Node[]) => {
  return connectedNodes.every(node => node.data.isValid);
};

/* getAreConnectedNodesCorrect */

const getAreSourceNodesCorrect = (
  links: Edge[],
  nodeEntities: Dictionary<Node>,
  currentNode: Node
): boolean => {
  const currentNodeData: AoNData = currentNode.data;
  const sourceNodes: Node[] = links
    .filter(link => link.target === currentNode.id)
    .map(link => nodeEntities[link.source]);

  const areSourceNodesCorrect = sourceNodes.every(node => {
    const nodeData: AoNData = node.data;

    const rules: boolean[] = [
      nodeData.earliestFinish <= currentNodeData.earliestStart,
      nodeData.latestFinish <= currentNodeData.latestStart
    ];

    return rules.every(rule => !!rule);
  });
  const isSomeSourceNodeCorrect = sourceNodes.some(node => {
    const nodeData: AoNData = node.data;

    const rules: boolean[] = [
      nodeData.latestStart === currentNodeData.earliestStart
    ];

    return rules.every(rule => !!rule);
  });

  return areSourceNodesCorrect && isSomeSourceNodeCorrect;
};

const getAreConnectedNodesCorrect = (
  connectedNodes: Node[],
  nodesEntities: Dictionary<Node>,
  links: Edge[]
): boolean => {
  connectedNodes.forEach(currentNode => {
    const areSourceNodesCorrect = getAreSourceNodesCorrect(
      links,
      nodesEntities,
      currentNode
    );
  });

  return true;
};

/* getIsGraphCorrect */

export const getIsGraphCorrect = (
  areNodesAndLinks: boolean,
  nodes: Node[],
  nodesEntities: Dictionary<Node>,
  links: Edge[]
): boolean | undefined => {
  const connectedNodes = getConnectedNodes(nodesEntities, links);

  const areAllNodesConnected = getAreAllNodesConnected(nodes, connectedNodes);
  const areAllConnectedNodesValid = getAreAllConnectedNodesValid(
    connectedNodes
  );
  const areConnectedNodesCorrect = getAreConnectedNodesCorrect(
    connectedNodes,
    nodesEntities,
    links
  );
  const result = areAllNodesConnected && areAllConnectedNodesValid;

  return areNodesAndLinks ? result : undefined;
};
