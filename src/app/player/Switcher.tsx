import React from "react";
import { MdArrowForward, MdArrowBack } from "react-icons/md";
import { CustomButton } from "../components";
import { SwitcherProps, TriggerInfo } from "../customInterfaces";

const Switcher = (props: SwitcherProps) => {
    const triggerSwitch: TriggerInfo = props.triggerSwitch;
    const direction = props.direction;

    return (
        <CustomButton
            onClick={
                () => props.setTriggerSwitch({
                    trigger: true,
                    toPlay: direction === 'right' ? props.index + 1 : props.index,
                    lastPlaying: props.index
                })}
            disabled={props.active}
            iconColor="white"
            size="2.5em"
        >
            {
                direction === 'right' ? <MdArrowForward /> : <MdArrowBack />}
        </CustomButton>

    )
}

export { Switcher }