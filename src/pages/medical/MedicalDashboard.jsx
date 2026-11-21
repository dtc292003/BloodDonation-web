import { Link } from "react-router";

function MedicalDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold">
        Dashboard MEDICAL
      </h2>

      <Link
        to="/admin"
        className="mt-5 inline-block text-red-600 underline"
      >
        Kiểm thử truy cập ADMIN
      </Link>
    </div>
  );
}

export default MedicalDashboard;