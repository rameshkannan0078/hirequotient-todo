import * as featherIcons from 'react-feather';

interface HrIconButtonPropsT {
    icon: keyof typeof featherIcons;
    className?:string;
    id?:string;
    onClick?:()=>void;
}

export const HrIconButton = (props:HrIconButtonPropsT ) => {
    const {icon,id,className,onClick} = props;
    const FeatherIcon = featherIcons[icon];
    
    return (
        <div onClick={onClick} id={id}  className={`p-2 h-10 w-10  rounded-md cursor-pointer   ${className}`}>
            <FeatherIcon />
        </div>
    );
};
