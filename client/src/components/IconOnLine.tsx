// icon:send-fill | Bootstrap https://icons.getbootstrap.com/ | Bootstrap
import * as React from "react";


function IconOnLine(props: React.HTMLProps<HTMLDivElement>) {
    return (
        <div
            className={"h-5 w-5 rounded-full bg-green-500 flex align-middle justify-center text-white"}>
            <p className={" ms-10 size-2"}>ONLINE</p>
            {props.children}
        </div>

    );
}

export default IconOnLine;