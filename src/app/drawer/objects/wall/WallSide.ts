import { BufferGeometry, Line, Material, Vector3 } from "three";
import { IWallComponent } from "../window/IWallComponent";
import { WallSideType } from "./WallSides";


export class WallSide {

    private readonly head: SideNode;
    private readonly tail: SideNode;
    private readonly side: WallSideType;
    private readonly strategyKey: "x" | "z"; // 'strategy' used for finding where to put point
    
    public constructor(start: Vector3, end: Vector3, side: WallSideType) {
        this.head = new SideNode(start);
        this.tail = new SideNode(end);
        this.head.connection = new Connection(this.tail, ConnectionType.SOLID); // connect
        this.side = side;
        const xStrategy = side === WallSideType.BOTTOM || side === WallSideType.TOP;
        this.strategyKey = xStrategy ? "x" : "z";
    }

    public createDrawableObjects(material: Material): Array<Line> {
        let iterator: SideNode = this.head;
        const lines = new Array<Line>();
        while (iterator.connection.next !== undefined) {
            if (iterator.connection.type === ConnectionType.SOLID) {
                const p0 = iterator.point;
                const p1 = iterator.connection.next.point;
                const bg = new BufferGeometry().setFromPoints([p0, p1]);
                lines.push(new Line(bg, material));
            }
            iterator = iterator.connection.next;
        }
        return lines;
    }

    /**
     * 
     * @param p0 has to be smaller than {@link this.tail.point}
     * @param p1 has to be smaller or equal to {@link this.tail.point}
     */
    public cutBlock(p0: Vector3, p1: Vector3) {
        const first = new SideNode(p0);
        const second = new SideNode(p1);

        const strategyKey = this.strategyKey; // 'alias'

        // check first pair
        let beforeIterator: SideNode = this.head;
        let iterator: SideNode | undefined = this.head.connection.next;

        while (iterator !== undefined) {
            if (p1[strategyKey] < iterator.point[strategyKey]) { // found higher
                // cut between iterator and beforeIterator
                if (p0[strategyKey] === beforeIterator.point[strategyKey]) {
                    beforeIterator.connection = new Connection(second, ConnectionType.HOLE);
                    second.connection = new Connection(iterator, ConnectionType.SOLID);
                } else {
                    beforeIterator.connection.next = first;
                    first.connection = new Connection(second, ConnectionType.HOLE);
                    second.connection = new Connection(iterator, ConnectionType.SOLID);
                }
                break;
            } else if (p1[strategyKey] === iterator.point[strategyKey]) { // second point is same as existing
                if (p0[strategyKey] === beforeIterator.point[strategyKey]) { // swap current solid line for hole
                    beforeIterator.connection.type = ConnectionType.HOLE;
                } else {
                    beforeIterator.connection.next = first;
                    first.connection = new Connection(iterator, ConnectionType.HOLE);
                }
                break;
            }
            beforeIterator = iterator;
            iterator = iterator.connection.next; // go to next node
        }
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
    public readonly components: Array<IWallComponent>; // holds wall's connection doors/windows
    public constructor(next: SideNode | undefined, type: ConnectionType) {
        this.next = next;
        this.type = type;
        this.components = new Array<IWallComponent>();
    }
    public add(component: IWallComponent): Array<IWallComponent> {
        this.components.push(component);
        return this.components;
    }
}

enum ConnectionType {
    SOLID, HOLE, TAIL
}
