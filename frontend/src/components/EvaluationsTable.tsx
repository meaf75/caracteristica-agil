"use client";


import { Evaluation } from "@/types";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function EvaluationsTable() {
    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>("all");
    const [page, setPage] = useState(1);
    const tableRef = useRef<HTMLTableSectionElement>(null);

    useEffect(() => {
        async function fetchEvaluations() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/evaluations`, { cache: "no-store" });
                if (!res.ok) throw new Error("Failed to fetch evaluations");
                const data = await res.json();
                setEvaluations(data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Unknown error");
                }
            } finally {
                setLoading(false);
            }
        }
        fetchEvaluations();
    }, []);

    const filtered = evaluations.filter((ev) =>
        filter === "all" ? true : ev.decision === filter
    );
    const pageSize = 5;
    const totalPages = Math.ceil(filtered.length / pageSize);
    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

    useEffect(() => {
        if (tableRef.current) {
            gsap.fromTo(
                tableRef.current.querySelectorAll("tr"),
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: "power3.out",
                }
            );
        }
    }, [paginated]);

    return (
        <>
            {/* Filters */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <select
                    value={filter}
                    onChange={(e) => {
                        setFilter(e.target.value);
                        setPage(1);
                    }}
                    className="w-full md:w-48 h-12 px-3 rounded-lg border border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    <option value="all">All decisions</option>
                    <option value="Approve">Approve</option>
                    <option value="Refer">Refer</option>
                    <option value="Decline">Decline</option>
                </select>
                <span className="text-gray-600 text-sm">
                    Showing {paginated.length} of {filtered.length} evaluations
                </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="px-4 py-3 text-left">Decision</th>
                            <th className="px-4 py-3 text-left">DTI</th>
                            <th className="px-4 py-3 text-left">LTV</th>
                            <th className="px-4 py-3 text-left">Credit</th>
                            <th className="px-4 py-3 text-left">Occupancy</th>
                            <th className="px-4 py-3 text-left">Reasons</th>
                            <th className="px-4 py-3 text-left">Date</th>
                        </tr>
                    </thead>
                    <tbody ref={tableRef} className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="text-center py-6 text-gray-500 italic">
                                    Loading evaluations...
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan={7} className="text-center py-6 text-red-500 italic">
                                    {error}
                                </td>
                            </tr>
                        ) : paginated.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-6 text-gray-500 italic">
                                    No evaluations found
                                </td>
                            </tr>
                        ) : (
                            paginated.map((ev) => (
                                <tr key={ev.id} className="hover:bg-gray-50 transition">
                                    <td
                                        className={`px-4 py-3 font-semibold ${ev.decision === "Approve"
                                            ? "text-green-600"
                                            : ev.decision === "Refer"
                                                ? "text-yellow-600"
                                                : "text-red-600"
                                            }`}
                                    >
                                        {ev.decision}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{(ev.dti * 100).toFixed(2)}%</td>
                                    <td className="px-4 py-3 text-gray-600">{(ev.ltv * 100).toFixed(2)}%</td>
                                    <td className="px-4 py-3 text-gray-600">{ev.input.credit}</td>
                                    <td className="px-4 py-3 capitalize text-gray-600">{ev.input.occupancy}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {ev.reasons.join(", ")}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {new Date(ev.created_at).toLocaleString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && !loading && !error && (
                <div className="flex justify-center items-center gap-4 mt-6">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="bg-blue-300 text-white-700 px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-600"
                    >
                        Prev
                    </button>
                    <span className="text-gray-700">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="bg-blue-300 text-white-700 px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-600"
                    >
                        Next
                    </button>
                </div>
            )}
        </>
    )
}