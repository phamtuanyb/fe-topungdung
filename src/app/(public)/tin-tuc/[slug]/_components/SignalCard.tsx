type Props = {
  num: number;
  title: string;
  body: string;
}

const SignalCard = ({ num, title, body }: Props) => {
  return (
    <div className="bg-[#F5F7FA] rounded-xl p-5 my-5 border-l-4 border-[#1E5BC6]">
      <div className="w-7 h-7 rounded-full bg-[#1E5BC6] text-white text-[13px] font-extrabold flex items-center justify-center mb-2.5">
        {num}
      </div>
      <h3 className="text-[16px] font-extrabold text-[#1A1A1A] mb-2">{title}</h3>
      <p className="text-[14.5px] text-gray-500 leading-relaxed m-0">{body}</p>
    </div>
  );
}

export default SignalCard;