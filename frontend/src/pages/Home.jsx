
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TrendingUp } from 'lucide-react';
import User from '../components/User';
import Leaderboard from '../components/Leaderboard';
import AddNewUser from '../components/AddNewUser';
import ClaimHistory from '../components/ClaimHistory';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [pointsClaimed, setPointsClaimed] = useState('');
  const [claimHistory, setClaimHistory] = useState([]);

  const BASE_URL = 'https://threew-hiring-task.onrender.com';

  const fetchClaimHistory = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/claim/history`);
      setClaimHistory(res.data);
    } catch (error) {
      console.error('Failed to fetch claim history', error);
    }
  };

  const handleClaim = async () => {
    if (!selectedUser?._id) return;

    try {
      const res = await axios.post(`${BASE_URL}/api/claim`, {
        userId: selectedUser._id,
      });

      setPointsClaimed(res.data.pointsAwarded);
      setLeaderboard(res.data.leaderboard);
      fetchUsers();
      fetchClaimHistory();
    } catch (error) {
      console.error('Claim failed:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/users`);
      setUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/users/leaderboard`);
      setLeaderboard(res.data);
    } catch (error) {
      console.error('Failed to fetch leaderboard', error);
    }
  };

  const AddUser = async (name) => {
    try {
      await axios.post(`${BASE_URL}/api/users`, { name });
      fetchUsers();
      fetchLeaderboard();
    } catch (error) {
      console.error('Failed to add user', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchLeaderboard();
    fetchClaimHistory();
  }, []);

  return (
    <div className="h-screen w-full p-4 sm:p-6 md:p-10 overflow-auto">
      <div className="flex flex-col items-center justify-start space-y-10 w-full h-full">

        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-semibold flex items-center gap-1">
            Ran<span className="text-blue-500">k</span>errr
          </h1>
          <TrendingUp size={40} className="rotate-345 sm:size-[60px]" color="blue" />
        </div>

        <div className="w-full sm:w-[80%] md:w-[60%] flex flex-col rounded-lg shadow-md shadow-gray-600">
          <User
            users={users}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            handleClaim={handleClaim}
            PointsClaimed={pointsClaimed}
            setPointsClaimed={setPointsClaimed}
          />
        </div>

        <div className="w-full sm:w-[80%] md:w-[60%] flex flex-col rounded-lg shadow-md shadow-gray-600">
          <AddNewUser AddUser={AddUser} />
        </div>

        <div className="w-full sm:w-[80%] md:w-[60%] flex flex-col rounded-lg shadow-md shadow-gray-600">
          <Leaderboard leaderboard={leaderboard} />
        </div>

        <div className="w-full sm:w-[80%] md:w-[60%] flex flex-col rounded-lg shadow-md shadow-gray-600">
          <ClaimHistory claimHistory={claimHistory} users={users} />
        </div>
      </div>
    </div>
  );
};

export default Home;
