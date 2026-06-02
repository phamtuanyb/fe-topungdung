import Image from "next/image";
import { RelatedArticle } from "../_config";

type Props = {
  article: RelatedArticle;
}

const RelatedCard = ({ article }: Props) => {
  return (
    <a
      href={article.href}
      className="group block rounded-xl overflow-hidden border border-gray-200 bg-white hover:border-[#1E5BC6] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="aspect-video overflow-hidden">
        <Image
          src={article.img}
          alt={article.imgAlt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          width={400}
          height={225}
          priority
          unoptimized
        />
      </div>
      <div className="p-4">
        <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#1E5BC6] mb-1.5">
          {article.cat}
        </div>
        <h4 className="text-[13.5px] font-bold text-[#1A1A1A] leading-snug line-clamp-2">
          {article.title}
        </h4>
      </div>
    </a>
  );
}

export default RelatedCard