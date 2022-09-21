import {BufferGeometry, Line, Material, MeshStandardMaterial, Vector3} from "three";
import {
    DEFAULT_WALL_MATERIAL,
    ObjectPoint,
    ObjectSideOrientation,
    TextureProps
} from "../../constants/Types";
import {CommonMathOperations} from "../../../common/components/CommonMathOperations";
import {IPlacedWallComponent} from "../component/IPlacedWallComponent";

type OrientationPoints = {
    first: ObjectPoint,
    second: ObjectPoint,
}

class ComponentSidePointsSingletonMap {
    private static readonly MAP = new Map<ObjectSideOrientation, OrientationPoints>([
        [ObjectSideOrientation.BOTTOM, { first: ObjectPoint.BOTTOM_LEFT, second: ObjectPoint.BOTTOM_RIGHT }],
        [ObjectSideOrientation.RIGHT, { first: ObjectPoint.TOP_RIGHT, second: ObjectPoint.BOTTOM_RIGHT }],
        [ObjectSideOrientation.TOP, { first: ObjectPoint.TOP_LEFT, second: ObjectPoint.TOP_RIGHT }],
        [ObjectSideOrientation.LEFT, { first: ObjectPoint.TOP_LEFT, second: ObjectPoint.BOTTOM_LEFT }],
    ]);

    public static get(side: ObjectSideOrientation): OrientationPoints {
        const orientationPoints = ComponentSidePointsSingletonMap.MAP.get(side);
        if (orientationPoints === undefined) {
            throw new Error(`Requested object side: ${JSON.stringify(side)} was not found
                             in ${JSON.stringify(ComponentSidePointsSingletonMap.MAP)}`);
        }
        return orientationPoints;
    }
}

export class WallSide {
    // used to quickly remove component from wallSide's node
    private readonly componentToSideNode = new Map<IPlacedWallComponent, SideNode>();

    public readonly side: ObjectSideOrientation;
    private readonly head: SideNode;
    private readonly tail: SideNode;
    private readonly strategyKey: "x" | "z"; // "strategy" used for finding where to put point
    
    public constructor(start: Vector3, end: Vector3, side: ObjectSideOrientation) {
        this.head = new SideNode(start);
        this.tail = new SideNode(end);
        this.head.connection = new Connection(this.tail, ConnectionType.SOLID); // connect head with tail
        this.side = side;
        const xStrategy = side === ObjectSideOrientation.TOP || side === ObjectSideOrientation.BOTTOM;
        this.strategyKey = xStrategy ? "x" : "z";
    }

    public createDrawableObjects(material: Material): Array<Line> {
        let iterator: SideNode = this.head;
        const lines = new Array<Line>();
        while (iterator.connection.next !== undefined) {
            if (iterator.connection.type === ConnectionType.SOLID) {
                const first = iterator.point;
                const second = iterator.connection.next.point;
                const bufferGeometry = new BufferGeometry().setFromPoints([first, second]);
                lines.push(new Line(bufferGeometry, material));
            }
            iterator = iterator.connection.next;
        }
        return lines;
    }

