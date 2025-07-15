import React from "react";
import {
  FaCcApplePay,
  FaCcDiscover,
  FaCcMastercard,
  FaCcPaypal,
  FaCcVisa,
} from "react-icons/fa";
import { SiAmericanexpress } from "react-icons/si";

export const PaymentOptions = () => {
  return (
    <div className="flex gap-2">
      <FaCcVisa size={33} color="#1a1f71" />
      <FaCcDiscover size={33} color="#E55C20" />
      <FaCcMastercard size={33} color="#EB001B"/>
      <FaCcPaypal size={33} color="#00457C"/>
      <FaCcApplePay size={33} />
      <SiAmericanexpress size={33} color="blue" />
    </div>
  );
};
