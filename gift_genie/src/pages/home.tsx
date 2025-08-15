import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { signOut } from 'firebase/auth';
import firebaseAuth from '../firebase/auth';
import { useSession } from '../SessionContext';


export default function HomePage() {
  const { session } = useSession();

  console.log(session?.user.name)
  return (
    <div className="flex items-center bg-white p-4">
      <div className="font-semibold text-2xl text-gray-800">
        Gift Genie
      </div>
      <div className="flex flex-1 ml-auto justify-end items-center gap-4">
        <div className="text-gray-600 font-semibold">
          {session?.user.name}
        </div>
        <Tooltip title="Logout">
          <IconButton
            aria-label="Delete"
            size="large"
            onClick={() => signOut(firebaseAuth)}
          >
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  )
}