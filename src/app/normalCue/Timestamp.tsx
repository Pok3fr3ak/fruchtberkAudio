import React from "react"
import useResizeObserver from "use-resize-observer";

export const TimeStamp = (props: any) => {
    const scale = props.scale;
    const index = props.index;

    const { ref, width, height } = useResizeObserver<HTMLDivElement>();

    return (
        <div
            className="marker"
            ref={ref}
            style={
                {
                    marginLeft: index === 0 ? 1000 * scale : 1000 * scale - (width || 10 / 2)
                }
            }
        >
            <p>{index}</p>
            <div className="timeMarker"></div>
        </div>
    )
}