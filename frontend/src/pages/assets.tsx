import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { DollarSign, ShoppingCart, TrendingDown, Users, Pencil } from 'lucide-react';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Asset {
  id: number;
  barcode: string;
  name: string;
  status: string;
  description?: string;
}
interface Stat {
  status: string;
  count: number;
}
interface Summary {
  total: number;
  statuses: Record<string, number>;
}
interface Report {
  propertyIncome: number;
  propertySold: number;
  propertyOutcome: number;
  propertyClient: number;
  sellingReports: { month: string; value: number }[];
}

const STATUS_COLORS: Record<string, string> = {
  'ปกติ': 'badge-success',
  'ชำรุด': 'badge-warning',
  'สูญหาย': 'badge-error',
  'ระหว่างซ่อมแซม': 'badge-info',
};

const STATUS_ORDER = ['ชำรุด', 'ปกติ', 'ระหว่างซ่อมแซม', 'สูญหาย'];

export default function AssetsDashboard() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [selected, setSelected] = useState<Asset | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAssets();
    fetchStats();
    fetchSummary();
    fetchReport();
  }, []);

  const fetchAssets = async () => {
    const res = await axios.get('http://localhost:4000/api/assets');
    setAssets(res.data);
  };
  const fetchStats = async () => {
    const res = await axios.get('http://localhost:4000/api/assets/stats');
    setStats(res.data);
  };
  const fetchSummary = async () => {
    const res = await axios.get('http://localhost:4000/api/assets/summary');
    setSummary(res.data);
  };
  const fetchReport = async () => {
    const res = await axios.get('http://localhost:4000/api/assets/report');
    setReport(res.data);
  };

  const openModal = (asset: Asset) => {
    setSelected(asset);
    setStatus(asset.status);
    setModalOpen(true);
    setError("");
    setSuccess("");
  };

  const handleUpdateStatus = async () => {
    if (!selected) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await axios.patch(`http://localhost:4000/api/assets/${selected.barcode}/status`, { status });
      setSuccess("อัปเดตสถานะสำเร็จ");
      setAssets(assets.map(a => a.barcode === selected.barcode ? { ...a, status } : a));
      fetchStats();
      fetchSummary();
    } catch (e: any) {
      setError(e.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  const chartData = report ? {
    labels: report.sellingReports.map(r => r.month),
    datasets: [
      {
        label: 'Selling Reports',
        data: report.sellingReports.map(r => r.value),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239,68,68,0.1)',
        tension: 0.4,
      },
    ],
  } : undefined;

  return (
    <div className="flex min-h-screen bg-neutral">
      {/* Sidebar */}
      <aside className="w-60 min-h-screen bg-black text-white flex flex-col shadow-xl">
        <div className="p-6 text-2xl font-bold tracking-widest text-red-500">ASSETS</div>
        <ul className="menu menu-lg text-base-content">
          <li><a className="btn btn-error text-white font-bold mb-2">Dashboard</a></li>
          <li><a className="text-gray-400">Reports</a></li>
          <li><a className="text-gray-400">Settings</a></li>
        </ul>
      </aside>
      {/* Main */}
      <main className="flex-1 p-8">
        {/* Card summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="card bg-white shadow-lg border-t-4 border-red-500">
            <div className="card-body items-center">
              <div className="text-xs text-gray-400 mb-1">Property Income</div>
              <div className="text-2xl font-bold text-black">{report?.propertyIncome?.toLocaleString() ?? '-'}</div>
            </div>
          </div>
          <div className="card bg-white shadow-lg border-t-4 border-red-500">
            <div className="card-body items-center">
              <div className="text-xs text-gray-400 mb-1">Property Sold</div>
              <div className="text-2xl font-bold text-black">{report?.propertySold?.toLocaleString() ?? '-'}</div>
            </div>
          </div>
          <div className="card bg-white shadow-lg border-t-4 border-red-500">
            <div className="card-body items-center">
              <div className="text-xs text-gray-400 mb-1">Property Outcome</div>
              <div className="text-2xl font-bold text-black">{report?.propertyOutcome?.toLocaleString() ?? '-'}</div>
            </div>
          </div>
          <div className="card bg-white shadow-lg border-t-4 border-red-500">
            <div className="card-body items-center">
              <div className="text-xs text-gray-400 mb-1">Property Client</div>
              <div className="text-2xl font-bold text-black">{report?.propertyClient?.toLocaleString() ?? '-'}</div>
            </div>
          </div>
        </div>
        {/* Chart + Stat */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="col-span-2 card bg-white shadow-lg">
            <div className="card-body">
              <div className="text-sm font-semibold mb-2 text-black">Selling Reports</div>
              {chartData && <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} height={80} />}
            </div>
          </div>
          {/* สรุปสถานะแนวนอน */}
          <div className="card bg-white shadow-lg">
            <div className="card-body items-center">
              <div className="text-lg font-bold mb-2 text-black">สถานะครุภัณฑ์</div>
              <div className="flex flex-col gap-2 w-full">
                {STATUS_ORDER.map((status) => (
                  <div key={status} className="flex items-center gap-2">
                    <span className={`badge ${STATUS_COLORS[status]} text-white text-base px-4 py-2`}>{status}</span>
                    <span className="text-black text-lg font-bold ml-2">{summary?.statuses[status] ?? 0}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-xs text-gray-400">รวม {summary?.total ?? '-'} รายการ</div>
            </div>
          </div>
        </div>
        {/* Search & Table */}
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-white">รายการคุรุภัณฑ์</h1>
          <input
            type="text"
            placeholder="ค้นหาด้วยชื่อหรือ barcode"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input input-bordered input-md w-64 bg-white text-black"
          />
        </div>
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="table table-zebra bg-white">
            <thead className="bg-black text-white">
              <tr>
                <th>#</th>
                <th>Barcode</th>
                <th>ชื่อ</th>
                <th>สถานะ</th>
                <th>รายละเอียด</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {assets.filter(a =>
                a.name.includes(search) || a.barcode.includes(search)
              ).map((a, i) => (
                <tr key={a.id} className="hover:bg-red-50">
                  <td>{i + 1}</td>
                  <td className="font-mono text-black">{a.barcode}</td>
                  <td className="text-black">{a.name}</td>
                  <td><span className={`badge ${STATUS_COLORS[a.status]} text-white text-base px-4 py-2`}>{a.status}</span></td>
                  <td className="text-black">{a.description}</td>
                  <td>
                    <button className="btn btn-sm btn-error text-white" onClick={() => openModal(a)}>ดู/แก้ไข</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Modal */}
        {modalOpen && (
          <dialog className="modal modal-open">
            <form method="dialog" className="modal-box bg-white text-black">
              <h3 className="font-bold text-lg mb-2 text-red-500">ข้อมูลคุรุภัณฑ์</h3>
              {selected && (
                <div className="space-y-2">
                  <div><b>Barcode:</b> {selected.barcode}</div>
                  <div><b>ชื่อ:</b> {selected.name}</div>
                  <div><b>รายละเอียด:</b> {selected.description || '-'}</div>
                  <div>
                    <label className="block mb-1">สถานะ:</label>
                    <select
                      className="select select-bordered w-full"
                      value={status}
                      onChange={e => setStatus(e.target.value)}
                    >
                      {Object.keys(STATUS_COLORS).map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  {success && <div className="text-green-600">{success}</div>}
                  {error && <div className="text-red-500">{error}</div>}
                </div>
              )}
              <div className="modal-action">
                <button type="button" className="btn btn-error text-white" onClick={handleUpdateStatus} disabled={loading || !selected}>บันทึกสถานะ</button>
                <button type="button" className="btn" onClick={() => setModalOpen(false)}>ปิด</button>
              </div>
            </form>
          </dialog>
        )}
      </main>
    </div>
  );
}
