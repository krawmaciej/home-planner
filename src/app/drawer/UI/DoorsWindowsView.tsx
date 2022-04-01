import { useEffect } from "react";
import { MainViewProps } from "./FloorPlanMainView";


const DoorsWindowsView: React.FC<MainViewProps> = ({ walls, doorsAndWindows }: MainViewProps) => {

    useEffect(() => {
        
    }, [])

    const doNothing = () => {
    }

    return (
        <>
            Dodawanie okien i drzwi aktywne.
        </>
    );
}

export default DoorsWindowsView;
