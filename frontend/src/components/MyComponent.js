import React, { useEffect } from "react";
import { log } from "../utils/logger";

const MyComponent = () => {
    useEffect(() => {
        log.info("MyComponent mounted");
        return () => {
            log.info("MyComponent unmounted");
        };
    }, []);

    return <div>My Component</div>;
};

export default MyComponent;
