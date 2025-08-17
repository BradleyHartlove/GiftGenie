import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { signOut } from 'firebase/auth';
import firebaseAuth from '../firebase/auth';
import { useSession } from '../SessionContext';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { doc } from 'firebase/firestore';
import db from '../firebase/database';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

interface User {
  id: string;
  name: string;
  uid: string;
}

interface Group {
  id: number;
  name: string;
}

interface Item {
  id: number;
  name: string;
  url: string;
  purchased: boolean;
}

interface List {
  id: number;
  name: string;
  owner: string;
  group: string;
  items: Item[];
  endDate: string;
}

export default function HomePage() {
  const { session } = useSession();
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [showAddGroupModal, setShowAddGroupModal] = React.useState(false);
  const [selectedGroup, setSelectedGroup] = React.useState<Group | null>(null);

  useEffect(() => {
    async function fetchUserGroups() {
      if (!session?.user.id) return;

      console.log("Fetching groups for user:", session.user.id);

      const userRef = doc(db, "users", session.user.id);
      console.log(`usersref: ${userRef.id}`);

      // const q = query(
      //   collection(db, 'user_group_mappings'),
      //   where('userId', '==', userRef)
      // );
      // const querySnapshot = await getDocs(q);
      // const groupsData = querySnapshot.docs.map(doc => ({
      //   id: doc.id,
      //   ...doc.data(),
      // }));
      // // Now you can use groupsData to get group references for this user
      // // setUserGroups(groupsData);
      // console.log(groupsData)
    }
    fetchUserGroups();
  }, [session]);

  // Test Data
  const groups = [
    {
      id: 1,
      name: "Holiday 2025 Family",
      members: ["Alice", "Bob", "Charlie"],
      lists: [
        { id: 1, name: "Gift Ideas", items: ["Book", "Toy", "Gadget"] },
        { id: 2, name: "Shopping List", items: ["Wrapping Paper", "Cards"] }
      ]
    },
    {
      id: 2,
      name: "Birthday 2025 Friends",
      members: ["George", "Sally"],
      lists: [
        { id: 1, name: "Gift Ideas", items: ["Watch", "Perfume"] },
        { id: 2, name: "Party Supplies", items: ["Balloons", "Cake"] },
        { id: 3, name: "Guest List", items: ["John", "Jane", "Doe"] }
      ]
    },
  ]

  // console.log(session?.user.name)
  return (
    <Stack direction="column" spacing={2} className="h-screen">
      <div>
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
      </div>
      <div className="px-6">
        <Card>
          <CardContent>
            <div className="flex flex-col h-full">
              <div className="flex flex-row">
                <div className="flex flex-row gap-2 items-center">
                  <div>
                    <PeopleIcon fontSize="large" />
                  </div>
                  <div>
                    My Groups
                  </div>
                </div>
                <div className="ml-auto">
                  <IconButton
                    aria-label="Add Group"
                    size="medium"
                    onClick={() => setShowAddGroupModal(true)}>
                    <AddIcon fontSize="large" />
                  </IconButton>
                </div>
              </div>
              {/* Group Selection*/}
              <div className="flex flex-col gap-4 mt-4">
                {groups.map((group, index) => (
                  <div key={index}
                    onClick={() => setSelectedGroup(group)}
                    className={`flex flex-col p-4 border rounded-lg ${selectedGroup?.id == group.id ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300 hover:bg-gray-50 cursor-pointer'}`}>
                    <div className="font-semibold text-lg">
                      {group.name}
                    </div>
                    <div className="text-gray-600">
                      Members: {group.members.length}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Group Information*/}
        {selectedGroup && (
          <Card className="mt-4">
            <CardContent>
              <div className="flex flex-col gap-4 mt-4">
                <div className="flex flex-row items-center">
                  <div className="font-semibold text-xl text-gray-800">
                    <h2>{selectedGroup.name}</h2>
                  </div>
                  <div className="ml-auto">
                    <Button variant="contained">+ New List</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Add Group Dialog */}
        <Dialog open={showAddGroupModal} onClose={() => setShowAddGroupModal(false)}>
          <DialogTitle>Add New Group</DialogTitle>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const groupName = formData.get('groupName') as string;
              // Handle group creation logic here
              console.log("Creating group:", groupName);
              setShowAddGroupModal(false);
            }}
          >
            <DialogContent>
              <input
                type="text"
                name="groupName"
                placeholder="Group Name"
                className="border border-gray-300 p-2 rounded w-full"
                required
              />
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" onClick={() => setShowAddGroupModal(false)}>Cancel</Button>
              <Button type="submit" variant="contained">Create</Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    </Stack>
  )
}