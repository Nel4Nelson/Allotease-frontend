import { cn } from "@/lib/utils";

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  width?: number;
  height?: number;
}

interface HeroBackgroundProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-white cursor-pointer"
  >
    <path d="M3 12h18M3 6h18M3 18h18" />
  </svg>
);

export const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-white cursor-pointer"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const ExternalLinkIcon = ({ size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
  >
    <path d="M7 17l9.2-9.2M17 17V7H7" />
  </svg>
);

export function ArrowUpRightIcon({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 25"
      fill="none"
      className={cn(
        "transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
        className
      )}
    >
      <path
        d="M6 18.5L18 6.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.25 6.5H18V16.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const PersonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M11.9906 6.75C13.4404 6.75 14.6156 5.57475 14.6156 4.125C14.6156 2.67525 13.4404 1.5 11.9906 1.5C10.5409 1.5 9.36563 2.67525 9.36563 4.125C9.36563 5.57475 10.5409 6.75 11.9906 6.75Z"
      stroke="#FF5B00"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.4281 12.6281L17.6906 15.1594C17.9063 15.3389 18.1813 15.4313 18.4616 15.4186C18.742 15.4058 19.0074 15.2886 19.2058 15.0902C19.4043 14.8918 19.5214 14.6264 19.5342 14.346C19.547 14.0657 19.4545 13.7907 19.275 13.575L15.5625 8.80313C15.3895 8.62836 15.1836 8.48952 14.9568 8.39459C14.7299 8.29966 14.4865 8.25053 14.2406 8.25H9.74063C9.24151 8.25267 8.76343 8.45131 8.40938 8.80313L4.69688 13.575C4.50357 13.7896 4.40019 14.0703 4.40814 14.359C4.41609 14.6476 4.53476 14.9222 4.73957 15.1258C4.94439 15.3294 5.21966 15.4465 5.50839 15.4527C5.79713 15.459 6.0772 15.3539 6.29063 15.1594L9.55313 12.6281L6.94688 20.8406C6.88409 20.9748 6.84835 21.1201 6.84169 21.2681C6.83504 21.4161 6.8576 21.564 6.90809 21.7032C6.95858 21.8425 7.03602 21.9705 7.13597 22.0799C7.23592 22.1892 7.35643 22.2778 7.49063 22.3406C7.62482 22.4034 7.77007 22.4392 7.91808 22.4458C8.06609 22.4525 8.21395 22.4299 8.35324 22.3794C8.49253 22.3289 8.62051 22.2515 8.72987 22.1515C8.83923 22.0516 8.92784 21.9311 8.99063 21.7969L11.9906 17.0719L14.9906 21.7969C15.0492 21.9369 15.1356 22.0637 15.2445 22.1695C15.3533 22.2753 15.4825 22.3579 15.6242 22.4125C15.7659 22.467 15.9171 22.4924 16.0688 22.4869C16.2206 22.4815 16.3696 22.4453 16.507 22.3808C16.6444 22.3162 16.7673 22.2245 16.8683 22.1111C16.9693 21.9978 17.0464 21.8652 17.0947 21.7213C17.1431 21.5774 17.1619 21.4252 17.1499 21.2738C17.1379 21.1225 17.0954 20.9751 17.025 20.8406L14.4281 12.6281Z"
      stroke="#FF5B00"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const OrganizationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M1.5 20.25H22.5"
      stroke="#FF5B00"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.5 20.25V3.75C13.5 3.55109 13.421 3.36032 13.2803 3.21967C13.1397 3.07902 12.9489 3 12.75 3H3.75C3.55109 3 3.36032 3.07902 3.21967 3.21967C3.07902 3.36032 3 3.55109 3 3.75V20.25"
      stroke="#FF5B00"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 20.25V9.75C21 9.55109 20.921 9.36032 20.7803 9.21967C20.6397 9.07902 20.4489 9 20.25 9H13.5"
      stroke="#FF5B00"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 6.75H9"
      stroke="#FF5B00"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 12.75H10.5"
      stroke="#FF5B00"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 16.5H9"
      stroke="#FF5B00"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.5 16.5H18"
      stroke="#FF5B00"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.5 12.75H18"
      stroke="#FF5B00"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function AtIcon({
  size = 24,
  color = "var(--feature-accent-orange)",
  className = "",
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M12 8.25C14.0711 8.25 15.75 9.92893 15.75 12C15.75 14.0711 14.0711 15.75 12 15.75C9.92893 15.75 8.25 14.0711 8.25 12C8.25 9.92893 9.92893 8.25 12 8.25Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.9781 4.4982C15.3076 3.38907 13.3145 2.86959 11.3151 3.02218C9.31572 3.17478 7.42455 3.99071 5.94168 5.3405C4.45881 6.6903 3.46918 8.49665 3.12982 10.4729C2.79046 12.4492 3.12081 14.4822 4.06845 16.2494C5.01608 18.0165 6.52673 19.4166 8.36068 20.2275C10.1946 21.0383 12.2469 21.2135 14.1917 20.7251C16.1365 20.2368 17.8626 19.113 19.096 17.532C20.3294 15.951 20.9995 14.0034 21 11.9982C21 9.92633 20.25 8.2482 18.375 8.2482C16.5 8.2482 15.75 9.92633 15.75 11.9982V15.7482"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="21"
    height="20"
    viewBox="0 0 21 20"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.82957 8.8178C3.82957 5.58363 6.46124 2.9528 9.6954 2.9528C12.9287 2.9528 15.5604 5.58363 15.5604 8.8178C15.5604 12.052 12.9287 14.6836 9.6954 14.6836C6.46124 14.6836 3.82957 12.052 3.82957 8.8178ZM19.2421 17.5336L15.4096 13.7111C16.5396 12.3936 17.2271 10.6861 17.2271 8.8178C17.2271 4.6653 13.8479 1.28613 9.6954 1.28613C5.54207 1.28613 2.1629 4.6653 2.1629 8.8178C2.1629 12.9711 5.54207 16.3503 9.6954 16.3503C11.3804 16.3503 12.9329 15.787 14.1887 14.8478L18.0654 18.7136L19.2421 17.5336Z"
      fill="#71727A"
    />
  </svg>
);

export const PencilIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M7.24219 16.8749H3.75C3.58424 16.8749 3.42527 16.8091 3.30806 16.6919C3.19085 16.5747 3.125 16.4157 3.125 16.2499V12.7577C3.12472 12.6766 3.14044 12.5962 3.17127 12.5211C3.20211 12.446 3.24744 12.3778 3.30469 12.3202L12.6797 2.94524C12.7378 2.88619 12.8072 2.83929 12.8836 2.80728C12.9601 2.77527 13.0421 2.75879 13.125 2.75879C13.2079 2.75879 13.2899 2.77527 13.3664 2.80728C13.4428 2.83929 13.5122 2.88619 13.5703 2.94524L17.0547 6.42962C17.1137 6.48777 17.1606 6.5571 17.1926 6.63355C17.2247 6.71 17.2411 6.79205 17.2411 6.87493C17.2411 6.95781 17.2247 7.03987 17.1926 7.11632C17.1606 7.19277 17.1137 7.26209 17.0547 7.32024L7.67969 16.6952C7.62216 16.7525 7.5539 16.7978 7.47883 16.8287C7.40376 16.8595 7.32334 16.8752 7.24219 16.8749V16.8749Z"
      stroke="#1F3A3A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.625 5L15 9.375"
      stroke="#1F3A3A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const TicketIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M7.5 4.375V15.625"
      stroke="#1F3A3A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1.87499 13.0625C1.8742 12.9186 1.92374 12.7789 2.01504 12.6676C2.10635 12.5563 2.23367 12.4805 2.37499 12.4531C2.93712 12.3338 3.4412 12.025 3.80289 11.5784C4.16458 11.1319 4.36194 10.5747 4.36194 10C4.36194 9.42534 4.16458 8.86812 3.80289 8.42157C3.4412 7.97502 2.93712 7.66623 2.37499 7.54687C2.23367 7.51955 2.10635 7.44368 2.01504 7.33241C1.92374 7.22113 1.8742 7.08144 1.87499 6.9375V5C1.87499 4.83424 1.94084 4.67527 2.05805 4.55806C2.17526 4.44085 2.33423 4.375 2.49999 4.375H17.5C17.6658 4.375 17.8247 4.44085 17.9419 4.55806C18.0591 4.67527 18.125 4.83424 18.125 5V6.9375C18.1258 7.08144 18.0763 7.22113 17.9849 7.33241C17.8936 7.44368 17.7663 7.51955 17.625 7.54687C17.0629 7.66623 16.5588 7.97502 16.1971 8.42157C15.8354 8.86812 15.638 9.42534 15.638 10C15.638 10.5747 15.8354 11.1319 16.1971 11.5784C16.5588 12.025 17.0629 12.3338 17.625 12.4531C17.7663 12.4805 17.8936 12.5563 17.9849 12.6676C18.0763 12.7789 18.1258 12.9186 18.125 13.0625V15C18.125 15.1658 18.0591 15.3247 17.9419 15.4419C17.8247 15.5592 17.6658 15.625 17.5 15.625H2.49999C2.33423 15.625 2.17526 15.5592 2.05805 15.4419C1.94084 15.3247 1.87499 15.1658 1.87499 15V13.0625Z"
      stroke="#1F3A3A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const FolderIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M18.125 15C18.125 15.1658 18.0591 15.3247 17.9419 15.4419C17.8247 15.5592 17.6658 15.625 17.5 15.625H2.5C2.33424 15.625 2.17527 15.5592 2.05806 15.4419C1.94085 15.3247 1.875 15.1658 1.875 15V6.25C1.875 6.08424 1.94085 5.92527 2.05806 5.80806C2.17527 5.69085 2.33424 5.625 2.5 5.625H7.1875L8.75 3.75H17.5C17.6658 3.75 17.8247 3.81585 17.9419 3.93306C18.0591 4.05027 18.125 4.20924 18.125 4.375V15Z"
      stroke="#71727A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const BuildingIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M2.5 17.5H17.5M5 17.5V3.75C5 3.58424 5.06585 3.42527 5.18306 3.30806C5.30027 3.19085 5.45924 3.125 5.625 3.125H14.375C14.5408 3.125 14.6997 3.19085 14.8169 3.30806C14.9342 3.42527 15 3.58424 15 3.75V17.5M7.5 7.5H8.75M7.5 10H8.75M7.5 12.5H8.75M11.25 7.5H12.5M11.25 10H12.5M11.25 12.5H12.5"
      stroke="#71727A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <circle
      cx="10"
      cy="10"
      r="8.125"
      stroke="#71727A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 13.75V10"
      stroke="#71727A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 6.25H10.0088"
      stroke="#71727A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M7.5 17.5H4.375C4.20924 17.5 4.05027 17.4342 3.93306 17.3169C3.81585 17.1997 3.75 17.0408 3.75 16.875V3.125C3.75 2.95924 3.81585 2.80027 3.93306 2.68306C4.05027 2.56585 4.20924 2.5 4.375 2.5H7.5M13.75 13.75L17.5 10M17.5 10L13.75 6.25M17.5 10H7.5"
      stroke="#71727A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function UploadIcon({
  className = "",
  width = 20,
  height = 21,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 20 21"
      fill="none"
      className={className}
    >
      <path
        d="M13.75 10.5H17.5C17.6658 10.5 17.8247 10.5658 17.9419 10.6831C18.0592 10.8003 18.125 10.9592 18.125 11.125V16.125C18.125 16.2908 18.0592 16.4497 17.9419 16.5669C17.8247 16.6842 17.6658 16.75 17.5 16.75H2.5C2.33424 16.75 2.17527 16.6842 2.05806 16.5669C1.94085 16.4497 1.875 16.2908 1.875 16.125V11.125C1.875 10.9592 1.94085 10.8003 2.05806 10.6831C2.17527 10.5658 2.33424 10.5 2.5 10.5H6.25"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 10.5V2.375"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.25 6.125L10 2.375L13.75 6.125"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.6875 14.25C15.0327 14.25 15.3125 13.9702 15.3125 13.625C15.3125 13.2798 15.0327 13 14.6875 13C14.3423 13 14.0625 13.2798 14.0625 13.625C14.0625 13.9702 14.3423 14.25 14.6875 14.25Z"
        fill="black"
      />
    </svg>
  );
}

export function CalendarIcon({
  className = "",
  width = 20,
  height = 21,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 20 21"
      fill="none"
      className={className}
    >
      <path
        d="M16.25 3.625H3.75C3.40482 3.625 3.125 3.90482 3.125 4.25V16.75C3.125 17.0952 3.40482 17.375 3.75 17.375H16.25C16.5952 17.375 16.875 17.0952 16.875 16.75V4.25C16.875 3.90482 16.5952 3.625 16.25 3.625Z"
        stroke="#1F2024"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.75 2.375V4.875"
        stroke="#1F2024"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.25 2.375V4.875"
        stroke="#1F2024"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.125 7.375H16.875"
        stroke="#1F2024"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.1875 10.5H9.375L8.125 12.0625C8.33072 12.0621 8.53334 12.1126 8.7149 12.2093C8.89646 12.306 9.05134 12.4461 9.16579 12.617C9.28025 12.788 9.35075 12.9845 9.37104 13.1892C9.39133 13.3939 9.36079 13.6005 9.28211 13.7906C9.20343 13.9806 9.07906 14.1484 8.92002 14.2789C8.76098 14.4093 8.5722 14.4986 8.37041 14.5386C8.16863 14.5786 7.96008 14.5682 7.76327 14.5084C7.56646 14.4485 7.38748 14.341 7.24219 14.1953"
        stroke="#1F2024"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.25 11.4375L12.5 10.5V14.5625"
        stroke="#1F2024"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronDownIcon({
  className = "",
  width = 20,
  height = 20,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 20 21"
      fill="none"
      className={className}
    >
      <path
        d="M4.375 9.25L10 14.875L15.625 9.25"
        stroke="#1F2024"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CategoryTagIcon({
  className = "",
  width = 18,
  height = 18,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 18 18"
      fill="none"
      className={className}
    >
      <path
        d="M13.6687 13.8094L16.875 9.00002L13.6687 4.19065C13.6179 4.11222 13.548 4.04791 13.4657 4.00366C13.3833 3.95941 13.2911 3.93666 13.1977 3.93752H2.8125C2.66332 3.93752 2.52024 3.99679 2.41475 4.10228C2.30926 4.20777 2.25 4.35084 2.25 4.50002V13.5C2.25 13.6492 2.30926 13.7923 2.41475 13.8978C2.52024 14.0033 2.66332 14.0625 2.8125 14.0625H13.1977C13.2911 14.0634 13.3833 14.0406 13.4657 13.9964C13.548 13.9521 13.6179 13.8878 13.6687 13.8094Z"
        fill="#FF5B00"
      />
    </svg>
  );
}

export function StarIcon({ className = "" }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={className}
    >
      <path
        d="M7.24062 10.4284L9.99687 12.1784C10.3523 12.4026 10.7898 12.0691 10.6859 11.6589L9.8875 8.51984C9.86591 8.43283 9.86934 8.34149 9.8974 8.25634C9.92546 8.1712 9.977 8.09571 10.0461 8.03859L12.518 5.97687C12.8406 5.7089 12.6766 5.16749 12.2555 5.14015L9.0289 4.93234C8.94087 4.92722 8.85623 4.89656 8.78533 4.84411C8.71443 4.79167 8.66035 4.71971 8.62969 4.63703L7.42656 1.60734C7.39471 1.51978 7.33669 1.44415 7.26038 1.39071C7.18407 1.33726 7.09316 1.30859 7 1.30859C6.90683 1.30859 6.81592 1.33726 6.73961 1.39071C6.6633 1.44415 6.60528 1.51978 6.57343 1.60734L5.37031 4.63703C5.33965 4.71971 5.28556 4.79167 5.21466 4.84411C5.14377 4.89656 5.05913 4.92722 4.97109 4.93234L1.74453 5.14015C1.32344 5.16749 1.15937 5.7089 1.48203 5.97687L3.9539 8.03859C4.02299 8.09571 4.07454 8.1712 4.1026 8.25634C4.13065 8.34149 4.13409 8.43283 4.1125 8.51984L3.37422 11.4292C3.24844 11.9214 3.77344 12.3206 4.19453 12.0526L6.75937 10.4284C6.8313 10.3827 6.91476 10.3584 7 10.3584C7.08523 10.3584 7.1687 10.3827 7.24062 10.4284Z"
        fill="url(#paint0_linear_2168_4845)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_2168_4845"
          x1="7"
          y1="7"
          x2="1.80616e-07"
          y2="-1"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7DF5B0" />
          <stop offset="0.355769" stopColor="white" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function LeftArrowIcon({ className = "" }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M20.25 12H3.75"
        stroke="#FF5B00"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 18.75L3.75 12L10.5 5.25"
        stroke="#FF5B00"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RightArrowIcon({ className = "" }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M3.75 12H20.25"
        stroke="#FF5B00"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 18.75L20.25 12L13.5 5.25"
        stroke="#FF5B00"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


export const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M16.4167 10H3.58341"
      stroke="#1F2024"
      strokeWidth="0.777778"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 16.416V3.58268"
      stroke="#1F2024"
      strokeWidth="0.777778"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Check Icon Component
export const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M16.4165 5.91699L8.24984 14.0837L4.1665 10.0003"
      stroke="#15BA6B"
      strokeWidth="0.777778"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Minus Icon Component
export const MinusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M16.4167 10H3.58341"
      stroke="#1F2024"
      strokeWidth="0.777778"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const HeroBackground: React.FC<HeroBackgroundProps> = ({
  className = "",
  width = 1922,
  height = 982,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={width}
      height={height}
      viewBox="0 0 1922 982"
      fill="none"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <g clipPath="url(#clip0_451_6722)">
        <rect
          width="2157"
          height="982"
          transform="translate(-118)"
          fill="#2F4F4F"
        />
        <rect
          opacity="0.4"
          x="-98.5"
          y="-704"
          width="1540"
          height="1061.38"
          fill="url(#pattern0_451_6722)"
        />

        <g filter="url(#filter0_f_451_6722)">
          <rect
            x="-27.5"
            y="237"
            width="1513"
            height="298"
            rx="149"
            fill="url(#paint0_linear_451_6722)"
          />
        </g>

        <g filter="url(#filter1_f_451_6722)">
          <rect
            x="-347.5"
            y="318"
            width="2037"
            height="153"
            rx="76.5"
            fill="#2F4F4F"
            fillOpacity="0.72"
          />
        </g>

        <g filter="url(#filter2_f_451_6722)">
          <rect x="-129.5" y="343" width="1724" height="179" fill="#2F4F4F" />
        </g>

        <g filter="url(#filter3_d_451_6722)">
          <g filter="url(#filter4_i_451_6722)">
            <path
              d="M1596.09 468.139L1561.57 136.397L1865.06 267.609L1904.81 597.275L1596.09 468.139Z"
              fill="url(#paint1_linear_451_6722)"
            />
          </g>
          <path
            d="M1335.51 659.28L1597.67 464.483L1904.81 597.276L1637.42 794.149L1335.51 659.28Z"
            fill="url(#paint2_linear_451_6722)"
          />
          <path
            d="M1597.67 464.482L1335.51 659.279L1294.18 333.27L1561.57 136.397L1597.67 464.482Z"
            fill="#FF7058"
          />
        </g>

        <g opacity="0.7" filter="url(#filter5_d_451_6722)">
          <g filter="url(#filter6_i_451_6722)">
            <path
              d="M1229.85 301.307L1209.36 104.329L1389.56 182.239L1413.16 377.984L1229.85 301.307Z"
              fill="url(#paint3_linear_451_6722)"
            />
          </g>
          <path
            d="M1075.13 414.801L1230.79 299.136L1413.16 377.985L1254.39 494.882L1075.13 414.801Z"
            fill="url(#paint4_linear_451_6722)"
          />
          <path
            d="M1230.79 299.136L1075.13 414.8L1050.58 221.226L1209.36 104.329L1230.79 299.136Z"
            fill="white"
          />
        </g>
      </g>

      <defs>
        <pattern
          id="pattern0_451_6722"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#image0_451_6722"
            transform="scale(0.000244141 0.000354233)"
          />
        </pattern>

        <filter
          id="filter0_f_451_6722"
          x="-282.034"
          y="-17.5341"
          width="2022.07"
          height="807.068"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="127.267"
            result="effect1_foregroundBlur_451_6722"
          />
        </filter>

        <filter
          id="filter1_f_451_6722"
          x="-544.2"
          y="121.3"
          width="2430.4"
          height="546.4"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="98.35"
            result="effect1_foregroundBlur_451_6722"
          />
        </filter>

        <filter
          id="filter2_f_451_6722"
          x="-198.3"
          y="274.2"
          width="1861.6"
          height="316.6"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="34.4"
            result="effect1_foregroundBlur_451_6722"
          />
        </filter>

        <filter
          id="filter3_d_451_6722"
          x="1102.32"
          y="-11.3308"
          width="994.346"
          height="1041.46"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="44.1264" />
          <feGaussianBlur stdDeviation="95.9268" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.917647 0 0 0 0 0.247059 0 0 0 0 0.137255 0 0 0 0.4 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_451_6722"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_451_6722"
            result="shape"
          />
        </filter>

        <filter
          id="filter4_i_451_6722"
          x="1561.57"
          y="132.56"
          width="343.243"
          height="464.715"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="-3.83707" />
          <feGaussianBlur stdDeviation="12.4225" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 0.439216 0 0 0 0 0.345098 0 0 0 0.5 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect1_innerShadow_451_6722"
          />
        </filter>

        <filter
          id="filter5_d_451_6722"
          x="936.668"
          y="16.6131"
          width="590.412"
          height="618.386"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="26.2008" />
          <feGaussianBlur stdDeviation="56.9584" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.533333 0 0 0 0 0.533333 0 0 0 0 0.533333 0 0 0 0.4 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_451_6722"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_451_6722"
            result="shape"
          />
        </filter>

        <filter
          id="filter6_i_451_6722"
          x="1209.36"
          y="102.051"
          width="203.807"
          height="275.933"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="-2.27833" />
          <feGaussianBlur stdDeviation="7.37611" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect1_innerShadow_451_6722"
          />
        </filter>

        <linearGradient
          id="paint0_linear_451_6722"
          x1="729.406"
          y1="290.33"
          x2="729.374"
          y2="330.841"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#16F476" stopOpacity="0.4" />
          <stop offset="0.375" stopColor="#2F4F4F" />
        </linearGradient>

        <linearGradient
          id="paint1_linear_451_6722"
          x1="1554.73"
          y1="151.207"
          x2="1674.7"
          y2="502.127"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF7058" />
          <stop offset="1" stopColor="#F95034" />
        </linearGradient>

        <linearGradient
          id="paint2_linear_451_6722"
          x1="1676.28"
          y1="498.471"
          x2="1433.26"
          y2="821.362"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F95034" />
          <stop offset="1" stopColor="#D02407" />
        </linearGradient>

        <linearGradient
          id="paint3_linear_451_6722"
          x1="1205.3"
          y1="113.123"
          x2="1276.53"
          y2="321.488"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F8F8F8" />
          <stop offset="1" stopColor="#E0E0E0" />
        </linearGradient>

        <linearGradient
          id="paint4_linear_451_6722"
          x1="1277.47"
          y1="319.318"
          x2="1133.17"
          y2="511.04"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F1F1F1" />
          <stop offset="1" stopColor="#818181" />
        </linearGradient>

        <clipPath id="clip0_451_6722">
          <rect
            width="2157"
            height="982"
            fill="white"
            transform="translate(-118)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export const InstagramIcon: React.FC<IconProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="27"
      height="28"
      viewBox="0 0 27 28"
      fill="none"
      className={className}
    >
      <path
        d="M13.3425 24.3432C10.6078 24.3432 10.2854 24.3288 9.21819 24.2821C8.38596 24.2547 7.56449 24.0855 6.78917 23.7818C5.44772 23.2598 4.38698 22.1987 3.86545 20.857C3.57342 20.0789 3.41591 19.2567 3.39966 18.4258C3.3374 17.3608 3.3374 17.0117 3.3374 14.2981C3.3374 11.5556 3.35185 11.2354 3.39966 10.1738C3.41626 9.34391 3.57377 8.52292 3.86545 7.74585C4.38642 6.40242 5.44887 5.34036 6.7925 4.81991C7.56917 4.52665 8.39037 4.36872 9.22042 4.353C10.2821 4.29297 10.6311 4.29297 13.3425 4.29297C16.0995 4.29297 16.4163 4.30742 17.4669 4.353C18.2991 4.36886 19.1224 4.52677 19.9014 4.81991C21.2447 5.34095 22.3069 6.4028 22.8285 7.74585C23.1255 8.53425 23.2838 9.36807 23.2965 10.2104C23.3588 11.2754 23.3588 11.6234 23.3588 14.3359C23.3588 17.0484 23.3432 17.4041 23.2965 18.4569C23.28 19.2886 23.1221 20.1115 22.8296 20.8904C22.3067 22.2329 21.2444 23.2945 19.9014 23.8163C19.1235 24.1078 18.3019 24.2653 17.4713 24.2821C16.4097 24.3432 16.0617 24.3432 13.3425 24.3432ZM13.3047 6.05276C10.5856 6.05276 10.3032 6.0661 9.24154 6.1139C8.60786 6.1223 7.98031 6.23923 7.38614 6.45963C6.50875 6.79537 5.81448 7.48682 5.47516 8.36283C5.25306 8.96347 5.13611 9.59788 5.12943 10.2382C5.07051 11.3155 5.07051 11.5978 5.07051 14.2981C5.07051 16.9661 5.08052 17.2896 5.12943 18.3602C5.13938 18.9941 5.25627 19.6217 5.47516 20.2167C5.81498 21.0921 6.50913 21.783 7.38614 22.1188C7.97991 22.3406 8.60771 22.4576 9.24154 22.4645C10.3176 22.5268 10.6011 22.5268 13.3047 22.5268C16.0317 22.5268 16.314 22.5134 17.3668 22.4645C18.0009 22.4568 18.6289 22.3398 19.2233 22.1188C20.0954 21.7801 20.7851 21.0908 21.1243 20.2189C21.346 19.6178 21.4629 18.9831 21.47 18.3424H21.4822C21.5301 17.2796 21.5301 16.9961 21.5301 14.2803C21.5301 11.5645 21.5178 11.2788 21.47 10.2171C21.4601 9.58396 21.3432 8.95704 21.1243 8.36283C20.7859 7.48969 20.0961 6.79902 19.2233 6.45963C18.6291 6.23812 18.001 6.12115 17.3668 6.1139C16.2918 6.05276 16.0106 6.05276 13.3047 6.05276ZM13.3425 19.4329C11.2637 19.4343 9.38874 18.1831 8.59216 16.2629C7.79558 14.3428 8.23425 12.1318 9.70359 10.6612C11.1729 9.19058 13.3835 8.75 15.3044 9.54492C17.2252 10.3398 18.478 12.2137 18.4785 14.2925C18.4754 17.1285 16.1785 19.4274 13.3425 19.4329ZM13.3425 10.9553C11.5006 10.9553 10.0075 12.4484 10.0075 14.2903C10.0075 16.1322 11.5006 17.6254 13.3425 17.6254C15.1844 17.6254 16.6776 16.1322 16.6776 14.2903C16.6733 12.4502 15.1826 10.9595 13.3425 10.9553ZM18.6786 10.1626C18.0176 10.1602 17.4834 9.62302 17.4846 8.96204C17.4859 8.30105 18.0221 7.76587 18.683 7.76587C19.344 7.76587 19.8802 8.30104 19.8814 8.96203C19.8817 9.28093 19.755 9.58682 19.5293 9.8121C19.3036 10.0374 18.9975 10.1635 18.6786 10.1626Z"
        fill="#D5FFEB"
        fillOpacity="0.5"
      />
    </svg>
  );
};

export const TwitterIcon: React.FC<IconProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      className={className}
    >
      <path
        d="M23.0069 8.38857C24.0034 7.79281 24.7491 6.85471 25.1046 5.74944C24.1682 6.30506 23.1437 6.69646 22.0753 6.9067C20.5941 5.33982 18.2472 4.95851 16.3461 5.97584C14.445 6.99317 13.4603 9.15729 13.9423 11.2589C10.1065 11.0664 6.53286 9.25448 4.11055 6.27415C2.84639 8.45463 3.4924 11.242 5.58686 12.6441C4.82948 12.6197 4.0889 12.4147 3.42687 12.046C3.42687 12.066 3.42687 12.086 3.42687 12.106C3.4273 14.3774 5.0281 16.3338 7.25438 16.784C6.55187 16.9751 5.81499 17.0032 5.09995 16.8662C5.72604 18.8087 7.51624 20.1394 9.55667 20.1791C7.86673 21.5054 5.77971 22.2247 3.63142 22.2212C3.25063 22.2218 2.87015 22.1999 2.49194 22.1556C4.67349 23.5575 7.21255 24.3016 9.80569 24.2989C13.4134 24.3237 16.8805 22.9015 19.4314 20.3503C21.9824 17.7991 23.4044 14.3319 23.3793 10.7242C23.3793 10.5174 23.3745 10.3118 23.3649 10.1072C24.2992 9.432 25.1055 8.59551 25.7461 7.63707C24.8756 8.0229 23.9523 8.2762 23.0069 8.38857Z"
        fill="#D5FFEB"
        fillOpacity="0.5"
      />
    </svg>
  );
};

export const WhatsAppIcon: React.FC<IconProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="23"
      viewBox="0 0 22 23"
      fill="none"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.2786 21.5709C17.1597 21.5709 21.9273 16.8033 21.9273 10.9222C21.9273 5.04103 17.1597 0.273438 11.2786 0.273438C5.39748 0.273438 0.629883 5.04103 0.629883 10.9222C0.629883 12.832 1.13265 14.6244 2.01306 16.1742L0.629883 21.5709L6.19374 20.2807C7.70473 21.1034 9.43708 21.5709 11.2786 21.5709ZM11.2786 19.9326C16.2549 19.9326 20.2891 15.8985 20.2891 10.9222C20.2891 5.94582 16.2549 1.9117 11.2786 1.9117C6.30227 1.9117 2.26815 5.94582 2.26815 10.9222C2.26815 12.8435 2.86954 14.6245 3.89436 16.087L3.08728 19.1135L6.16717 18.3435C7.61953 19.3457 9.38053 19.9326 11.2786 19.9326Z"
        fill="#D5FFEB"
        fillOpacity="0.5"
      />
      <path
        d="M8.61618 5.97625C8.363 5.46772 7.9746 5.51274 7.58223 5.51274C6.881 5.51274 5.7876 6.35268 5.7876 7.91589C5.7876 9.19703 6.35213 10.5994 8.25443 12.6973C10.0903 14.7219 12.5025 15.7692 14.5051 15.7336C16.5076 15.6979 16.9197 13.9746 16.9197 13.3927C16.9197 13.1347 16.7596 13.006 16.6493 12.971C15.9669 12.6435 14.7083 12.0333 14.4219 11.9186C14.1355 11.804 13.986 11.9591 13.893 12.0434C13.6333 12.2909 13.1185 13.0203 12.9422 13.1844C12.766 13.3484 12.5032 13.2654 12.3938 13.2034C11.9914 13.0419 10.9003 12.5565 10.0305 11.7134C8.95489 10.6707 8.89176 10.312 8.68911 9.99266C8.52699 9.7372 8.64596 9.58046 8.70532 9.51196C8.93707 9.24456 9.25707 8.83171 9.40058 8.62655C9.54408 8.42139 9.43016 8.1099 9.3618 7.9159C9.0678 7.08153 8.81873 6.38308 8.61618 5.97625Z"
        fill="#D5FFEB"
        fillOpacity="0.5"
      />
    </svg>
  );
};

export const ArrowIcon: React.FC<IconProps> = ({
  className,
  width = 25,
  height = 25,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 25 25"
      fill="none"
      className={className}
    >
      <path
        d="M6.5 18.8906L18.5 6.89062"
        stroke="#6DFF6D"
        strokeOpacity="0.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.75 6.89062H18.5V16.6406"
        stroke="#6DFF6D"
        strokeOpacity="0.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const AccordionPlusIcon: React.FC<IconProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="18"
      viewBox="0 0 24 18"
      fill="none"
      className={className}
    >
      <path
        d="M3.75 9H20.25"
        stroke="#71727A"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 2.8125V15.1875"
        stroke="#71727A"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const AccordionCloseIcon: React.FC<IconProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M18.75 5.25L5.25 18.75"
        stroke="#1F3A3A"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.75 18.75L5.25 5.25"
        stroke="#1F3A3A"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Browsers Icon (Overview)
export const BrowsersIcon = ({ size = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M14.375 6.25H3.125C2.77982 6.25 2.5 6.52982 2.5 6.875V15.625C2.5 15.9702 2.77982 16.25 3.125 16.25H14.375C14.7202 16.25 15 15.9702 15 15.625V6.875C15 6.52982 14.7202 6.25 14.375 6.25Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 6.25V4.375C5 4.20924 5.06585 4.05027 5.18306 3.93306C5.30027 3.81585 5.45924 3.75 5.625 3.75H16.875C17.0408 3.75 17.1997 3.81585 17.3169 3.93306C17.4342 4.05027 17.5 4.20924 17.5 4.375V13.125C17.5 13.2908 17.4342 13.4497 17.3169 13.5669C17.1997 13.6842 17.0408 13.75 16.875 13.75H15"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.5 8.75H15"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Brandy Icon (Reservations)
export const BrandyIcon = ({ size = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M10 13.75V17.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.875 17.5H13.125"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.7656 3.125C16.4396 4.16271 16.8211 5.36309 16.8697 6.59952C16.9183 7.83595 16.6324 9.06258 16.042 10.15C15.4516 11.2375 14.5786 12.1454 13.5152 12.7781C12.4518 13.4108 11.2374 13.7448 10 13.7448C8.76262 13.7448 7.54817 13.4108 6.48477 12.7781C5.42136 12.1454 4.54842 11.2375 3.95803 10.15C3.36764 9.06258 3.08168 7.83595 3.13031 6.59952C3.17895 5.36309 3.56038 4.16271 4.23438 3.125H15.7656Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.125 6.875H16.875"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Armchair Icon (Withdrawal)
export const ArmchairIcon = ({ size = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M6.25 10.625H13.75"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.75 7.5V5.625C3.75 4.96196 4.01339 4.32607 4.48223 3.85723C4.95107 3.38839 5.58696 3.125 6.25 3.125H13.75C14.413 3.125 15.0489 3.38839 15.5178 3.85723C15.9866 4.32607 16.25 4.96196 16.25 5.625V7.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.25 13.125V10C6.25 9.50555 6.10338 9.0222 5.82868 8.61108C5.55397 8.19995 5.16353 7.87952 4.70671 7.6903C4.24989 7.50108 3.74723 7.45157 3.26228 7.54804C2.77732 7.6445 2.33187 7.8826 1.98223 8.23223C1.6326 8.58187 1.3945 9.02732 1.29804 9.51228C1.20157 9.99723 1.25108 10.4999 1.4403 10.9567C1.62952 11.4135 1.94995 11.804 2.36108 12.0787C2.7722 12.3534 3.25555 12.5 3.75 12.5V15.625C3.75 15.7908 3.81585 15.9497 3.93306 16.0669C4.05027 16.1842 4.20924 16.25 4.375 16.25H15.625C15.7908 16.25 15.9497 16.1842 16.0669 16.0669C16.1842 15.9497 16.25 15.7908 16.25 15.625V12.5C16.7445 12.5 17.2278 12.3534 17.6389 12.0787C18.0501 11.804 18.3705 11.4135 18.5597 10.9567C18.7489 10.4999 18.7984 9.99723 18.702 9.51228C18.6055 9.02732 18.3674 8.58187 18.0178 8.23223C17.6681 7.8826 17.2227 7.6445 16.7377 7.54804C16.2528 7.45157 15.7501 7.50108 15.2933 7.6903C14.8365 7.87952 14.446 8.19995 14.1713 8.61108C13.8966 9.0222 13.75 9.50555 13.75 10V13.125"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Eye Icon (Open)
export const EyeOpenIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="21"
    viewBox="0 0 20 21"
    fill="none"
  >
    <path
      d="M10 4.875C3.75 4.875 1.25 10.5 1.25 10.5C1.25 10.5 3.75 16.125 10 16.125C16.25 16.125 18.75 10.5 18.75 10.5C18.75 10.5 16.25 4.875 10 4.875Z"
      stroke="#D5FFEB"
      strokeOpacity="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 13.625C11.7259 13.625 13.125 12.2259 13.125 10.5C13.125 8.77411 11.7259 7.375 10 7.375C8.27411 7.375 6.875 8.77411 6.875 10.5C6.875 12.2259 8.27411 13.625 10 13.625Z"
      stroke="#D5FFEB"
      strokeOpacity="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Eye Icon (Closed) - Modified from open version
export const EyeClosedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="21"
    viewBox="0 0 20 21"
    fill="none"
  >
    <path
      d="M3.28 3.78l13.44 13.44"
      stroke="#D5FFEB"
      strokeOpacity="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 4.875C3.75 4.875 1.25 10.5 1.25 10.5C1.25 10.5 3.75 16.125 10 16.125C16.25 16.125 18.75 10.5 18.75 10.5C18.75 10.5 16.25 4.875 10 4.875Z"
      stroke="#D5FFEB"
      strokeOpacity="0.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 13.625C11.7259 13.625 13.125 12.2259 13.125 10.5C13.125 8.77411 11.7259 7.375 10 7.375C8.27411 7.375 6.875 8.77411 6.875 10.5C6.875 12.2259 8.27411 13.625 10 13.625Z"
      stroke="#D5FFEB"
      strokeOpacity="0.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Withdrawal History Icon
export const WithdrawalHistoryIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M7.5 11.875H12.5"
      stroke="#D5FFEB"
      strokeOpacity="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 9.375H12.5"
      stroke="#D5FFEB"
      strokeOpacity="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.5 3.125H15.625C15.7908 3.125 15.9497 3.19085 16.0669 3.30806C16.1842 3.42527 16.25 3.58424 16.25 3.75V16.875C16.25 17.0408 16.1842 17.1997 16.0669 17.3169C15.9497 17.4342 15.7908 17.5 15.625 17.5H4.375C4.20924 17.5 4.05027 17.4342 3.93306 17.3169C3.81585 17.1997 3.75 17.0408 3.75 16.875V3.75C3.75 3.58424 3.81585 3.42527 3.93306 3.30806C4.05027 3.19085 4.20924 3.125 4.375 3.125H7.5"
      stroke="#D5FFEB"
      strokeOpacity="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.875 5.625V5C6.875 4.1712 7.20424 3.37634 7.79029 2.79029C8.37634 2.20424 9.1712 1.875 10 1.875C10.8288 1.875 11.6237 2.20424 12.2097 2.79029C12.7958 3.37634 13.125 4.1712 13.125 5V5.625H6.875Z"
      stroke="#D5FFEB"
      strokeOpacity="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Status Icons
export const PendingIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="21"
    height="20"
    viewBox="0 0 21 20"
    fill="none"
  >
    <path
      d="M10.095 17.5C14.2371 17.5 17.595 14.1421 17.595 10C17.595 5.85786 14.2371 2.5 10.095 2.5C5.95287 2.5 2.595 5.85786 2.595 10C2.595 14.1421 5.95287 17.5 10.095 17.5Z"
      stroke="#F07C29"
      strokeWidth="0.833333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.095 2.5V17.5"
      stroke="#F07C29"
      strokeWidth="0.833333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.095 4.41406V15.5859"
      stroke="#F07C29"
      strokeWidth="0.833333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.595 2.92969V17.0703"
      stroke="#F07C29"
      strokeWidth="0.833333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CancelledIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="21"
    height="20"
    viewBox="0 0 21 20"
    fill="none"
  >
    <path
      d="M2.85297 8.05469C3.19448 6.78496 3.86246 5.62678 4.79047 4.69531"
      stroke="#EB4244"
      strokeWidth="0.833333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.79047 15.3047C3.85922 14.3726 3.19083 13.211 2.85297 11.9375"
      stroke="#EB4244"
      strokeWidth="0.833333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.0402 17.2422C10.7692 17.5898 9.42828 17.5898 8.15735 17.2422"
      stroke="#EB4244"
      strokeWidth="0.833333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.3373 11.9453C16.9958 13.215 16.3278 14.3732 15.3998 15.3047"
      stroke="#EB4244"
      strokeWidth="0.833333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.3998 4.69531C16.331 5.62738 16.9994 6.78899 17.3373 8.0625"
      stroke="#EB4244"
      strokeWidth="0.833333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.1496 2.75874C9.42053 2.41115 10.7615 2.41115 12.0324 2.75874"
      stroke="#EB4244"
      strokeWidth="0.833333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ConfirmedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="21"
    height="20"
    viewBox="0 0 21 20"
    fill="none"
  >
    <path
      d="M13.5325 8.125L8.94656 12.5L6.6575 10.3125"
      stroke="#0A9355"
      strokeWidth="0.833333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.095 17.5C14.2371 17.5 17.595 14.1421 17.595 10C17.595 5.85786 14.2371 2.5 10.095 2.5C5.95287 2.5 2.595 5.85786 2.595 10C2.595 14.1421 5.95287 17.5 10.095 17.5Z"
      stroke="#0A9355"
      strokeWidth="0.833333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Ticket Icon
export const TicketIconGreen = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="25"
    height="24"
    viewBox="0 0 25 24"
    fill="none"
  >
    <path
      d="M9.90503 5.25V18.75"
      stroke="#0A9355"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.15504 15.675C3.15409 15.5023 3.21353 15.3346 3.3231 15.2011C3.43266 15.0676 3.58545 14.9765 3.75504 14.9437C4.42959 14.8005 5.03449 14.43 5.46852 13.8941C5.90255 13.3583 6.13938 12.6896 6.13938 12C6.13938 11.3104 5.90255 10.6417 5.46852 10.1059C5.03449 9.57002 4.42959 9.19948 3.75504 9.05625C3.58545 9.02346 3.43266 8.93242 3.3231 8.79889C3.21353 8.66535 3.15409 8.49773 3.15504 8.325V6C3.15504 5.80109 3.23406 5.61032 3.37471 5.46967C3.51536 5.32902 3.70613 5.25 3.90504 5.25H21.905C22.104 5.25 22.2947 5.32902 22.4354 5.46967C22.576 5.61032 22.655 5.80109 22.655 6V8.325C22.656 8.49773 22.5965 8.66535 22.487 8.79889C22.3774 8.93242 22.2246 9.02346 22.055 9.05625C21.3805 9.19948 20.7756 9.57002 20.3416 10.1059C19.9075 10.6417 19.6707 11.3104 19.6707 12C19.6707 12.6896 19.9075 13.3583 20.3416 13.8941C20.7756 14.43 21.3805 14.8005 22.055 14.9437C22.2246 14.9765 22.3774 15.0676 22.487 15.2011C22.5965 15.3346 22.656 15.5023 22.655 15.675V18C22.655 18.1989 22.576 18.3897 22.4354 18.5303C22.2947 18.671 22.104 18.75 21.905 18.75H3.90504C3.70613 18.75 3.51536 18.671 3.37471 18.5303C3.23406 18.3897 3.15504 18.1989 3.15504 18V15.675Z"
      stroke="#0A9355"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Plus Icon Component
export const PlusIconOrange = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M3.75 12H20.25"
      stroke="#FF5B00"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 20.25V3.75"
      stroke="#FF5B00"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ViewReservationsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
    <path d="M5.25 15L15.25 5" stroke="#FF5B00" strokeWidth="0.833333" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.125 5L15.25 5L15.25 13.125" stroke="#FF5B00" strokeWidth="0.833333" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);