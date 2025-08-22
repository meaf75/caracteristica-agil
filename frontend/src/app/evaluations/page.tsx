
import EvaluationsTable from "@/components/EvaluationsTable";

export default function EvaluationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-6 py-10 flex flex-col items-center">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Past Evaluations
        </h1>
        <EvaluationsTable />
      </div>
    </div>
  );
}
