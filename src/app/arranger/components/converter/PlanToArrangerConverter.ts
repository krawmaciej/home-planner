import {SceneObjectsState} from "../../../common/context/SceneObjectsDefaults";
import {PlacedWall} from "../../../drawer/objects/wall/PlacedWall";
import {ConnectionType, WallFace} from "../../../drawer/objects/wall/WallSide";
import {createWallFaceMesh, WallFaceMesh} from "../../objects/WallFaceMesh";
import {Path, Shape, ShapeGeometry, Vector2} from "three";
import {PathPropsBuilder} from "./PathPropsBuilder";
import {FloatingPointsPathsFixer} from "./FloatingPointsPathsFixer";
import {ObjectSideOrientation} from "../../../drawer/constants/Types";
import {WallCoversCreator} from "./WallCoversCreator";
import {ComponentFrameCreator} from "./ComponentFrameCreator";
import {FloorCeiling} from "../../../drawer/objects/floor/FloorCeiling";
import {FloorCreator} from "./FloorCreator";
import {CeilingCreator} from "./CeilingCreator";
import {IPlacedWallComponent} from "../../../drawer/objects/component/IPlacedWallComponent";
import {ObjectWithEditableTexture} from "../../objects/ArrangerObject";
import {HOLE_OFFSET_FIX} from "../../../common/components/CommonMathOperations";

/**
 * Expects walls and wall component points to be in the same order.
 * E.g.
 * Wall: [{0, 0}, {5, 0}], then
 * Component: [{1, 0}, {2, 0}], or
 * Wall: [{5, 0}, {0, 0}], then
 * Component: [{2, 0}, {1, 0}].
 */
export class PlanToArrangerConverter {

    public convertPlanObjects(sceneObjects: SceneObjectsState, wallHeight: number) {
        const sceneConvertedWalls = this.convertPlacedWalls(sceneObjects.placedWalls, wallHeight);
        const sceneWallComponents = this.convertWallComponents(sceneObjects.wallComponents);
        const sceneFloors = this.convertFloors(sceneObjects.floors);
        const sceneCeilings = this.createCeilings(sceneObjects.floors, wallHeight);
        return { ...sceneConvertedWalls, sceneWallComponents, sceneFloors, sceneCeilings };
    }

    private convertPlacedWalls(placedWalls: Array<PlacedWall>, wallHeight: number) {
        const wallsWithEditableTexture = placedWalls.flatMap(wall =>
            wall.wallSides.getWallSides()
                .flatMap((ws, idx) =>
                    ws.wallFaceArray()
                        .filter(wf => wf.connection.type === ConnectionType.SOLID)
                        .map(wf => PlanToArrangerConverter.wallFaceToWallFaceMesh(wf, idx, wallHeight))
                        .map(wfm => PlanToArrangerConverter.wallFaceMeshToObjectWithEditableTexture(wfm))
                )
        );

        const wallCoversCreator = new WallCoversCreator();
        const wallCoverMeshes = placedWalls.map(wall => wallCoversCreator.fromObjectPoints(wall.props.points, wallHeight));

        return { wallsWithEditableTexture, wallCoverMeshes };
    }

    private convertWallComponents(wallComponents: Array<IPlacedWallComponent>) {
        const creator = new ComponentFrameCreator();
        const framesWithEditableTextures = wallComponents.map(wc => creator.createFromWallComponent(wc));
        const models = wallComponents.flatMap(component => {
            const model = component.getModel();
            if (model) {
                const newModel = model.clone();
                const frameCenter = component.getElevation() + (component.getHeight() / 2.0);
                newModel.position.copy(component.getPosition().setY(frameCenter));
                newModel.setRotationFromQuaternion(component.getRotation());
                return newModel;
            } else {
                return [];
            }
        });
        return { framesWithEditableTextures, models };
    }

    private convertFloors(floors: Array<FloorCeiling>) {
        const creator = new FloorCreator();
        return floors.map(floor => creator.createFromFloor(floor));
    }

    private createCeilings(floors: Array<FloorCeiling>, wallsHeight: number) {
        const creator = new CeilingCreator(wallsHeight);
        return floors.map(floor => creator.createFromFloor(floor));
    }

    private static wallFaceToWallFaceMesh(wallFace: WallFace, orientation: ObjectSideOrientation, wallHeight: number): WallFaceMesh {
        const shape = PlanToArrangerConverter.wallFaceToShape(wallFace, wallHeight);
        const shapeGeometry = new ShapeGeometry(shape);
        shapeGeometry.rotateX(Math.PI/2.0);
        shapeGeometry.translate(-wallFace.firstPoint.x, 0, -wallFace.firstPoint.z); // make corner around which to rotate a center of geometry

        const txtRotation = PlanToArrangerConverter.getTxtRotation(orientation);
        return createWallFaceMesh(shapeGeometry, wallFace, -Math.PI/2.0, txtRotation);
    }

    private static wallFaceMeshToObjectWithEditableTexture(wallFaceMesh: WallFaceMesh): ObjectWithEditableTexture {
        return {
            object3d: wallFaceMesh.object3d,
            initialTextureRotation: wallFaceMesh.initialTextureRotation,
            postProcessedTextureRotation: wallFaceMesh.wallFace.postProcessedTextureRotation,
        };
    }

    private static wallFaceToShape(wallFace: WallFace, wallHeight: number): Shape {
        const first = new Vector2(wallFace.firstPoint.x, wallFace.firstPoint.z);
        const second = new Vector2(wallFace.secondPoint.x, wallFace.secondPoint.z);

        const wallFacePoints = new PathPropsBuilder(first, second)
            .withHeight(wallHeight)
            .build();

        const pathsFixer = new FloatingPointsPathsFixer(wallFacePoints);

        // get all wall face holes
        const pathPropses = wallFace.connection.componentsAttributes.map(cmp => {
            const first = new Vector2(cmp.firstPoint.x + HOLE_OFFSET_FIX, cmp.firstPoint.z + HOLE_OFFSET_FIX);
            const second = new Vector2(cmp.secondPoint.x - HOLE_OFFSET_FIX, cmp.secondPoint.z - HOLE_OFFSET_FIX);
            const componentPoints = new PathPropsBuilder(first, second)
                .withHeight(cmp.height)
                .withElevation(cmp.elevation)
                .build();
            pathsFixer.fix(componentPoints);
            return componentPoints;
        });

        const holes = pathPropses.map(componentPoints => new Path().setFromPoints(componentPoints));

        const shape = new Shape().setFromPoints(wallFacePoints);
        shape.holes.push(...holes);
        return shape;
    }
    
    private static getTxtRotation(orientation: ObjectSideOrientation) {
        if (orientation === ObjectSideOrientation.BOTTOM || orientation === ObjectSideOrientation.TOP) {
            return 0.0;
        } else {
            return Math.PI * 1.5;
        }
    }
}
