import React from "react";
import {
  FaCcApplePay,
  FaCcDiscover,
  FaCcMastercard,
  FaCcPaypal,
  FaCcVisa,
} from "react-icons/fa";
import { SiAmericanexpress } from "react-icons/si";

export const PaymentOptions = ({ size = 33 }: any) => {
  return (
    <div className="flex gap-2">
      <FaCcVisa size={size} color="#1a1f71" />
      <FaCcDiscover size={size} color="#E55C20" />
      <FaCcMastercard size={size} color="#EB001B" />
      <FaCcPaypal size={size} color="#00457C" />
      <FaCcApplePay size={size} />
      <SiAmericanexpress size={size} color="blue" />
    </div>
  );
};
