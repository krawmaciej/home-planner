import { useEffect } from "react";
import { MainViewProps } from "./FloorPlanMainView";


const WallsView: React.FC<MainViewProps> = ({ walls, doorsAndWindows }: MainViewProps) => {

    useEffect(() => {
        
    }, [])

    const doNothing = () => {
    }

    return (
        <>
            Rysowanie ścian aktywne.
        </>
    );
}

export default WallsView;