    /**
     * @param firstPoint has to be smaller than {@link this.tail.point}
     * @param secondPoint has to be smaller or equal to {@link this.tail.point}
     */
    public cutBlock(firstPoint: Vector3, secondPoint: Vector3) {
        const firstNode = new SideNode(firstPoint);
        const secondNode = new SideNode(secondPoint);

        const strategyKey = this.strategyKey; // "alias"

        let beforeIterator: SideNode = this.head;
        let iterator: SideNode | undefined = this.head.connection.next;

        while (iterator !== undefined) {
            if (secondPoint[strategyKey] < iterator.point[strategyKey]) { // found higher
                // cut between iterator and beforeIterator
                if (CommonMathOperations.areNumbersEqual(firstPoint[strategyKey], beforeIterator.point[strategyKey])) {
                    beforeIterator.connection = new Connection(secondNode, ConnectionType.HOLE);
                    secondNode.connection = new Connection(iterator, ConnectionType.SOLID);
                } else {
                    beforeIterator.connection.next = firstNode;
                    firstNode.connection = new Connection(secondNode, ConnectionType.HOLE);
                    secondNode.connection = new Connection(iterator, ConnectionType.SOLID);
                }
                break;
            } else if (CommonMathOperations.areNumbersEqual(secondPoint[strategyKey], iterator.point[strategyKey])) { // second point is same as existing
                if (CommonMathOperations.areNumbersEqual(firstPoint[strategyKey], beforeIterator.point[strategyKey])) { // swap current solid line for hole
                    beforeIterator.connection.type = ConnectionType.HOLE;
                } else {
                    beforeIterator.connection.next = firstNode;
                    firstNode.connection = new Connection(iterator, ConnectionType.HOLE);
                }
                break;
            }
            beforeIterator = iterator;
            iterator = iterator.connection.next;
        }
    }

    /**
     * @param firstPoint has to be smaller than {@link this.tail.point}
     * @param secondPoint has to be smaller or equal to {@link this.tail.point}
     */
    public fillBlock(firstPoint: Vector3, secondPoint: Vector3) {
        const strategyKey = this.strategyKey; // "alias"

        let first: SideNode | undefined;
        let second: SideNode = this.head;
        let third: SideNode | undefined = second.connection.next;

        while (third !== undefined) {
            if (CommonMathOperations.areNumbersEqual(secondPoint[strategyKey], third.point[strategyKey])) {
                const firstType = first?.connection.type;
                const thirdType = third.connection.type;

                // handle four different cases
                if (firstType !== ConnectionType.SOLID && thirdType !== ConnectionType.SOLID) { // I
                    WallSide.fillSecond(second);
                } else if (firstType === ConnectionType.SOLID && thirdType === ConnectionType.SOLID) { // II
                    WallSide.connectFirstWithFourth(first, third.connection.next);
                } else if (firstType === ConnectionType.SOLID && thirdType !== ConnectionType.SOLID) { // III
                    WallSide.connectFirstWithThird(first, third);
                } else if (firstType !== ConnectionType.SOLID && thirdType === ConnectionType.SOLID) { // IV
                    WallSide.connectSecondWithFourth(second, third.connection.next, third.connection);
                }

                break;
            }

            first = second;
            second = third;
            third = third.connection.next;
        }
    }

    private static fillSecond(second: SideNode) {
        // reset color to default
        second.connection.type = ConnectionType.SOLID;
        second.connection.textureProps = Connection.defaultConnectionTextureProps();
        second.connection.material = Connection.defaultConnectionMaterial();
    }

    private static connectFirstWithFourth(first: SideNode | undefined, fourth: SideNode | undefined) {
        if (first === undefined || fourth === undefined) {
            throw new Error("II filling type, first or fourth nodes are undefined."); // should not happen
        }
        // keep color from first
        first.connection.next = fourth;
        first.connection.type = ConnectionType.SOLID;
    }

    private static connectFirstWithThird(first: SideNode | undefined, third: SideNode) {
        if (first === undefined) {
            throw new Error("III filling type, first node is undefined."); // should not happen
        }
        // keep color from first
        first.connection.next = third;
        first.connection.type = ConnectionType.SOLID;
    }

    private static connectSecondWithFourth(second: SideNode, fourth: SideNode | undefined, props: Connection) {
        if (fourth === undefined) {
            throw new Error("IV filling type, fourth node is undefined."); // should not happen
        }
        // copy appearance props from third to second
        second.connection.next = fourth;
        second.connection.textureProps = props.textureProps;
        second.connection.material = props.material;
        second.connection.type = ConnectionType.SOLID;
    }

