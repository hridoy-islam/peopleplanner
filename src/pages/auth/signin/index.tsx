import { Layers } from 'lucide-react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import UserAuthForm from './components/user-auth-form';
import signIn from "../../../assets/imges/home/authImg.png"

export default function SignInPage() {
  const { user } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/admin/people-planner'); // Adjust the path as needed
    }
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="flex w-full items-center justify-center bg-gray-50 px-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          <div className="mb-10">
            <h2 className="text-4xl text-supperagent font-bold">Sign In</h2>
          </div>

          <UserAuthForm />
        </div>
      </div>
      

      {/* Right Section */}
      <div className="relative hidden w-1/2 bg-supperagent lg:block">
        <div className="flex h-full flex-col gap-4 p-8">
          {/* Logo */}
          <div className="flex items-center gap-2 text-white">
            <Layers className="h-6 w-6" />
            <span className="text-lg font-semibold">People Planner</span>
          </div>

          {/* Main Content */}
          <div className='flex flex-col items-center justify-center h-full'>

          <div className="flex flex-col items-center z-10 ">
            <div className="mb-4 ">
              <img
                src={signIn}
                alt="Desk illustration"
                width={550}
                height={200}
                />
            </div>

            <h1 className="mb-3 text-3xl font-bold text-white">
              A few more clicks to 
              sign in to your account.
            </h1>
           
          </div>
                </div>
        </div>

        {/* Curved Edge */}
        <div
          className="absolute right-0 top-0 h-full w-32 bg-supperagent"
          style={{
            clipPath:
              'polygon(100% 0, 0% 0, 0 100%, 100% 100%, 100% 0, 100% 0, 0 100%, 0 100%)',
            background: `linear-gradient(to right,  0%, transparent 100%)`
          }}
        />
      </div>
    </div>
  );
}
