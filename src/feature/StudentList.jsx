import { useState } from "react";
import useStudent from "./useStudent";
import Spinner from "../ui/Spinner";
import { useNavigate } from "react-router-dom";
import { CRUD_SERVICE } from "../Url";
import { useQueryClient } from "@tanstack/react-query";
import { AUTH_REQUEST } from "../axiosConfig";

function StudentList() {
  const { isLoading, students } = useStudent();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    dateOfBirth: "",
    university: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleOpenForm = (student = null) => {
    if (student) {
      setFormData({
        id: student.id,
        name: student.name,
        dateOfBirth: student.dateOfBirth,
        university: student.university,
      });
      setIsEditing(true);
    } else {
      setFormData({ id: null, name: "", dateOfBirth: "", university: "" });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseForm = () => {
    setIsModalOpen(false);
    setFormData({ id: null, name: "", dateOfBirth: "", university: "" });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    try {
      if (isEditing) {
        // Update student
        await AUTH_REQUEST.put(`${CRUD_SERVICE}/api/v1/students`, formData);
        alert("Student updated successfully");
      } else {
        // Create student
        await AUTH_REQUEST.post(`${CRUD_SERVICE}/api/v1/students`, formData);
        alert("Student added successfully");
      }
      queryClient.invalidateQueries({ queryKey: ["students"] });
      handleCloseForm();
    } catch (error) {
      alert(`Error ${isEditing ? "updating" : "adding"} student: ${error.message}`);
    }
  };

  const handleDelete = async (studentId) => {
    if (confirm("Delete this student?")) {
      try {
        await AUTH_REQUEST.delete(`${CRUD_SERVICE}/api/v1/students/${studentId}`);
        alert("Student deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["students"] });
      } catch (error) {
        alert(`Error deleting student: ${error.message}`);
      }
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Student Information - V2</h1>
      <div className="mb-4">
        <button
          onClick={() => handleOpenForm()}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Student
        </button>
      </div>

      {/* Modal for Add/Update Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? "Update Student" : "Add Student"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">University</label>
                <input
                  type="text"
                  name="university"
                  value={formData.university}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {isEditing ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Table */}
      <div className="overflow-x-auto">
        <table className="table-auto text-lg w-full border border-gray-300 shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Date of Birth</th>
              <th className="px-4 py-2 border">University</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border px-4 py-2 text-center">{student.id}</td>
                <td className="border px-4 py-2">{student.name}</td>
                <td className="border px-4 py-2 text-center">{student.dateOfBirth}</td>
                <td className="border px-4 py-2">{student.university}</td>
                <td className="border px-4 py-2 flex justify-center gap-2">
                  <button
                    onClick={() => handleOpenForm(student)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(student.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentList;