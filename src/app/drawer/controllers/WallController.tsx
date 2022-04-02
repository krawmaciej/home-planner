import { useEffect, useState } from "react";
import ControllerFactory, { FactorySubcomponentProps } from "./ControllerFactory";

const WallController: React.FC<FactorySubcomponentProps> = ({ goBack }) => {

    const [type, internalSetType] = useState<number>();

    useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setType = (type: number) => {
        setType(type);
    }

    return (
        <>
            <button onClick={goBack}>Powrót</button>
        </>
    );
}

export default WallController;
