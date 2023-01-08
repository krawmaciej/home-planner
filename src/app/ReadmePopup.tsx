import React from "react";
import {Button, Modal} from "react-bootstrap";
import {PRIMARY_VARIANT, SECONDARY_VARIANT} from "./arranger/constants/Types";

type Props = {
    isDisplayed: boolean,
    hide: () => void,
}

export const ReadmePopup: React.FC<Props> = ({ isDisplayed, hide }) => {
    return (
        <>
            <Modal show={isDisplayed} onHide={hide}>
                <Modal.Header closeButton>
                    <Modal.Title>How to use application</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center">
                        If this is a first time you are using this application
                        you can read a quick guide on how to use it.
                    </div>
                    <hr/>
                    <div>
                        <Button
                            href="markdown/generated/readme.html"
                            target="_blank"
                            className="side-by-side-parent"
                            variant={PRIMARY_VARIANT}
                        >
                            Guide
                        </Button>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="side-by-side-parent" variant={SECONDARY_VARIANT} onClick={hide}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
