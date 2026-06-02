const SidebarNewsletter = () => {
    return (
        <div className="rounded-xl p-7 text-center bg-gradient-to-br from-[#1E5BC6] via-[#2E6FD6] to-[#F47920]">
            <h3 className="text-[16px] font-extrabold text-white mb-2 leading-snug">
                Nhận kiến thức mỗi tuần
            </h3>
            <p className="text-[13px] text-white/75 mb-4 leading-relaxed">
                Bài viết mới về phần mềm &amp; số hóa SME.
            </p>
            <div className="flex flex-col gap-2.5">
                <input
                    type="email"
                    placeholder="Email của bạn…"
                    autoComplete="email"
                    className="px-3.5 py-2.5 rounded-md border-none text-[13.5px] outline-none w-full"
                />
                <button className="py-2.5 rounded-md bg-white text-[#1E5BC6] text-[14px] font-extrabold hover:bg-[#FEF3E8] hover:text-[#D96510] transition-colors duration-150">
                    Đăng ký →
                </button>
            </div>
        </div>
    );
}

export default SidebarNewsletter