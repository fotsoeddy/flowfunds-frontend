'use client';
import React, { useState } from "react";

const defaultData = {
  number: "1234567812345678",
  expiryDate: "06/29",
};

export function CreditCardFront() {
  const [creditCardDetails, setCreditCardDetails] = useState(defaultData);
  const [error, setError] = useState({
    number: false,
    expiryDate: false,
  });
  let currentYear = new Date().getFullYear().toString();
  var currentMonth = ("0" + (new Date().getMonth() + 1)).slice(-2);
  
  return (
    <div className="flex flex-col w-full items-center">
      <div className="h-6 mb-2">
        {(error.expiryDate || error.number) && (
          <div className="text-xs text-red-600">
            {error.expiryDate
              ? "Please enter valid expiry date"
              : "Please enter valid card number"}
          </div>
        )}
      </div>
      
      {/* Front of Card */}
      <div className="relative overflow-hidden flex flex-col justify-between bg-[#210D09ED] text-white h-48 w-full max-w-[320px] rounded-xl px-4 py-4 shadow-xl transition duration-400 hover:scale-105">
        <div className="flex gap-2 flex-col text-left">
          <div className="text-xs font-bold text-[#FFFCFC]">
            BANK OF RUQMANIA
          </div>
          <Chip />
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <LeftCaret />
              <input
                className="bg-transparent focus:outline-none border border-transparent focus:border-white/50 w-full text-lg tracking-widest font-mono placeholder:text-white/50"
                type="text"
                value={cc_format(creditCardDetails?.number)}
                onChange={(e) => {
                  const { value } = e?.target;
                  let finalValue = value.replaceAll(" ", "");
                  isNaN(Number(finalValue))
                    ? setError({ ...error, number: true })
                    : finalValue.length < 16
                    ? setError({ ...error, number: true })
                    : setError({ ...error, number: false });
                  setCreditCardDetails({
                    ...creditCardDetails,
                    number: value,
                  });
                }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="text-[8px] uppercase tracking-wider opacity-80">DES RUQMANIA</div>
            <div className="flex items-center gap-2">
              <span className="text-[5px] leading-tight text-right">
                VALID <br />
                THRU
              </span>
              <input
                className="bg-transparent focus:outline-none border border-transparent focus:border-white/50 w-12 text-sm font-mono placeholder:text-white/50"
                type="text"
                value={creditCardDetails?.expiryDate}
                maxLength={5}
                onChange={(e) => {
                  const { value } = e?.target;
                  value.match(/^(0[1-9]|1[0-2])\/(([0-9]{4}|[0-9]{2})$)/)
                    ? value.slice(-2) < currentYear.slice(-2)
                      ? setError({ ...error, expiryDate: true })
                      : value.slice(-2) === currentYear.slice(-2) &&
                        value.slice(0, 2) <= currentMonth
                      ? setError({ ...error, expiryDate: true })
                      : setError({ ...error, expiryDate: false })
                    : setError({ ...error, expiryDate: true });
                  setCreditCardDetails({
                    ...creditCardDetails,
                    expiryDate: value,
                  });
                }}
              />
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 right-4 flex flex-col items-end">
          <MasterCard />
        </div>
      </div>
    </div>
  );
}

export function cc_format(value: string) {
  var v = value
    .replace(/\s+/g, "")
    .replace(/[^0-9]/gi, "")
    .replace(/\D/g, "");
  var matches = v.match(/\d{4,16}/g);
  var match = (matches && matches[0]) || "";
  var parts = [];
  let len, i;
  for (i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }
  if (parts.length) {
    return parts.join("  ");
  } else {
    return v;
  }
}

const Chip = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 48 48"
      className="w-10 h-9"
    >
      <path
        fill="#FF9800"
        d="M5 35V13c0-2.2 1.8-4 4-4h30c2.2 0 4 1.8 4 4v22c0 2.2-1.8 4-4 4H9c-2.2 0-4-1.8-4-4z"
      />
      <path
        fill="#FFD54F"
        d="M43 21v-2H31c-1.1 0-2-.9-2-2s.9-2 2-2h1v-2h-1c-2.2 0-4 1.8-4 4s1.8 4 4 4h3v6h-3c-2.8 0-5 2.2-5 5s2.2 5 5 5h2v-2h-2c-1.7 0-3-1.3-3-3s1.3-3 3-3h12v-2h-7v-6h7zm-26 6h-3v-6h3c2.2 0 4-1.8 4-4s-1.8-4-4-4h-3v2h3c1.1 0 2 .9 2 2s-.9 2-2 2H5v2h7v6H5v2h12c1.7 0 3 1.3 3 3s-1.3 3-3 3h-2v2h2c2.8 0 5-2.2 5-5s-2.2-5-5-5z"
      />
    </svg>
  );
};

const LeftCaret = () => {
  return (
    <svg
      width="13"
      height="15"
      viewBox="0 0 13 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-xl"
    >
      <path
        d="M12.5655 0.785121L12.701 14.4904L0.764073 7.75511L12.5655 0.785121Z"
        fill="#FFFEFE"
      />
    </svg>
  );
};

const MasterCard = () => {
  return (
    <svg
      width="48"
      height="38"
      viewBox="0 0 48 38"
      fill="none"
      className="w-12 h-9"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="33" cy="15" r="15" fill="#FF9548" fillOpacity="0.83" />
      <circle cx="15" cy="15" r="15" fill="#EA2F2F" fillOpacity="0.87" />
    </svg>
  );
};
