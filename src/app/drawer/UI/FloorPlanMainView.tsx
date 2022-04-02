import { useEffect } from "react"

export type MainViewProps = {
    className?: string,
    walls: () => void,
    doorsAndWindows: () => void,
}

const FloorPlanMainView: React.FC<MainViewProps> = ({ walls, doorsAndWindows }: MainViewProps) => {

    useEffect(() => {
        
    }, [])

    const doNothing = () => {
    }

    return (
        <>
            <button onClick={walls}>Ściany</button>
            <button onClick={doorsAndWindows}>Drzwi i okna</button>
            <button onClick={doNothing}>Reset</button>
        </>
    );
}

export default FloorPlanMainView;
