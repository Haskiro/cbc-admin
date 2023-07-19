import {FC} from "react";
import cn from "classnames"

export type NotificationProps = {
    message: string,
    isActive: boolean,
    type: "error" | "success"
}
const Notification: FC<NotificationProps> = ({message, isActive, type}) => {
    return (
        <div className="fixed top-2 text-white right-2 text-[14px] shadow rounded-md p-2 z-20"
             style={{
                 backgroundColor: type === "success" ? "#52b963" : "#EF4444",
                 right: isActive ? "10px" : "-120%",
                 transition: "0.5s ease"
             }}
        >
            <p>{message}</p>
        </div>
    )
}

export default Notification;