import { SVGProps } from "react";

export const CalendarSvg = (props: SVGProps<SVGSVGElement>) =>  (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="4"
        y="5.59961"
        width="15.4216"
        height="14.4"
        rx="1.6"
        stroke="#4E52F5"
        stroke-width="1.716"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M15.1379 4V7.2"
        stroke="#4E52F5"
        stroke-width="1.716"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8.28336 4V7.2"
        stroke="#4E52F5"
        stroke-width="1.716"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M4 10.4H19.4216"
        stroke="#4E52F5"
        stroke-width="1.716"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );

