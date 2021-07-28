/* eslint-disable @typescript-eslint/no-explicit-any */

import { Graph, Layout, Edge, Node, NodePosition } from '@swimlane/ngx-graph';
import * as dagre from 'dagre';

export enum Orientation {
  LEFT_TO_RIGHT = 'LR',
  RIGHT_TO_LEFT = 'RL',
  TOP_TO_BOTTOM = 'TB',
  BOTTOM_TO_TOM = 'BT'
}
export enum Alignment {
  CENTER = 'C',
  UP_LEFT = 'UL',
  UP_RIGHT = 'UR',
  DOWN_LEFT = 'DL',
  DOWN_RIGHT = 'DR'
}

export interface DagreSettings {
  orientation?: Orientation;
  marginX?: number;
  marginY?: number;
  edgePadding?: number;
  rankPadding?: number;
  nodePadding?: number;
  align?: Alignment;
  acyclicer?: 'greedy' | undefined;
  ranker?: 'network-simplex' | 'tight-tree' | 'longest-path';
  multigraph?: boolean;
  compound?: boolean;
}

export interface DagreNodesOnlySettings extends DagreSettings {
  curveDistance?: number;
}

interface EdgePoints {
  startingPoint: NodePosition;
  endingPoint: NodePosition;
}

const DEFAULT_EDGE_NAME = '\x00';
const EDGE_KEY_DELIM = '\x01';

export class GraphLayout implements Layout {
  defaultSettings: DagreNodesOnlySettings = {
    orientation: Orientation.LEFT_TO_RIGHT,
    marginX: 20,
    marginY: 20,
    edgePadding: 100,
    rankPadding: 100,
    nodePadding: 50,
    curveDistance: 20,
    multigraph: false,
    compound: true
  };
  settings: DagreNodesOnlySettings = {};

  dagreGraph: any;
  dagreNodes: any;
  dagreEdges: any;

  public run(graph: Graph): Graph {
    this.createDagreGraph(graph);
    dagre.layout(this.dagreGraph);
    graph.edgeLabels = this.dagreGraph._edgeLabels;

    for (const dagreNodeId in this.dagreGraph._nodes) {
      const dagreNode = this.dagreGraph._nodes[dagreNodeId];
      const node = graph.nodes.find(n => n.id === dagreNode.id);

      node.position = {
        x: dagreNode.data.position?.x || dagreNode.x,
        y: dagreNode.data.position?.y || dagreNode.y
      };
      node.dimension = {
        width: dagreNode.width,
        height: dagreNode.height
      };

      for (const edge of graph.edges) {
        this.updateEdge(graph, edge);
      }
    }

    return graph;
  }

  public updateEdge(graph: Graph, edge: Edge): Graph {
    const sourceNode = graph.nodes.find(n => n.id === edge.source);
    const targetNode = graph.nodes.find(n => n.id === edge.target);
    const { startingPoint, endingPoint } = this.getEdgePoints(
      sourceNode,
      targetNode
    );
    // generate new points
    edge.points = [startingPoint, endingPoint];
    const edgeLabelId = `${edge.source}${EDGE_KEY_DELIM}${edge.target}${EDGE_KEY_DELIM}${DEFAULT_EDGE_NAME}`;

    const matchingEdgeLabel = graph.edgeLabels[edgeLabelId];
    if (matchingEdgeLabel) {
      matchingEdgeLabel.points = edge.points;
    }
    return graph;
  }

