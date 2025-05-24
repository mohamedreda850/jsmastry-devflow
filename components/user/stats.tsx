import { formatNumber } from "@/lib/utils";
import { BadgeCounts } from "@/types/global";
import goldBadge from './../../public/icons/gold-medal.svg'
import silverBadge from './../../public/icons/silver-medal.svg'
import bronzeBadge from './../../public/icons/bronze-medal.svg'
import Image from "next/image";
interface Props{
    totalQuestions:number;
    totalAnswers:number;
    badges:BadgeCounts;
}
interface StatsCardProps{
    imgURL:string;
    value:number;
    title:string;
}
const StatsCard = ({imgURL, value, title}:StatsCardProps)=>(
    <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-start gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
        <Image src={imgURL} alt={title} width={40} height={50}/>
        <div>
            <p className="paragraph-semibold text-dark200_light900">{value}</p>
            <p className="body-medium text-dark400_light700">{title}</p>
        </div>

    </div>
)
const Stats = ({totalQuestions, totalAnswers, badges}:Props) => {
  return (
    <div className="mt-3">
      <h3 className="h3-semibold text-dark100_light900">Stats</h3>
      <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
      <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">

        <div>
            <p className="paragraph-semibold text-dark200_light900">{formatNumber(totalQuestions)}</p>
            <p className="body-medium text-dark200_light900">Questions</p>
        </div>
        <div>
            <p className="paragraph-semibold text-dark200_light900">{formatNumber(totalAnswers)}</p>
            <p className="body-medium text-dark200_light900">Answers</p>
        </div>
        </div>
        <StatsCard
        imgURL = {goldBadge}
        value={badges.GOLD}
        label="Gold Badges"
        />
        <StatsCard
        imgURL = {silverBadge}
        value={badges.SILVER}
        label="Silver Badges"
        />
        <StatsCard
        imgURL = {bronzeBadge}
        value={badges.BRONZE}
        label="Bronze Badges"
        />
      </div>
    </div>
  )
}

export default Stats
