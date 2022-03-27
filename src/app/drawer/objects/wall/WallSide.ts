import { Vector3 } from "three";
import WallComponent from "./WallComponent";


export default class WallSide {

    private readonly head: SideNode;
    private readonly tail: SideNode;
    
    public constructor(start: Vector3, end: Vector3) {
        this.head = new SideNode(start);
        this.tail = new SideNode(end);
        this.head.connection = new Connection(this.tail, ConnectionType.SOLID); // connect
    }

    public cutBlock(p0: Vector3, p1: Vector3) {
        const first = new SideNode(p0);
        const last = new SideNode(p1);
        // handle logic when p0 === start etc.
    }
}

class SideNode {
    public readonly point: Vector3;
    public connection: Connection | undefined;
    public constructor(point: Vector3) {
        this.point = point;
        this.connection = undefined;
    }
}

class Connection {
    public next: SideNode | undefined;
    public type: ConnectionType;
    public readonly components: Array<WallComponent>; // holds wall's connection doors/windows
    public constructor(next: SideNode | undefined, type: ConnectionType) {
        this.next = next;
        this.type = type;
        this.components = new Array<WallComponent>();
    }
    public add(component: WallComponent): Array<WallComponent> {
        this.components.push(component);
        return this.components;
    }
}

enum ConnectionType {
    SOLID, HOLE, TAIL
}
