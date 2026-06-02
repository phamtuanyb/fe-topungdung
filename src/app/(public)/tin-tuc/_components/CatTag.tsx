import { NEWS_TAG_STYLES, NewsTagVariant } from "../_config";

type Props = {
    label: string;
    variant: NewsTagVariant;
}

const CatTag = ({ label, variant }: Props) => {
    return (
        <span
            className={`inline-block text-[10.5px] font-extrabold tracking-widest uppercase px-2.5 py-0.5 rounded-full ${NEWS_TAG_STYLES[variant]} w-fit`}
        >
            {label}
        </span>
    );
}

export default CatTag