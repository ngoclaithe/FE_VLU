import React from 'react';

export const Footer = () => {
    return (
        <footer className="bg-white shadow-md mt-auto relative z-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            Liên hệ
                        </h3>
                        <ul className="space-y-2 text-gray-600">
                            <li>Số 45 Nguyễn Kiệm, P. 3, Q. Gò Vấp, TP. Hồ Chí Minh</li>
                            <li>Email: contact@vlu.edu.vn</li>
                            <li>Điện thoại: (84-28) 3588 0101</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            Liên kết
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-blue-600 hover:underline">
                                    Trang chủ Đại học Văn Lang
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-blue-600 hover:underline">
                                    Cổng thông tin sinh viên
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-blue-600 hover:underline">
                                    Thư viện số
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Copyright */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            Về chúng tôi
                        </h3>
                        <p className="text-gray-600">
                            © 2024 Trường Đại học Văn Lang.
                            <br />
                            Mọi quyền được bảo lưu.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
