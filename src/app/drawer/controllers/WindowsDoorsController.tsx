import { useEffect } from "react";
import { FactorySubcomponentProps } from "./ControllerFactory";

const WindowsDoorsController: React.FC<FactorySubcomponentProps> = ({ goBack }) => {

    useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <>
            <button onClick={goBack}>Powrót</button>
        </>
    );
}

export default WindowsDoorsController;
