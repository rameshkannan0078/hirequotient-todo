import React from 'react';

interface HrRadioInputPropsT {
    onClick: () => void;
    value:boolean;
}

export const HrRadioInput: React.FC<HrRadioInputPropsT> = ({ onClick,value }) => {
    return (
        <div>
            <input
                type='checkbox'
                className="h-4 w-4 hover:cursor-pointer rounded-md border-2 border-gray-200"
                onChange={onClick}
                checked={value}
            />
        </div>
    );
};
