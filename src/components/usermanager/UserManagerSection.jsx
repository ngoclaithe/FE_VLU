import React, { useEffect, useState } from "react"; 
import { getAllUsers, updateRoleUser, deleteUser } from "../../services/apiAuth";
import { registerUser } from "../../services/apiAuth"; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserManagerSection = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [editingUserId, setEditingUserId] = useState(null);
    const [editedRole, setEditedRole] = useState("");

    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newRole, setNewRole] = useState("dean");

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            setAccessToken(token);
        } else {
            setError("Không tìm thấy token. Vui lòng đăng nhập lại.");
        }
    }, []);

    useEffect(() => {
        if (accessToken) {
            const fetchUsers = async () => {
                try {
                    const usersData = await getAllUsers(accessToken);
                    setUsers(usersData);
                } catch (err) {
                    setError("Không thể lấy danh sách người dùng.");
                    console.error(err);
                }
            };
            fetchUsers();
        }
    }, [accessToken]);

    const handleEditClick = (userId, currentRole) => {
        setEditingUserId(userId);
        setEditedRole(currentRole);
    };

    const handleSaveClick = (userId) => {
        updateRoleUser(accessToken, userId, editedRole)
            .then(() => {
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === userId ? { ...user, role: editedRole } : user
                    )
                );
                setEditingUserId(null);
                toast.success('Cập nhật vai trò thành công!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    zIndex: 100,
                });
            })
            .catch((err) => {
                console.error("Lỗi khi cập nhật vai trò:", err);
                toast.error("Không thể cập nhật vai trò.", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    zIndex: 100,
                });
            });
    };

    const handleDelete = (userId) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
            deleteUser(accessToken, userId)
                .then(() => {
                    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
                    toast.success('Xóa người dùng thành công!', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        zIndex: 100,
                    });
                })
                .catch((err) => {
                    console.error("Lỗi khi xóa người dùng:", err);
                    toast.error('Không thể xóa người dùng.', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        zIndex: 100,
                    });
                });
        }
    };

    const handleRegister = async () => {
        try {
            await registerUser(newEmail, newPassword, newRole);
            toast.success('Đăng ký tài khoản thành công!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                zIndex: 100,
            });
            setNewEmail("");
            setNewPassword("");
            setNewRole("dean");
        } catch (err) {
            console.error("Lỗi khi đăng ký tài khoản:", err);
            toast.error("Không thể đăng ký tài khoản.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                zIndex: 100,
            });
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">Danh sách người dùng</h1>
                {error && <div className="text-red-500 mb-4">{error}</div>}

                <div className="mb-6 p-4 border rounded shadow-sm">
                    <h2 className="text-lg font-semibold mb-2">Đăng ký tài khoản mới</h2>
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">Email:</label>
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Nhập email"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">Mật khẩu:</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Nhập mật khẩu"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">Vai trò:</label>
                        <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="dean">Chủ nhiệm khoa</option>
                            <option value="teacher">Giảng viên</option>
                            <option value="secretary">Thư ký</option>
                        </select>
                    </div>
                    <button
                        onClick={handleRegister}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Đăng ký
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse border border-gray-300">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">ID</th>
                                <th className="border border-gray-300 px-4 py-2">Email</th>
                                <th className="border border-gray-300 px-4 py-2">Vai trò</th>
                                <th className="border border-gray-300 px-4 py-2">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-100">
                                    <td className="border border-gray-300 px-4 py-2 text-center">{user.id}</td>
                                    <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {editingUserId === user.id ? (
                                            <select
                                                value={editedRole}
                                                onChange={(e) => setEditedRole(e.target.value)}
                                                className="border rounded px-2 py-1"
                                            >
                                                <option value="dean">Chủ nhiệm khoa</option>
                                                <option value="teacher">Giảng viên</option>
                                                <option value="secretary">Thư ký</option>
                                            </select>
                                        ) : (
                                            user.role
                                        )}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {editingUserId === user.id ? (
                                            <button
                                                onClick={() => handleSaveClick(user.id)}
                                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
                                            >
                                                Lưu
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleEditClick(user.id, user.role)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                                            >
                                                Sửa
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default UserManagerSection;