    /**
     *
     * @param component to be added to wall side
     */
    public putComponent(component: IPlacedWallComponent) {
        const strategyKey = this.strategyKey; // "alias"

        const componentPoints = component.getObjectPointsOnScene();
        const indices = ComponentSidePointsSingletonMap.get(this.side);
        const componentAttributes: ComponentAttributes = {
            firstPoint: componentPoints[indices.first],
            secondPoint: componentPoints[indices.second],
            height: component.getHeight(),
            elevation: component.getElevation(),
        };

        // check first pair
        let beforeIterator: SideNode = this.head;
        let iterator: SideNode | undefined = this.head.connection.next;

        while (iterator !== undefined) {
            const componentPoint = componentAttributes.secondPoint[strategyKey];
            const sideNodePoint = iterator.point[strategyKey];
            if (componentPoint < sideNodePoint ||
                CommonMathOperations.areNumbersEqual(componentPoint, sideNodePoint)
            ) {
                // put in connection between iterator and beforeIterator
                beforeIterator.connection.addComponent(component, componentAttributes);
                this.componentToSideNode.set(component, beforeIterator);
                return;
            }
            beforeIterator = iterator;
            iterator = iterator.connection.next; // go to next node
        }

        // should not happen
        throw new Error(`component: ${JSON.stringify(component)} is outside of wallside: ${JSON.stringify(this)}`);
    }

    public removeComponent(component: IPlacedWallComponent) {
        const sideNode = this.componentToSideNode.get(component);
        if (sideNode === undefined) {
            throw new Error(`component: ${JSON.stringify(component)} does not belong to wallSide: ${JSON.stringify(this)}`);
        }
        sideNode.connection.removeComponent(component);
    }

    public wallFaceArray(): Array<WallFace> {
        const result = new Array<WallFace>();

        let iterator: SideNode = this.head;
        while (iterator.connection.next !== undefined) {
            result.push({
                firstPoint: iterator.point,
                secondPoint: iterator.connection.next.point,
                connection: iterator.connection,
            });
            iterator = iterator.connection.next;
        }

        return result;
    }
}

class SideNode {
    public readonly point: Vector3;
    public connection: Connection;
    public constructor(point: Vector3) {
        this.point = point;
        this.connection = new Connection(undefined, ConnectionType.TAIL);
    }
}

class Connection {
    public next: SideNode | undefined;
    public type: ConnectionType;
    public material: MeshStandardMaterial;
    public readonly components: Array<IPlacedWallComponent>; // holds wall's connection doors/windows
    public readonly componentsAttributes: Array<ComponentAttributes>; // data driven array connected by indices with components array
    public textureProps: TextureProps;
    public constructor(next: SideNode | undefined, type: ConnectionType, material?: MeshStandardMaterial) {
        this.next = next;
        this.type = type;
        this.material = material?.clone() ?? Connection.defaultConnectionMaterial();
        this.components = new Array<IPlacedWallComponent>();
        this.componentsAttributes = new Array<ComponentAttributes>();
        this.textureProps = Connection.defaultConnectionTextureProps(); // to pass as a reference and not as a value
    }
    public addComponent(component: IPlacedWallComponent, attributes: ComponentAttributes): Array<IPlacedWallComponent> {
        this.components.push(component);
        this.componentsAttributes.push(attributes);
        return this.components;
    }
    public removeComponent(component: IPlacedWallComponent) {
        const index = this.components.indexOf(component);
        if (index === -1) {
            throw new Error(`component: ${JSON.stringify(component)} was not found in the connection: ${JSON.stringify(this)}`);
        }
        this.components.splice(index, 1);
        this.componentsAttributes.splice(index, 1);
    }
    public static defaultConnectionTextureProps() {
        return {
            rotation: 0,
        };
    }
    public static defaultConnectionMaterial() {
        return DEFAULT_WALL_MATERIAL.clone();
    }
}

export type ComponentAttributes = {
    firstPoint: Vector3,
    secondPoint: Vector3,
    height: number,
    elevation: number,
}

export enum ConnectionType {
    SOLID, HOLE, TAIL
}

export type WallFace = {
    firstPoint: Vector3,
    secondPoint: Vector3,
    connection: Connection,
}
