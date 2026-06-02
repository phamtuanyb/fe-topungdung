import { Author } from "@/types";

type Props = {
  author?: Author;
}

const AuthorCard = ({ author }: Props) => {
  return (
    <div className="flex gap-4 items-start bg-[#F5F7FA] rounded-xl p-6 mt-9">
      <div className="w-14 h-14 text-white rounded-full bg-[#1E5BC6] flex items-center justify-center text-[22px] flex-none">
        {author?.fullName?.charAt(0)}
      </div>
      <div className="flex items-center">
        <h4 className="text-[15px] font-extrabold text-[#1A1A1A] mb-0.5">{author?.fullName}</h4>
        {/* <span className="text-[12.5px] text-[#1E5BC6] font-semibold block mb-2">{author}</span> */}
        {/* <p className="text-[13.5px] text-gray-500 leading-relaxed m-0">{author.bio}</p> */}
      </div>
    </div>
  );
}

export default AuthorCard