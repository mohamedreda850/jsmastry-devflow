import { auth } from "@/Auth";
import { getUser } from "@/lib/actions/user.action";
import { IUserDoc } from "@/database/user.model";
import ProfileForm from "@/components/forms/ProfileForm";
import { redirect } from "next/navigation";
import ROUTES from "@/constants/routes";

const EditProfilePage = async () => {
  const session = await auth();
  if (!session?.user?.id) redirect(ROUTES.SIGN_IN);

  const { success, data } = await getUser({ userId: session.user.id });
  if (!success) redirect(ROUTES.SIGN_IN);

  return (
    <div className="flex flex-col gap-9">
      <div>
        <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
        <p className="paragraph-regular text-dark400_light800 mt-3.5">
          Make changes to your profile here. Click save when you&apos;re done.
        </p>
      </div>

      <ProfileForm user={data?.user as unknown as IUserDoc} />
    </div>
  );
};

export default EditProfilePage; 