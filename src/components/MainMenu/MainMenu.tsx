import React, { useState } from "react";
import MyCubes from "./MyCubes/MyCubes";

type Props = {
    userId: string;
    authToken: string;
}

const MainMenu = (props: Props): JSX.Element => {
    const [menu, setMenu] = useState<boolean[]>([true, false, false])
    return(
        <div>
            {menu[0] &&
                <div>
                    <MyCubes authToken={props.authToken} creator={props.userId}/>
                </div>
            }
        </div>
    )
}

export default MainMenu