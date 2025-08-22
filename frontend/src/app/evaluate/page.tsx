"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

type EvaluationResult = {
  decision: string;
  dti: number;
  ltv: number;
  reasons: string[];
};

function RandomRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function EvaluatePage() {
  const [form, setForm] = useState({
    income: "",
    debts: "",
    loan: "",
    property: "",
    credit: "",
    occupancy: "primary",
  });

  const [result, setResult] = useState<EvaluationResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current.children,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        }
      );
    }
  }, []);

  const HandleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const OnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          income: Number(form.income),
          debts: Number(form.debts),
          loan: Number(form.loan),
          property: Number(form.property),
          credit: Number(form.credit),
          occupancy: form.occupancy,
        }),
      });

      if (!res.ok) throw new Error("Error en la API");

      const data: EvaluationResult = await res.json();
      setResult(data);

      if (resultRef.current) {
        gsap.fromTo(
          resultRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  //#region for debugging purposes
  const DebugSetApproveCase = () => {
    const income = RandomRange(6000, 12000);
    const debts = RandomRange(500, Math.floor(income * 0.4)); // DTI ≤ 0.43
    const property = RandomRange(200000, 500000);
    const loan = RandomRange(Math.floor(property * 0.5), Math.floor(property * 0.8)); // LTV ≤ 0.8
    const credit = RandomRange(680, 850);

    setForm({
      income: income.toString(),
      debts: debts.toString(),
      loan: loan.toString(),
      property: property.toString(),
      credit: credit.toString(),
      occupancy: "primary",
    });
  };

  const DebugSetReferCase = () => {
    const income = RandomRange(5000, 10000);
    const debts = RandomRange(Math.floor(income * 0.44), Math.floor(income * 0.5)); // 0.43 < DTI ≤ 0.50
    const property = RandomRange(200000, 400000);
    const loan = RandomRange(Math.floor(property * 0.81), Math.floor(property * 0.95)); // 0.80 < LTV ≤ 0.95
    const credit = RandomRange(660, 679); // justo en rango de Refer

    setForm({
      income: income.toString(),
      debts: debts.toString(),
      loan: loan.toString(),
      property: property.toString(),
      credit: credit.toString(),
      occupancy: "primary",
    });
  };

  const DebugSetDeclineCase = () => {
    const income = RandomRange(3000, 7000);
    const debts = RandomRange(Math.floor(income * 0.55), Math.floor(income * 0.8)); // DTI > 0.5
    const property = RandomRange(150000, 300000);
    const loan = RandomRange(Math.floor(property * 0.96), Math.floor(property * 1.2)); // LTV > 0.95
    const credit = RandomRange(500, 650); // bajo

    setForm({
      income: income.toString(),
      debts: debts.toString(),
      loan: loan.toString(),
      property: property.toString(),
      credit: credit.toString(),
      occupancy: "primary",
    });
  };
  //#endregion


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div
        ref={formRef}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8"
        id="evaluation-form"
      >
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Mortgage Evaluation
        </h1>

        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={DebugSetApproveCase}
            className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow"
          >
            Debug: Approve
          </button>
          <button
            type="button"
            onClick={DebugSetReferCase}
            className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow"
          >
            Debug: Refer
          </button>
          <button
            type="button"
            onClick={DebugSetDeclineCase}
            className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow"
          >
            Debug: Decline
          </button>
        </div>

        <form onSubmit={OnSubmit} className="space-y-5">
          <div>
            <label htmlFor="income" className="block text-sm font-medium text-gray-700">
              Monthly Income
            </label>
            <input
              id="income"
              type="number"
              name="income"
              value={form.income}
              onChange={HandleChange}
              placeholder="Ej: 5000"
              className="mt-1 block w-full h-12 px-3 rounded-lg border border-gray-300 
                         text-gray-900 placeholder-gray-400 shadow-sm 
                         focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="debts" className="block text-sm font-medium text-gray-700">
              Monthly Debts
            </label>
            <input
              id="debts"
              type="number"
              name="debts"
              value={form.debts}
              onChange={HandleChange}
              placeholder="Ej: 1200"
              className="mt-1 block w-full h-12 px-3 rounded-lg border border-gray-300 
                         text-gray-900 placeholder-gray-400 shadow-sm 
                         focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="loan" className="block text-sm font-medium text-gray-700">
              Loan Amount
            </label>
            <input
              id="loan"
              type="number"
              name="loan"
              value={form.loan}
              onChange={HandleChange}
              placeholder="Ej: 200000"
              className="mt-1 block w-full h-12 px-3 rounded-lg border border-gray-300 
                         text-gray-900 placeholder-gray-400 shadow-sm 
                         focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="property" className="block text-sm font-medium text-gray-700">
              Property Value
            </label>
            <input
              id="property"
              type="number"
              name="property"
              value={form.property}
              onChange={HandleChange}
              placeholder="Ej: 250000"
              className="mt-1 block w-full h-12 px-3 rounded-lg border border-gray-300 
                         text-gray-900 placeholder-gray-400 shadow-sm 
                         focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="credit" className="block text-sm font-medium text-gray-700">
              Credit Score (FICO)
            </label>
            <input
              id="credit"
              type="number"
              name="credit"
              value={form.credit}
              onChange={HandleChange}
              placeholder="Ej: 700"
              className="mt-1 block w-full h-12 px-3 rounded-lg border border-gray-300 
                         text-gray-900 placeholder-gray-400 shadow-sm 
                         focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="occupancy" className="block text-sm font-medium text-gray-700">
              Occupancy Type
            </label>
            <select
              id="occupancy"
              name="occupancy"
              value={form.occupancy}
              onChange={HandleChange}
              className="mt-1 block w-full h-12 px-3 rounded-lg border border-gray-300 
                         text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="primary">Primary Residence</option>
              <option value="secondary">Secondary Residence</option>
              <option value="investment">Investment Property</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition"
          >
            Evaluate
          </button>
        </form>
      </div>

      {result && (
        <div
          ref={resultRef}
          className="mt-8 w-full max-w-lg bg-white rounded-2xl shadow-xl p-6"
        >
          <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
            Decision:{" "}
            <span
              className={
                result.decision === "Approve"
                  ? "text-green-600"
                  : result.decision === "Refer"
                    ? "text-yellow-600"
                    : "text-red-600"
              }
            >
              {result.decision}
            </span>
          </h2>
          <p className="text-gray-700">
            <strong>DTI:</strong> {(result.dti * 100).toFixed(2)}%
          </p>
          <p className="text-gray-700">
            <strong>LTV:</strong> {(result.ltv * 100).toFixed(2)}%
          </p>
          <div className="mt-4">
            <strong className="text-gray-800">Reasons:</strong>
            <ul className="list-disc list-inside text-gray-700">
              {result.reasons.map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
