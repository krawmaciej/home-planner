type Props<T extends string> = {
    type: T,
    providers: Map<T, () => JSX.Element>,
}

export type ComponentProvider = () => JSX.Element;

export type MainFactoryComponentProps<T extends string> = {
    className?: string,
    setType: (type: T) => void,
}

export type FactorySubcomponentProps = {
    className?: string,
    goBack: () => void, // goes back to MainFactoryComponent
}

export const ControllerFactory = <T extends string>({ type, providers }: Props<T>) => {
    const element = providers.get(type);
    if (element === undefined) {
        throw new Error(`Controller of type: ${type} not found in: ${JSON.stringify(providers)}.`);
    }
    return element();
};
