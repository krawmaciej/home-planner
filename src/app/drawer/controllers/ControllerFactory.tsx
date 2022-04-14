type Props<T extends number> = {
    type: T,
    providers: Array<() => JSX.Element>,
}

export type ComponentProvider = () => JSX.Element;

export type MainFactoryComponentProps<T extends number> = {
    className?: string,
    setType: (type: T) => void,
}

export type FactorySubcomponentProps = {
    className?: string,
    goBack: () => void, // goes back to MainFactoryComponent
}

export const ControllerFactory = <T extends number>({ type, providers }: Props<T>) => {

    // todo: if this will be needed somewhere else then try passing index and array of React.FC and return it by index

    return providers[type]();

    // switch (type) {
    //     case MainControllerType.WALLS: {
    //         return <WallController/>
    //     }
    //     case MainControllerType.WINDOWS_AND_DOORS: {
    //         return <WallComponentController />
    //     }
    //     case MainControllerType.SELECT: {
    //         return <SelectMainController setType={setType}/>
    //     }
    //     default: {
    //         throw new Error("Not implemented yet."); // defensive fallback
    //     }
    // }
};
