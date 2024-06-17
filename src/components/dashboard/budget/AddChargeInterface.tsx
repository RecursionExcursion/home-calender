"use client";

import { useState } from "react";
import { saveBudget } from "../../../api/budget/budgetService";
import { BudgetState } from "./DashboardBudgetUI";
import { useDashboardContext } from "../../../contexts";
import NumberInput from "../../base/NumberInput";
import { createNewCharge, serializeCharge } from "../../../service/chargeService";

type AddChargeInterfaceProps = {
  budgetState: BudgetState;
};

export const AddChargeInterface = (props: AddChargeInterfaceProps) => {
  const { budget, setBudget } = props.budgetState;

  const { showToast } = useDashboardContext();

  const [chargeDraft, setChargeDraft] = useState(getEmptyCharge());

  const handleAddCharge = async () => {
    console.log(validateCharge());

    const budgetCopy = { ...budget };

    const newCharge = createNewCharge(
      chargeDraft.utcDate,
      chargeDraft.amount,
      chargeDraft.description
    );

    budgetCopy.charges.push(serializeCharge(newCharge));

    await saveBudget(budgetCopy);
    setBudget(budgetCopy);
    setChargeDraft(getEmptyCharge());
    showToast({
      title: "Success",
      message: "Charge added successfully",
      type: "success",
    });
  };

  const handleChargeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    let { value } = e.target;

    console.log({ name, value });

    switch (name) {
      case "utcDate":
        const date = new Date(value);

        value = date.toISOString();

        break;
      case "amount":
        if (value === "") break;

        const anyInvalid = value
          .split("")
          .find((char) => isNaN(parseInt(char)) && char !== ".");
        if (anyInvalid) return;

        const fixed2Regex = /^\d+(\.\d{0,2})?$/;
        if (!fixed2Regex.test(value)) return;
        break;
      case "description":
        break;
    }

    setChargeDraft((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateCharge = (): boolean => {
    const amountRegex = /^\$?[\d,]+(\.\d*)?$/;

    if (!amountRegex.test(chargeDraft.amount.toString())) {
      return false;
    }

    chargeDraft.amount = parseFloat(chargeDraft.amount.toString());

    return true;
  };

  return (
    <div className="col-container gap-1">
      <h2 className="text-2xl">Add a Charge</h2>

      <div className="col-container gap-1">
        <label className="text-xl" htmlFor="date">
          Date
        </label>
        <input
          className="db-input"
          type="date"
          name="utcDate"
          value={chargeDraft.utcDate}
          onChange={handleChargeChange}
        />
      </div>

      <div className="col-container gap-1">
        <label className="text-xl" htmlFor="date">
          Amount
        </label>
        <NumberInput
          setter={setChargeDraft}
          className="db-input"
          type="text"
          name="amount"
          value={chargeDraft.amount}
        />
      </div>

      <div className="col-container gap-1">
        <label className="text-xl" htmlFor="date">
          Description
        </label>
        <input
          className="db-input"
          type="text"
          name="description"
          value={chargeDraft.description}
          onChange={handleChargeChange}
        />
      </div>

      <button className="db-button" onClick={handleAddCharge}>
        Add Charge
      </button>
    </div>
  );
};

type ChargeDraft = {
  utcDate: string;
  amount: number;
  description: string;
};

const getEmptyCharge = (): ChargeDraft => {
  return {
    utcDate: new Date().toISOString(),
    amount: 0.0,
    description: "",
  };
};
