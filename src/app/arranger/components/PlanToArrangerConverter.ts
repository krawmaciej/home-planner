import {SceneObjectsState} from "../../common/context/SceneObjectsDefaults";
import {PlacedWall} from "../../drawer/objects/wall/PlacedWall";
import {ConnectionType, WallFace} from "../../drawer/objects/wall/WallSide";
import {SceneWallFaceMeshes} from "../objects/SceneWallFaceMeshes";
import {WallFaceMesh} from "../objects/WallFaceMesh";
import {Path, Quaternion, Shape, ShapeGeometry, Vector2, Vector3} from "three";
import {PathPropsBuilder} from "./PathPropsBuilder";
import {FloatingPointsPathsFixer} from "./FloatingPointsPathsFixer";
import {DEFAULT_WALL_MATERIAL, ObjectPoints, ObjectSideOrientation} from "../../drawer/constants/Types";
import {ArrangerMath} from "./ArrangerMath";
import {WallCoversCreator} from "./WallCoversCreator";
import {ComponentFrameCreator} from "./ComponentFrameCreator";
import {Floor} from "../../drawer/objects/floor/Floor";
import {FloorCreator} from "./FloorCreator";
import {CeilingCreator} from "./CeilingCreator";
import {IPlacedWallComponent} from "../../drawer/objects/window/IPlacedWallComponent";

/**
 * Expects walls and wall component points to be in the same order.
 * E.g.
 * Wall: [{0, 0}, {5, 0}], then
 * Component: [{1, 0}, {2, 0}], or
 * Wall: [{5, 0}, {0, 0}], then
 * Component: [{2, 0}, {1, 0}].
 */
export class PlanToArrangerConverter {

    public convertPlanObjects(sceneObjects: SceneObjectsState) {
        const sceneWallFacesMeshes = this.convertPlacedWalls(sceneObjects.placedWalls);
        const sceneWallComponents = this.convertWallComponents(sceneObjects.wallComponents);
        const sceneFloorsMeshes = this.convertFloors(sceneObjects.floors);
        const sceneCeilingsMeshes = this.createCeilings(sceneObjects.floors, sceneObjects.wallsHeight);
        return { ...sceneWallFacesMeshes, sceneComponents: sceneWallComponents, sceneFloorsMeshes, sceneCeilingsMeshes };
    }

    private convertPlacedWalls(placedWalls: Array<PlacedWall>) {
        const sceneWallFaceMeshes = new SceneWallFaceMeshes();

        const wallFaceMeshes = placedWalls.flatMap(wall =>
            wall.wallSides.getWallSides()
                .flatMap((ws, idx) =>
                    ws.wallFaceArray()
                        .filter(wf => wf.connection.type === ConnectionType.SOLID)
                        .map(wf => PlanToArrangerConverter.wallFaceToWallFaceMesh(wf, idx, wall.props.height))
                )
        ); // todo: use map instead of flat map and create wall aggregating all wallfaces,
           // todo: draw diagram for also updating Connection material when wallface material is updated.

        const wallCoversCreator = new WallCoversCreator(DEFAULT_WALL_MATERIAL);
        const wallCoverMeshes = placedWalls.map(wall => wallCoversCreator.fromObjectPoints(wall.props));

        sceneWallFaceMeshes.put(wallFaceMeshes);
        return { sceneWallFaceMeshes, wallCoverMeshes };
    }

    private convertWallComponents(wallComponents: Array<IPlacedWallComponent>) {
        // todo: save in wall component 4 materials, one per frame face
        // todo: allow each wall face material to be set separately
        const frameMaterial = DEFAULT_WALL_MATERIAL.clone();
        const creator = new ComponentFrameCreator(frameMaterial);
        const frames = wallComponents.map(wc => creator.createFromWallComponent(wc));
        const models = wallComponents.flatMap(component => {
            const model = component.getModel();
            if (model) {
                const newModel = model.clone();
                const frameCenter = component.getElevation() + (component.getHeight() / 2.0);
                newModel.position.copy(component.getPosition().setY(frameCenter));
                return newModel;
            } else {
                return [];
            }
        });
        return { frames, models };
    }

