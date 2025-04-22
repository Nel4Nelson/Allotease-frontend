import React from "react";

const accountOptions = [
  {
    label: "Sign up as attendee",
    type: "attendee",
    iconType: "person",
  },
  {
    label: "Sign up as Allocation Admin",
    type: "admin",
    iconType: "building",
  },
];

type SignupNavProps = {
  onSelect: (type: string) => void;
};

const SignupNav: React.FC<SignupNavProps> = ({ onSelect }) => {
  return (
    <div>
      <div className="flex flex-col gap-4 mt-4">
        {accountOptions.map((option, index) => (
          <div
            key={index}
            onClick={() => onSelect(option.type)}
            className="font-semibold font-source text-lg text-[#FF5B00] flex justify-between p-4 py-8 rounded-lg bg-[#F2F4F799]"
          >
            <div className="flex items-center gap-2">
              {option.iconType === "person" ? (
                // Person Icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="#FF5B00"
                  viewBox="0 0 256 256"
                >
                  <path d="M160,40a32,32,0,1,0-32,32A32,32,0,0,0,160,40ZM128,56a16,16,0,1,1,16-16A16,16,0,0,1,128,56Zm90.34,78.05L173.17,82.83a32,32,0,0,0-24-10.83H106.83a32,32,0,0,0-24,10.83L37.66,134.05a20,20,0,0,0,28.13,28.43l16.3-13.08L65.55,212.28A20,20,0,0,0,102,228.8l26-44.87,26,44.87a20,20,0,0,0,36.41-16.52L173.91,149.4l16.3,13.08a20,20,0,0,0,28.13-28.43Zm-11.51,16.77a4,4,0,0,1-5.66,0c-.21-.2-.42-.4-.65-.58L165,121.76A8,8,0,0,0,152.26,130L175.14,217a7.72,7.72,0,0,0,.48,1.35,4,4,0,1,1-7.25,3.38,6.25,6.25,0,0,0-.33-.63L134.92,164a8,8,0,0,0-13.84,0L88,221.05a6.25,6.25,0,0,0-.33.63,4,4,0,0,1-2.26,2.07,4,4,0,0,1-5-5.45,7.72,7.72,0,0,0,.48-1.35L103.74,130A8,8,0,0,0,91,121.76L55.48,150.24c-.23.18-.44.38-.65.58a4,4,0,1,1-5.66-5.65c.12-.12.23-.24.34-.37L94.83,93.41a16,16,0,0,1,12-5.41h42.34a16,16,0,0,1,12,5.41l45.32,51.39c.11.13.22.25.34.37A4,4,0,0,1,206.83,150.82Z" />
                </svg>
              ) : (
                // Building Icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="#FF5B00"
                  viewBox="0 0 256 256"
                >
                  <path d="M248,208H232V96a8,8,0,0,0,0-16H184V48a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16V208H24a8,8,0,0,0,0,16H248a8,8,0,0,0,0-16ZM216,96V208H184V96ZM56,48H168V208H144V160a8,8,0,0,0-8-8H88a8,8,0,0,0-8,8v48H56Zm72,160H96V168h32ZM72,80a8,8,0,0,1,8-8H96a8,8,0,0,1,0,16H80A8,8,0,0,1,72,80Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H128A8,8,0,0,1,120,80ZM72,120a8,8,0,0,1,8-8H96a8,8,0,0,1,0,16H80A8,8,0,0,1,72,120Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H128A8,8,0,0,1,120,120Z" />
                </svg>
              )}
              <p>{option.label}</p>
            </div>

            {/* Arrow Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="#e15b00"
              viewBox="0 0 256 256"
            >
              <path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SignupNav;
