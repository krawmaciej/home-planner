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
    return providers[type]();
};
