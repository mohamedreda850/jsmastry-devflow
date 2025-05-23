import Image from 'next/image';
import Link from 'next/link';

interface Props{
    imageUrl:string;
    href:string;
    title:string;
}
const ProfileLink = ({imageUrl, href, title}:Props) => {
  return (
    <div className='flex-center gap-1'>
      <Image src={imageUrl} alt={title} width={20} height={20}/>
      {href?(
        <Link href={href} target='_blank' rel='noopenner noreferrer' className='paragraph-medium text-link-100'>{title}</Link>
      ):(
        <p className='paragraph-medium text-dark400_light700'>{title}</p>
      )}
    </div>
  )
}

export default ProfileLink