  public createDagreGraph(graph: Graph): any {
    const settings = Object.assign({}, this.defaultSettings, this.settings);
    this.dagreGraph = new dagre.graphlib.Graph({
      compound: settings.compound,
      multigraph: settings.multigraph
    });
    this.dagreGraph.setGraph({
      rankdir: settings.orientation,
      marginx: settings.marginX,
      marginy: settings.marginY,
      edgesep: settings.edgePadding,
      ranksep: settings.rankPadding,
      nodesep: settings.nodePadding,
      align: settings.align,
      acyclicer: settings.acyclicer,
      ranker: settings.ranker,
      multigraph: settings.multigraph,
      compound: settings.compound
    });

    // Default to assigning a new object as a label for each new edge.
    this.dagreGraph.setDefaultEdgeLabel(() => {
      return {
        /* empty */
      };
    });

    this.dagreNodes = graph.nodes.map(n => {
      const node: any = Object.assign({}, n);
      node.width = n.dimension.width;
      node.height = n.dimension.height;
      node.x = n.position.x;
      node.y = n.position.y;
      return node;
    });

    this.dagreEdges = graph.edges.map(l => {
      let linkId = 1;
      const newLink: any = Object.assign({}, l);
      if (!newLink.id) {
        newLink.id = linkId;
        linkId++;
      }
      return newLink;
    });

    for (const node of this.dagreNodes) {
      if (!node.width) {
        node.width = 20;
      }
      if (!node.height) {
        node.height = 30;
      }

      // update dagre
      this.dagreGraph.setNode(node.id, node);
    }

    // update dagre
    for (const edge of this.dagreEdges) {
      if (settings.multigraph) {
        this.dagreGraph.setEdge(edge.source, edge.target, edge, edge.id);
      } else {
        this.dagreGraph.setEdge(edge.source, edge.target);
      }
    }

    return this.dagreGraph;
  }

  private getEdgePoints(sourceNode: Node, targetNode: Node): EdgePoints {
    const angle =
      (Math.atan2(
        targetNode.position.y - sourceNode.position.y,
        targetNode.position.x - sourceNode.position.x
      ) *
        180) /
      Math.PI;

    const halfWidth = sourceNode.dimension.width / 2;
    const halfHeight = sourceNode.dimension.height / 2;

    if (angle <= 22.5 && angle >= -22.5) {
      return {
        startingPoint: {
          x: sourceNode.position.x + halfWidth,
          y: sourceNode.position.y
        },
        endingPoint: {
          x: targetNode.position.x - halfWidth,
          y: targetNode.position.y
        }
      };
    }
    if (angle <= 67.5 && angle >= 22.5) {
      return {
        startingPoint: {
          x: sourceNode.position.x + halfWidth,
          y: sourceNode.position.y + halfHeight
        },
        endingPoint: {
          x: targetNode.position.x - halfWidth,
          y: targetNode.position.y - halfHeight
        }
      };
    }
    if (angle <= 112.5 && angle >= 67.5) {
      return {
        startingPoint: {
          x: sourceNode.position.x,
          y: sourceNode.position.y + halfHeight
        },
        endingPoint: {
          x: targetNode.position.x,
          y: targetNode.position.y - halfHeight
        }
      };
    }
    if (angle <= 157.5 && angle >= 112.5) {
      return {
        startingPoint: {
          x: sourceNode.position.x - halfWidth,
          y: sourceNode.position.y + halfHeight
        },
        endingPoint: {
          x: targetNode.position.x + halfWidth,
          y: targetNode.position.y - halfHeight
        }
      };
    }
    if (angle <= -157.5 || angle >= 157.5) {
      return {
        startingPoint: {
          x: sourceNode.position.x - halfWidth,
          y: sourceNode.position.y
        },
        endingPoint: {
          x: targetNode.position.x + halfWidth,
          y: targetNode.position.y
        }
      };
    }
    if (angle <= -112.5 && angle >= -157.5) {
      return {
        startingPoint: {
          x: sourceNode.position.x - halfWidth,
          y: sourceNode.position.y - halfHeight
        },
        endingPoint: {
          x: targetNode.position.x + halfWidth,
          y: targetNode.position.y + halfHeight
        }
      };
    }
    if (angle <= -67.5 && angle >= -122.5) {
      return {
        startingPoint: {
          x: sourceNode.position.x,
          y: sourceNode.position.y - halfHeight
        },
        endingPoint: {
          x: targetNode.position.x,
          y: targetNode.position.y + halfHeight
        }
      };
    }
    if (angle <= -22.5 && angle >= -67.5) {
      return {
        startingPoint: {
          x: sourceNode.position.x + halfWidth,
          y: sourceNode.position.y - halfHeight
        },
        endingPoint: {
          x: targetNode.position.x - halfWidth,
          y: targetNode.position.y + halfHeight
        }
      };
    }
  }
}
