import React from 'react';

export default function Spinner({ color = '#FFFFFF', strokeWidth = 3, diameter = 22 }) {
    return (
        <svg width={diameter} height={diameter} viewBox='0 0 50 50'>
            <g>
                <animateTransform
                    attributeName='transform'
                    type='rotate'
                    values='0 25 25; 360 25 25'
                    keyTimes='0; 1'
                    dur='5s'
                    repeatCount='indefinite'
                />
                <circle
                    cx='25'
                    cy='25'
                    r='20'
                    fill='none'
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray='126'
                    strokeDashoffset='126'
                >
                    <animate
                        attributeName='stroke-dashoffset'
                        values='126; 63; 126'
                        keyTimes='0; 0.5; 1'
                        dur='1.5s'
                        repeatCount='indefinite'
                    />
                    <animateTransform
                        attributeName='transform'
                        type='rotate'
                        values='0 25 25; 360 25 25'
                        keyTimes='0; 1'
                        dur='1.5s'
                        repeatCount='indefinite'
                    />
                </circle>
            </g>
        </svg>
    );
}
