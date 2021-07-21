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
    const sourceNode = nodesEntities[source];
    const targetNode = nodesEntities[target];

    if (sourceNode && targetNode) {
      connectedNodeIdsSet.add(sourceNode);
      connectedNodeIdsSet.add(targetNode);
    }
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

const getIsOnlyOneLastNode = (connectedNodes: Node[], links: Edge[]) => {
  const lastNodes = connectedNodes.filter(node =>
    links.every(({ source }) => source !== node.id)
  );

  if (lastNodes.length === 1) {
    return +lastNodes[0].data.aonData.float === 0;
  }

  return false;
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
  const isOnlyOneLastNode = getIsOnlyOneLastNode(connectedNodes, links);
  const areConnectedNodesCorrect = getAreConnectedNodesCorrect(
    connectedNodes,
    nodesEntities,
    links
  );

  const rules: boolean[] = [
    areAllNodesConnected,
    areAllConnectedNodesValid,
    isOnlyOneLastNode,
    areConnectedNodesCorrect
  ];

  const result = rules.every(r => !!r);

  return areNodesAndLinks ? result : undefined;
};