    private convertFloors(floors: Array<Floor>) {
        const creator = new FloorCreator();
        return floors.map(floor => creator.createFromFloor(floor));
    }

    private createCeilings(floors: Array<Floor>, wallsHeight: number) {
        const creator = new CeilingCreator(wallsHeight);
        return floors.map(floor => creator.createFromFloor(floor));
    }

    private static wallFaceToWallFaceMesh(wallFace: WallFace, orientation: ObjectSideOrientation, wallHeight: number): WallFaceMesh {
        const shape = PlanToArrangerConverter.wallFaceToShape(wallFace, orientation, wallHeight);
        const shapeGeometry = new ShapeGeometry(shape);
        // PlanObjectsConverter.swapRenderedSide(shapeGeometry, wallFace); // todo: fix
        shapeGeometry.rotateX(Math.PI/2.0);
        shapeGeometry.translate(-wallFace.firstPoint.x, 0, -wallFace.firstPoint.z); // make corner around which to rotate a center of geometry

        const txtRotation = PlanToArrangerConverter.getTxtRotation(orientation);
        return new WallFaceMesh(shapeGeometry, wallFace, -Math.PI/2.0, txtRotation);
    }

    // todo: make wall height settable from main menu
    // todo: make window height and elevation settable from main manu
    // todo: make sure that window highest point (offset by height) is not outside wall's height
    private static wallFaceToShape(wallFace: WallFace, orientation: ObjectSideOrientation, wallHeight: number): Shape {
        const first = new Vector2(wallFace.firstPoint.x, wallFace.firstPoint.z);
        const second = new Vector2(wallFace.secondPoint.x, wallFace.secondPoint.z);

        const wallFacePoints = new PathPropsBuilder(first, second)
            .withHeight(wallHeight)
            .build();

        const pathsFixer = new FloatingPointsPathsFixer(wallFacePoints);

        // get all wall face holes
        const holes = wallFace.connection.componentsAttributes.map(cmp => {
            const first = new Vector2(cmp.firstPoint.x, cmp.firstPoint.z);
            const second = new Vector2(cmp.secondPoint.x, cmp.secondPoint.z);
            const componentPoints = new PathPropsBuilder(first, second)
                .withHeight(cmp.height)
                .withElevation(cmp.elevation)
                .build();
            pathsFixer.fix(componentPoints);
            return new Path().setFromPoints(componentPoints);
        });

        const shape = new Shape().setFromPoints(wallFacePoints);
        shape.holes.push(...holes);
        return shape;
    }

    private static swapRenderedSide(shapeGeometry: ShapeGeometry, { firstPoint, secondPoint }: WallFace) {
        const rotationPoint = firstPoint.clone().add(secondPoint).multiplyScalar(0.5); // middle
        shapeGeometry.translate(rotationPoint.x, rotationPoint.y, rotationPoint.z);



        const perpendicularToBase = ArrangerMath.perpendicularToVectorFrom(
            new Vector2(secondPoint.x, secondPoint.z),
            new Vector2(firstPoint.x, firstPoint.z),
        ).normalize();
        const quaternion = new Quaternion().setFromAxisAngle(
            new Vector3(perpendicularToBase.x, 0, perpendicularToBase.y),
            Math.PI
        );
        shapeGeometry.applyQuaternion(quaternion);
        shapeGeometry.translate(rotationPoint.x, 0, rotationPoint.z);
    }

    private static getTxtRotation(orientation: ObjectSideOrientation) {
        if (orientation === ObjectSideOrientation.BOTTOM || orientation === ObjectSideOrientation.TOP) {
            return 0.0;
        } else {
            return Math.PI * 1.5;
        }
    }

    private static wallPointsToCoverMeshes(points: ObjectPoints) {

    }
}
